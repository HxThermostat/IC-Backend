import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";

import { withBackground } from "~/components/Background";
import { SectionList, Sections } from "~/components/Lists";
import { ListItemCheckmark } from "~/components/Lists/ListItem";
import { useFeatureFlags } from "~/contexts";
import { useSaveButton } from "~/hooks";

import {
  ChangeDefaultHoldLengthInput,
  GoBack,
  HoldLength,
  WithQueryDataProps,
  useChangeLocationHoldLengthMutation,
  useSettingsHoldLengthLocationQuery,
  withQueryData,
} from "~/graph";

import i18n from "~/i18n";

import { SettingsNavigatorRouteList } from "~/navigators/SettingsNavigator";

const scope = "Screens.Authenticated.SettingsNavigator.HoldLength";

export type HoldLengthProps = {
  route: RouteProp<SettingsNavigatorRouteList, "HoldLength">;
} & WithQueryDataProps<typeof useSettingsHoldLengthLocationQuery>;

const toTitle = (holdLength: HoldLength): string =>
  holdLength.__typename === "HoldLengthHours"
    ? i18n.t(`${holdLength.__typename}.counting`, {
        scope,
        count: holdLength.hours,
      })
    : i18n.t(String(holdLength.__typename), { scope });

const holdLengthEqual = (a: HoldLength, b: HoldLength): boolean => {
  switch (a.__typename) {
    case "HoldLengthHours":
      return a.hours === (b.__typename === "HoldLengthHours" ? b.hours : null);
    default:
      return a.__typename === b.__typename;
  }
};

function HoldLengthScreen({
  data: { location },
}: HoldLengthProps): JSX.Element {
  if (!location) throw new GoBack();

  const {
    isFeatureEnabled,
    isVariantEnabled,
    handleEnabledFeature,
  } = useFeatureFlags();
  if (
    !location.defaultHoldLength ||
    !isFeatureEnabled("changeDefaultHoldLengthLocation")
  )
    throw new GoBack();

  const [selected, setSelected] = useState<HoldLength>(
    location.defaultHoldLength
  );

  const general = useMemo<HoldLength[]>(
    () =>
      [
        isVariantEnabled("changeDefaultHoldLengthLocation", ["INDEFINITE"])
          ? {
              __typename: "HoldLengthIndefinite" as const,
              _: null,
            }
          : null,
        isVariantEnabled("changeDefaultHoldLengthLocation", ["NEXT_EVENT"])
          ? {
              __typename: "HoldLengthNextEvent" as const,
              _: null,
            }
          : null,
      ].filter(isNotNull),
    [isVariantEnabled]
  );

  const holdLengthHours = useCallback((hours: number): HoldLength[] => {
    return Array(hours)
      .fill(0)
      .map((_, index) => ({
        __typename: "HoldLengthHours" as const,
        hours: index + 1,
      }));
  }, []);

  const sections = useMemo<Sections>(() => {
    const holdLengthHourOptions = handleEnabledFeature(
      "changeDefaultHoldLengthLocation",
      (variants) => {
        const potentialHours = variants.map((variant) => {
          const match = /^HOURS_([0-9]+)$/.exec(variant);
          return match ? parseInt(match[1]) : 0;
        });

        const hours = Math.max(...potentialHours);

        return hours ? holdLengthHours(hours) : null;
      }
    );

    return [
      {
        data: general.map((holdLength) => ({
          title: toTitle(holdLength),
          leftElement: (
            <ListItemCheckmark
              checked={holdLengthEqual(selected, holdLength)}
            />
          ),
          onPress: () => setSelected(holdLength),
        })),
      },
      holdLengthHourOptions
        ? {
            title: "Hours",
            data: holdLengthHourOptions.map((holdLength) => ({
              title: toTitle(holdLength),
              leftElement: (
                <ListItemCheckmark
                  checked={holdLengthEqual(selected, holdLength)}
                />
              ),
              onPress: () => setSelected(holdLength),
            })),
          }
        : null,
    ].filter(isNotNull);
  }, [general, holdLengthHours, handleEnabledFeature, selected]);

  const [changeHoldLength] = useChangeLocationHoldLengthMutation();

  const handleSave = useCallback(async () => {
    const input: ChangeDefaultHoldLengthInput = {
      id: location.id,
      indefinite: null,
      nextEvent: null,
      hours: null,
      date: null,
    };

    const sentinal = { _: null };

    switch (selected.__typename) {
      case "HoldLengthIndefinite":
        input.indefinite = sentinal;
        break;
      case "HoldLengthNextEvent":
        input.nextEvent = sentinal;
        break;
      case "HoldLengthHours":
        input.hours = {
          hours: selected.hours,
        };
        break;
      default:
        return;
    }
    await changeHoldLength({ variables: { input } });
  }, [changeHoldLength, location.id, selected]);

  const { didChange } = useSaveButton({ handleSave });

  return (
    <SectionList
      handleItemPress={(item) => {
        if (item.onPress) {
          item.onPress();
          didChange();
        }
      }}
      sections={sections}
    />
  );
}

export default withBackground(
  withQueryData(useSettingsHoldLengthLocationQuery, {
    useVariables: () => {
      const route = useRoute<HoldLengthProps["route"]>();
      return useMemo(() => ({ locationId: route.params.locationId }), [
        route.params.locationId,
      ]);
    },
  })(HoldLengthScreen)
);
