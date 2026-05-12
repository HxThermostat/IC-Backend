import React, { useMemo } from "react";

import { NativeStackNavigationProp } from "react-native-screens/native-stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SettingsNavigatorRouteList } from "~/navigators/SettingsNavigator";

import {
  useNamesQuery,
  withQueryData,
  WithQueryDataProps,
  GoBack,
} from "~/graph";

import { withBackground } from "~/components/Background";
import { BaseListItem } from "~/components/Lists";
import FlatList, { ListData } from "~/components/Lists/FlatList";

import { SettingsNames, SettingsParams } from "~/navigators/types";

export type RoomNamesProps = {
  navigation: NativeStackNavigationProp<SettingsNavigatorRouteList, "Names">;
  route: RouteProp<SettingsNavigatorRouteList, "Names">;
} & WithQueryDataProps<typeof useNamesQuery>;

function RoomNames({
  data: { location },
  navigation,
}: RoomNamesProps): JSX.Element {
  if (!location) throw new GoBack();
  const { controllers } = location;

  const DATA: ListData = controllers.map((controller) => ({
    title: controller.name,
    displayChevronIOS: true,
    navigate: {
      name: "RenameRoom",
      params: { controllerId: controller.id },
    },
  }));

  function handleItemPress(item: BaseListItem): void {
    if (item.navigate) {
      navigation.navigate(
        item.navigate.name as SettingsNames,
        item.navigate.params as SettingsParams
      );
    }
  }

  return (
    <FlatList
      alwaysBounceVertical={false}
      handleItemPress={handleItemPress}
      data={DATA}
    />
  );
}

export default withBackground(
  withQueryData(useNamesQuery, {
    useVariables: () => {
      const route = useRoute<RoomNamesProps["route"]>();
      return useMemo(() => ({ locationId: route.params.locationId }), [
        route.params.locationId,
      ]);
    },
  })(RoomNames)
);
