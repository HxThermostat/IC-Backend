import React, { useCallback, useEffect, useMemo, useState } from "react";

import { BottomSheetSectionList } from "@gorhom/bottom-sheet";

import {
  Component_SelectModeModal_ControllerFragment as Controller,
  Component_SelectModeModal_LocationFragment as Location,
  Component_SelectModeModal_ModeFragment as Mode,
  EffectiveMode,
  GoBack,
  WithQueryDataProps,
  useChangeModeMutation,
  useSelectModeQuery,
  useToggleLocationAwayMutation,
  withQueryData,
} from "~/graph";

import i18n from "~/i18n";

import BottomSheetModal, {
  BottomSheetModalRef,
} from "~/components/BottomSheetModal";

import {
  BaseListItem,
  ListItem,
  SectionListDefaults,
} from "~/components/Lists";
import Divider from "~/components/Lists/Divider";
import { ListItemCheckmark } from "~/components/Lists/ListItem";

import { ModeIcon } from "~/components/Icons";
import Switch from "~/components/Switch";
import Box from "~/components/Box";

import { useFeatureFlags } from "~/contexts";

import { useTheme } from "~/theme";

import { hapticSelectionIOS } from "~/utils/haptics";
import { KohortFunnelEventStep, useKohortTracking } from "~/utils/kohort";

const scope = "Components.SelectModeModal";

function modeEnabled(current: Mode, target: Mode): boolean {
  return !!current.transitionTo.find((mode) => mode.name === target.name);
}

interface SelectModeProps {
  controller: Controller;
  location: Location;
  setSnapPoints: (snapPoints: Array<number | string>) => void;
}

