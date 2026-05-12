import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useMemo } from "react";
import { NativeStackNavigationProp } from "react-native-screens/native-stack";

import { withBackground } from "~/components/Background";
import { BaseListItem } from "~/components/Lists";
import FlatList, { ListData } from "~/components/Lists/FlatList";
import { useFeatureFlags } from "~/contexts";

import {
  WithQueryDataProps,
  GoBack,
  useNamesQuery,
  withQueryData,
} from "~/graph";

import i18n from "~/i18n";

import { SettingsNavigatorRouteList } from "~/navigators/SettingsNavigator";
import { SettingsNames, SettingsParams } from "~/navigators/types";

const scope = "Screens.Authenticated.SettingsNavigator.Names";

export type NamesProps = {
  navigation: NativeStackNavigationProp<SettingsNavigatorRouteList, "Names">;
  route: RouteProp<SettingsNavigatorRouteList, "Names">;
} & WithQueryDataProps<typeof useNamesQuery>;

function Names({ data: { location }, navigation }: NamesProps): JSX.Element {
  const { handleEnabledVariant, isVariantEnabled } = useFeatureFlags();

  const renameController = isVariantEnabled("rename", ["CONTROLLER"]);
  const renameLocation = isVariantEnabled("rename", ["LOCATION"]);

  if (!location || !(renameController || renameLocation)) throw new GoBack();

  const controller =
    location.controllers.length === 1 ? location.controllers[0] : null;

  const locationItem = useMemo(
    () =>
      handleEnabledVariant(
        "rename",
        ["LOCATION"],
        (): BaseListItem => ({
          title: i18n.t("location", { scope }),
          subtitle: location.name,
          displayChevronIOS: true,
          navigate: {
            name: "RenameLocation",
            params: {
              locationId: location.id,
            },
          },
        })
      ),
    [handleEnabledVariant, location.id, location.name]
  );

  const controllerItem = useMemo(
    () =>
      handleEnabledVariant(
        "rename",
        ["CONTROLLER"],
        (): BaseListItem =>
          controller?.id
            ? {
                title: i18n.t("room", { scope }),
                subtitle: controller?.name,
                displayChevronIOS: true,
                navigate: {
                  name: "RenameRoom",
                  params: {
                    controllerId: controller?.id,
                  },
                },
              }
            : {
                title: i18n.t("rooms", { scope }),
                displayChevronIOS: true,
                navigate: {
                  name: "RoomNames",
                  params: {
                    locationId: location.id,
                  },
                },
              }
      ),
    [controller?.id, controller?.name, handleEnabledVariant, location.id]
  );

  const DATA = useMemo<ListData>(
    () => [
      ...(locationItem ? [locationItem] : []),
      ...(controllerItem ? [controllerItem] : []),
    ],
    [controllerItem, locationItem]
  );

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
      const route = useRoute<NamesProps["route"]>();
      return useMemo(() => ({ locationId: route.params.locationId }), [
        route.params.locationId,
      ]);
    },
  })(Names)
);
