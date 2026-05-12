import React, { useEffect, useMemo, useState } from "react";

import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/native-stack";

import { SettingsNavigatorRouteList } from "~/navigators/SettingsNavigator";
import { SettingsNames, SettingsParams } from "~/navigators/types";

import {
  GoBack,
  useRefreshTokenMutation,
  useSettingsDebugMenuDebugUserQuery,
  withQueryData,
  WithQueryDataProps,
} from "~/graph";

import { withBackground } from "~/components/Background";
import FlatList, { ListData } from "~/components/Lists/FlatList";
import { BaseListItem } from "~/components/Lists";

import { getToken, setToken, Token } from "~/utils/auth";
import { DateFormatter } from "~/utils/display";

import i18n from "~/i18n";

const scope = "Screens.Authenticated.SettingsNavigator.DebugUser";

export type DebugUserProps = {
  navigation: NativeStackNavigationProp<
    SettingsNavigatorRouteList,
    "DebugUser"
  >;
  route: RouteProp<SettingsNavigatorRouteList, "DebugUser">;
} & WithQueryDataProps<typeof useSettingsDebugMenuDebugUserQuery>;

const formatDate = DateFormatter("YYYY-MM-DD h:mm A");

const DebugUser = ({
  navigation,
  data: { me },
}: DebugUserProps): JSX.Element => {
  if (!me) throw new GoBack();

  const [currentToken, setCurrentToken] = useState<Token | null>(null);

  const [refreshToken] = useRefreshTokenMutation({
    onCompleted: async ({ refreshToken }) => {
      if (refreshToken.__typename === "RefreshTokenSuccess") {
        const newToken = {
          accessToken: refreshToken.accessToken,
          refreshToken: refreshToken.refreshToken,
          expiresAt: new Date(Date.now() + refreshToken.ttl * 1000),
        };
        await setToken(newToken);
        const savedToken = await getToken();
        setCurrentToken(savedToken);
      }
    },
  });

  useEffect(() => {
    void (async () => {
      const savedToken = await getToken();
      setCurrentToken(savedToken);
    })();
  }, []);

  function handleItemPress(item: BaseListItem): void {
    if (item.navigate) {
      navigation.navigate(
        item.navigate.name as SettingsNames,
        item.navigate.params as SettingsParams
      );
    }
    if (item.onPress) {
      item.onPress();
    }
  }

  const tokenMenuItems = useMemo<ListData>(
    () =>
      currentToken
        ? [
            {
              title: i18n.t("accessToken", { scope }),
              displayChevronIOS: true,
              navigate: {
                name: "DebugKeyValue",
                params: {
                  key: i18n.t("accessToken", { scope }),
                  value: currentToken.accessToken,
                },
              },
            },
            {
              title: i18n.t("refreshToken", { scope }),
              displayChevronIOS: true,
              navigate: {
                name: "DebugKeyValue",
                params: {
                  key: i18n.t("refreshToken", { scope }),
                  value: currentToken.refreshToken,
                },
              },
            },
            {
              title: i18n.t("expiresAt", { scope }),
              subtitle: formatDate(currentToken.expiresAt),
            },
            {
              title: i18n.t("triggerRefresh", { scope }),
              onPress: () =>
                refreshToken({
                  variables: {
                    input: {
                      token: currentToken.refreshToken,
                    },
                  },
                }),
              actsAsButton: true,
            },
          ]
        : [],
    [currentToken, refreshToken]
  );

  const items: ListData = useMemo<ListData>(
    () => [
      {
        title: i18n.t("id", { scope }),
        subtitle: me.id,
      },
      ...tokenMenuItems,
    ],
    [tokenMenuItems, me.id]
  );

  return (
    <FlatList
      alwaysBounceVertical={false}
      data={items}
      handleItemPress={handleItemPress}
    />
  );
};

export default withBackground(
  withQueryData(useSettingsDebugMenuDebugUserQuery, {
    options: { fetchPolicy: "cache-and-network" },
  })(DebugUser)
);