function SelectMode({
  controller,
  location,
  setSnapPoints,
}: SelectModeProps): JSX.Element {
  const { handleFeature } = useFeatureFlags();
  const { colors } = useTheme();
  const { trackFeatureUse, trackFunnel } = useKohortTracking();

  const [pendingMode, setPendingMode] = useState<Mode>();

  const [changeModeMutation] = useChangeModeMutation({
    onCompleted() {
      setPendingMode(undefined);
      void hapticSelectionIOS();
    },
    onError() {
      setPendingMode(undefined);
    },
  });

  const changeMode = useCallback(
    async (mode: Mode) => {
      setPendingMode(mode);
      trackFeatureUse("Change Mode", mode.effectiveMode || "Unknown");
      trackFunnel({ step: KohortFunnelEventStep.Action });
      return changeModeMutation({
        variables: { id: controller.id, mode: mode.name },
      });
    },
    [changeModeMutation, controller, trackFeatureUse, trackFunnel]
  );

  const { away: locationAway } = location;
  const [awayEnabled, setAwayEnabled] = useState(locationAway?.active ?? false);

  useEffect(() => {
    setAwayEnabled(location.away?.active ?? false);
  }, [location.away?.active]);

  const [toggleLocationAway] = useToggleLocationAwayMutation({
    // Manually reconcile the local state with the mutation outcome
    onCompleted: ({ toggleLocationAway }) => {
      if (toggleLocationAway.__typename === "ToggleLocationAwaySuccess") {
        setAwayEnabled(toggleLocationAway.location.away?.active ?? false);
      } else {
        setAwayEnabled((current) => !!current);
      }
    },
  });

  const toggleAway = useCallback(
    (enabled: boolean) => {
      setAwayEnabled(enabled);
      trackFeatureUse("Change Away", enabled ? "enabled" : "disabled");
      trackFunnel({ step: KohortFunnelEventStep.Action });
      void toggleLocationAway({
        variables: {
          input: {
            id: location.id,
            active: enabled,
          },
        },
      });
    },
    [location.id, toggleLocationAway, trackFeatureUse, trackFunnel]
  );

  const awayListItems = useMemo(() => {
    return handleFeature("away", (variant): BaseListItem[] => {
      if (!(variant ?? []).includes("AWAY_LOCATION")) return [];

      return [
        {
          title: i18n.t("away", { scope }),
          onPress: undefined,
          leftElement: <ListItemCheckmark checked={false} />,
          rightElement: (
            <Switch
              value={awayEnabled}
              onValueChange={(enabled) => toggleAway(enabled)}
            />
          ),
        },
      ];
    });
  }, [handleFeature, awayEnabled, toggleAway]);

  const getTextColor = useCallback(
    (effectiveMode: EffectiveMode): string => {
      switch (effectiveMode) {
        case "HEAT":
          return colors.modeHeat;
        case "COOL":
          return colors.modeCool;
        case "HEATCOOL":
        default:
          return colors.text;
      }
    },
    [colors.modeHeat, colors.modeCool, colors.text]
  );

  const primaryListItems = useMemo(
    () => [
      ...controller.modes
        .filter(({ placement }) => placement === "PRIMARY")
        .map<BaseListItem>((mode) => {
          const color = getTextColor(mode.effectiveMode);
          const isPending = pendingMode
            ? pendingMode.name === mode.name
            : undefined;
          const isSelected =
            isPending == null && controller.mode.name === mode.name;

          return {
            title: i18n.t(`modes.${mode.name}`, {
              scope,
              defaultValue: mode.name,
            }),
            titleStyle: { color },
            leftElement: (
              <ListItemCheckmark loading={isPending} checked={isSelected} />
            ),
            rightElement: <ModeIcon mode={mode.effectiveMode} size={20} />,
            onPress: pendingMode
              ? undefined
              : () => {
                  void changeMode(mode);
                },
            disabled: !modeEnabled(controller.mode, mode),
          };
        }),
    ],
    [changeMode, controller.mode, controller.modes, getTextColor, pendingMode]
  );

  const secondaryListItems = useMemo(
    () =>
      controller.modes
        .filter(({ placement }) => placement !== "PRIMARY")
        .map<BaseListItem>((mode) => {
          const isPending = pendingMode
            ? pendingMode.name === mode.name
            : undefined;
          const isSelected =
            isPending == null && controller.mode.name === mode.name;

          return {
            title: i18n.t(`modes.${mode.name}`, {
              scope,
              defaultValue: mode.name,
            }),
            leftElement: (
              <ListItemCheckmark loading={isPending} checked={isSelected} />
            ),
            onPress: pendingMode
              ? undefined
              : () => {
                  void changeMode(mode);
                },
            disabled: !modeEnabled(controller.mode, mode),
          };
        }),
    [changeMode, controller.mode, controller.modes, pendingMode]
  );

  const handleItemPress = useCallback((item: BaseListItem) => {
    if (!item.onPress) return;

    return item.onPress();
  }, []);

  const sections = useMemo(
    () => [
      { data: awayListItems },
      { data: primaryListItems },
      { data: secondaryListItems },
    ],
    [awayListItems, primaryListItems, secondaryListItems]
  );

  return (
    <SectionListDefaults<BaseListItem> sections={sections}>
      {(defaults) => (
        <BottomSheetSectionList<BaseListItem>
          {...defaults}
          contentContainerStyle={undefined}
          extraData={controller.mode}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          onContentSizeChange={(_, height) => setSnapPoints([height])}
          renderItem={({ item }) => (
            <ListItem item={item} onPress={() => handleItemPress(item)} />
          )}
          renderSectionFooter={({ section }) => {
            const index = sections.findIndex((compare) => compare === section);

            const awaySection = section.data === awayListItems;
            const lastSection = index === sections.length - 1;

            if (awaySection) {
              return <Box />;
            } else if (lastSection) {
              return null;
            } else {
              return <Divider marginVertical="m" />;
            }
          }}
          ItemSeparatorComponent={null}
          ListFooterComponent={<Box marginVertical="l" />}
          ListHeaderComponent={null}
        />
      )}
    </SectionListDefaults>
  );
}

type SelectModeModalProps = {
  forwardedRef: BottomSheetModalRef;
} & WithQueryDataProps<typeof useSelectModeQuery>;

const SelectModeModal = (props: SelectModeModalProps): JSX.Element => {
  const {
    data: { controller },
    forwardedRef,
  } = props;

  if (!controller) {
    forwardedRef?.current?.dismiss();
    throw new GoBack();
  }

  const [snapPoints, setSnapPoints] = useState<Array<number | string>>([
    "100%",
  ]);

  return (
    <BottomSheetModal
      ref={forwardedRef}
      snapPoints={snapPoints}
      backdrop={true}
    >
      <SelectMode
        controller={controller}
        location={controller.location}
        setSnapPoints={setSnapPoints}
      />
    </BottomSheetModal>
  );
};

export default withQueryData(useSelectModeQuery, {
  options: { fetchPolicy: "cache-only" },
  useVariables: ({ controllerId }) =>
    useMemo(
      () => ({
        id: controllerId,
      }),
      [controllerId]
    ),
})(SelectModeModal);
