import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo } from "react";

import { withBackground } from "~/components/Background";
import { BaseListItem, Section, SectionList } from "~/components/Lists";
import { useBackButton, useIsTabNavigator } from "~/hooks";

import { WithQueryDataProps, useSettingsQuery, withQueryData } from "~/graph";

import i18n from "~/i18n";

import { openReviewInStore } from "~/utils/rating";

import { useLocationItem } from "./Settings/Location";

const scope = "Screens.Authenticated.SettingsNavigator.Settings";

export type SettingsProps = WithQueryDataProps<typeof useSettingsQuery>;

const SettingsDoneButton = (): JSX.Element => {
  useBackButton({ platform: "ios", text: i18n.t("Common.done") });
  return <></>;
};
function Settings({ data }: SettingsProps): JSX.Element {
  const navigation = useNavigation();

  const usesTabNavigator = useIsTabNavigator();

  const { locations, manufacturer, me } = data;

  const generalSection = useMemo<Section>(() => {
    const section: Section = {
      title: i18n.t("sections.general.title", { scope }),
      data: [],
    };

    section.data.push({
      title: i18n.t("sections.general.about", { scope }),
      displayChevronIOS: true,
      navigate: { name: "About" },
    });

    if (manufacturer.support) {
      section.data.push({
        title: i18n.t("sections.general.support", { scope }),
        displayChevronIOS: true,
        navigate: { name: "Support" },
      });
    }

    section.data.push({
      title: i18n.t("sections.general.rate", { scope }),
      displayChevronIOS: false,
      onPress: openReviewInStore,
      actsAsButton: true,
    });

    return section;
  }, [manufacturer.support]);

  const accountSection = useMemo<Section>(() => {
    return {
      title: i18n.t("sections.account.title", { scope }),
      data: [
        {
          title: i18n.t("sections.account.manageAccount", { scope }),
          subtitle: me?.email,
          displayChevronIOS: true,
          navigate: {
            name: "ManageAccount",
          },
        },
        {
          title: i18n.t("sections.account.addThermostat", { scope }),
          navigate: {
            name: "Connect",
          },
          actsAsButton: true,
        },
      ],
    };
  }, [me?.email]);

  const locationItem = useLocationItem(locations[0]);

  const locationSection = useMemo<Section>(() => {
    return locations.length === 1
      ? {
          title: locations[0].name,
          data: locationItem,
        }
      : {
          title: i18n.t("sections.locations.title", { scope }),
          data: locations.map((location) => ({
            title: location.name,
            displayChevronIOS: true,
            displayBadge: !!location.faultActive,
            navigate: {
              name: "Location",
              params: { locationId: location.id },
            },
          })),
        };
  }, [locationItem, locations]);

  const sections = useMemo(() => {
    return [generalSection, accountSection, locationSection];
  }, [accountSection, generalSection, locationSection]);

  const handleItemPress = useCallback(
    (item: BaseListItem): void => {
      if (item.navigate) {
        navigation.navigate(item.navigate.name, item.navigate.params);
      }
      if (item.onPress) {
        item.onPress();
      }
    },
    [navigation]
  );

  return (
    <>
      {usesTabNavigator ? null : <SettingsDoneButton />}
      <SectionList handleItemPress={handleItemPress} sections={sections} />
    </>
  );
}

export default withBackground(withQueryData(useSettingsQuery)(Settings));
