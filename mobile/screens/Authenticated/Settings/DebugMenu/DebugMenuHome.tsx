import React, { useMemo } from "react";

import { useNavigation } from "@react-navigation/native";

import { withBackground } from "~/components/Background";
import FlatList, { ListData } from "~/components/Lists/FlatList";
import { BaseListItem } from "~/components/Lists";

import i18n from "~/i18n";

const scope = "Screens.Authenticated.SettingsNavigator.DebugMenuHome";

function DebugMenuHome(): JSX.Element {
  const navigation = useNavigation();

  function handleItemPress(item: BaseListItem): void {
    if (item.navigate) {
      navigation.navigate(item.navigate.name, item.navigate.params);
    }
    if (item.onPress) {
      item.onPress();
    }
  }

  const items: ListData = useMemo<ListData>(
    () => [
      {
        title: i18n.t("graphUrl", { scope }),
        displayChevronIOS: true,
        navigate: {
          name: "ChangeGraphUrl",
        },
      },
      {
        title: i18n.t("debugUser", { scope }),
        displayChevronIOS: true,
        navigate: {
          name: "DebugUser",
        },
      },
    ],
    []
  );

  return (
    <FlatList
      alwaysBounceVertical={false}
      data={items}
      handleItemPress={handleItemPress}
    />
  );
}

export default withBackground(DebugMenuHome);
