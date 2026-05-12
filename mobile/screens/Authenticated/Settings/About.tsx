import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { Alert } from "react-native";
import { openComposer } from "react-native-email-link";

import { withBackground } from "~/components/Background";
import {
  BaseListItem,
  ListData,
  Section,
  SectionList,
} from "~/components/Lists";

import i18n from "~/i18n";

import { nativeVersion } from "~/utils/version";

import { URI_SCHEME } from "~/config/constants";

const scope = "Screens.Authenticated.SettingsNavigator.About";

function About(): JSX.Element {
  const navigation = useNavigation();

  const [showDebugMenu, setShowDebugMenu] = useState(false);

  function handleItemPress(item: BaseListItem): void {
    if (item.navigate) {
      navigation.navigate(item.navigate.name, item.navigate.params);
    }
    if (item.onPress) {
      item.onPress();
    }
  }

  function handleItemLongPress(item: BaseListItem): void {
    if (item.onLongPress) {
      item.onLongPress();
    }
  }

  const debugMenuItem = useMemo<ListData>(
    () =>
      showDebugMenu
        ? [
            {
              title: i18n.t("debugMenu", { scope }),
              displayChevronIOS: true,
              navigate: {
                name: "DebugMenuHome",
              },
            },
          ]
        : [],
    [showDebugMenu]
  );

  const sections = useMemo<Section[]>(
    () => [
      {
        data: [
          {
            title: i18n.t("version", { scope }),
            subtitle: nativeVersion,
            onLongPress: () => setShowDebugMenu(true),
            delayLongPress: 20000,
          },

          ...debugMenuItem,
        ],
      },
      {
        data: [
          {
            title: i18n.t("submitFeedback", { scope }),
            onPress: () => {
              Alert.alert(
                i18n.t("submitFeedbackAlert.title", { scope }),
                i18n.t("submitFeedbackAlert.message", {
                  scope,
                }),
                [
                  {
                    text: i18n.t("submitFeedbackAlert.cancelButton", { scope }),
                    style: "cancel",
                  },
                  {
                    text: i18n.t("submitFeedbackAlert.defaultButton", {
                      scope,
                    }),
                    style: "default",
                    onPress: () => {
                      void openComposer({
                        to: `feedback+${URI_SCHEME}@appexperience.dev`,
                        subject: i18n.t("submitFeedbackEmail.subject", {
                          scope,
                        }),
                        body: i18n.t("submitFeedbackEmail.body", {
                          scope,
                        }),
                      });
                    },
                  },
                ]
              );
            },
          },
        ],
      },
    ],
    [debugMenuItem]
  );

  return (
    <SectionList
      alwaysBounceVertical={false}
      sections={sections}
      handleItemPress={handleItemPress}
      handleItemLongPress={handleItemLongPress}
    />
  );
}

export default withBackground(About);
