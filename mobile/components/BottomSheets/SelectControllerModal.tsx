import React, { useCallback, useMemo, useState } from "react";

import { BottomSheetSectionList } from "@gorhom/bottom-sheet";

import BottomSheetModal, {
  BottomSheetModalRef,
} from "~/components/BottomSheetModal";

import Box, { Row } from "~/components/Box";

import { ModeIcon } from "~/components/Icons";

import { BaseListItem, Section, SectionListDefaults } from "~/components/Lists";
import ListItem, { ListItemCheckmark } from "~/components/Lists/ListItem";
import SectionHeader from "~/components/Lists/SectionHeader";

import Text from "~/components/Text";

import { useController } from "~/contexts";

import i18n from "~/i18n";

import {
  Component_SelectControllerModal_LocationFragment as Location,
  WithQueryDataProps,
  withQueryData,
  GoBack,
  useSelectControllerQuery,
} from "~/graph";

import { toDisplay } from "~/utils/display";
import { KohortFunnelEventStep, useKohortTracking } from "~/utils/kohort";

interface SelectModeProps {
  locations: Location[];
  setSnapPoints: (snapPoints: Array<number | string>) => void;
}

const scope = "Components.SelectControllerModal";

function SelectMode({
  locations,
  setSnapPoints,
}: SelectModeProps): JSX.Element {
  const { controllerId, selectController } = useController();
  const { trackFeatureUse, trackFunnel } = useKohortTracking();

  const sections = useMemo(
    () =>
      locations.map<Section>((location) => ({
        title: location.name,
        helperText:
          location.connectionStatus === "ONLINE"
            ? undefined
            : i18n.t("thermostatOffline", { scope }),
        helperTextVariant: "offlineHelperLabel",
        data: location.controllers.map<BaseListItem>((controller) => ({
          id: controller.id,
          title: controller.name,
          displayChevronIOS: false,
          onPress: () => {
            trackFeatureUse("Change Controller");
            trackFunnel({ step: KohortFunnelEventStep.Action });
            void selectController({
              controllerId: controller.id,
              locationId: location.id,
            });
          },
          leftElement: (
            <ListItemCheckmark checked={controllerId === controller.id} />
          ),
          rightElement: (
            <Row>
              <Text variant="listLabel" marginHorizontal="xs">
                {toDisplay(
                  location.temperatureUnit,
                  controller.temperatureAmbient
                )}
              </Text>
              <ModeIcon mode={controller.mode.effectiveMode} size={20} />
            </Row>
          ),
        })),
      })),
    [controllerId, locations, selectController, trackFeatureUse, trackFunnel]
  );

  const handleItemPress = useCallback((item: BaseListItem) => {
    if (!item.onPress) return;

    return item.onPress();
  }, []);

  return (
    <SectionListDefaults<BaseListItem> sections={sections}>
      {(defaults) => (
        <BottomSheetSectionList<BaseListItem>
          {...defaults}
          contentContainerStyle={undefined}
          extraData={controllerId}
          onContentSizeChange={(_, height) => setSnapPoints([height])}
          renderItem={({ item }) => (
            <ListItem item={item} onPress={() => handleItemPress(item)} />
          )}
          renderSectionHeader={({ section }) => {
            // The types on the BottomSheetSectionList don't allow us
            // to specify a SectionT generic so we unfortunately have
            // to cast here
            const sectionCC = section as Section;
            return (
              <SectionHeader
                title={sectionCC.title}
                helperText={sectionCC.helperText}
                helperTextVariant={sectionCC.helperTextVariant}
              />
            );
          }}
          renderSectionFooter={() => <Box marginVertical="s" />}
          ItemSeparatorComponent={null}
          ListFooterComponent={<Box marginVertical="l" />}
        />
      )}
    </SectionListDefaults>
  );
}

type SelectControllerModalProps = {
  forwardedRef: BottomSheetModalRef;
} & WithQueryDataProps<typeof useSelectControllerQuery>;

const SelectControllerModal = (
  props: SelectControllerModalProps
): JSX.Element => {
  const {
    data: { locations },
    forwardedRef,
  } = props;

  if (!locations) {
    forwardedRef?.current?.dismiss();
    throw new GoBack();
  }

  const [snapPoints, setSnapPoints] = useState<Array<number | string>>([
    "100%",
  ]);

  return (
    <BottomSheetModal
      ref={forwardedRef}
      index={0}
      snapPoints={snapPoints}
      backdrop={true}
    >
      <SelectMode locations={locations} setSnapPoints={setSnapPoints} />
    </BottomSheetModal>
  );
};

export default withQueryData(useSelectControllerQuery, {
  options: { fetchPolicy: "cache-only" },
})(SelectControllerModal);
