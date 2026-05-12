import { RouteProp } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Image, useWindowDimensions } from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/native-stack";

import Box from "~/components/Box";
import Loading from "~/components/Loading";
import Screen from "~/components/Screen";
import Text from "~/components/Text";

import { useGenerateAccountSharingQrCodeMutation } from "~/graph";

import i18n from "~/i18n";

import { SettingsNavigatorRouteList } from "~/navigators/SettingsNavigator";

const scope = "Screens.Authenticated.SettingsNavigator.AccountSharing";

export type AccountSharingProps = {
  navigation: NativeStackNavigationProp<
    SettingsNavigatorRouteList,
    "AccountSharing"
  >;
  route: RouteProp<SettingsNavigatorRouteList, "AccountSharing">;
};

function AccountSharing({ navigation }: AccountSharingProps): JSX.Element {
  const [dataUrl, setDataUrl] = useState<string>();
  const [ttl, setTtl] = useState<number>();
  const [generateQrCodeMutation] = useGenerateAccountSharingQrCodeMutation();
  const { width: windowWidth } = useWindowDimensions();

  const width = windowWidth / 2;

  const generateQrCode = useCallback(async () => {
    const { data } = await generateQrCodeMutation({ variables: { width } });
    switch (data?.generateAccountSharingQrCode?.__typename) {
      case "GenerateAccountSharingQrCodeSuccess":
        setDataUrl(data.generateAccountSharingQrCode.code.dataUrl);

        if (data.generateAccountSharingQrCode.code.ttl != null) {
          setTtl(data.generateAccountSharingQrCode.code.ttl);
        }
        break;
      default:
        navigation.goBack();
        break;
    }
  }, [generateQrCodeMutation, navigation, width]);

  useEffect(() => {
    if (!width) return;

    void generateQrCode();

    if (ttl) {
      const handle = setInterval(() => void generateQrCode(), ttl);
      return () => clearInterval(handle);
    }
  }, [generateQrCode, navigation, ttl, width]);

  return (
    <Screen>
      <Text variant="largeTitle" paddingBottom="m">
        {i18n.t("title", { scope })}
      </Text>
      <Text variant="body" paddingBottom="s">
        {i18n.t("subtitle", { scope })}
      </Text>
      <Text variant="body" paddingBottom="s">
        {i18n.t("description", { scope })}
      </Text>
      <Box
        alignSelf="center"
        aspectRatio={1}
        backgroundColor="qrCodeBackground"
        borderRadius={width * 0.2}
        shadowColor="text"
        shadowOpacity={0.2}
        shadowOffset={{ width: 0, height: 0 }}
        marginVertical="l"
        padding="xxl"
      >
        {dataUrl ? (
          <Image
            style={{
              width,
              height: width,
            }}
            source={{ uri: dataUrl }}
          />
        ) : (
          <Box width={width} height={width}>
            <Loading />
          </Box>
        )}
      </Box>
      {ttl != null && (
        <Text variant="body" fontStyle="italic">
          {i18n.t("expiresIn.counting", {
            scope,
            count: Math.floor(ttl / 1000 / 60),
          })}
        </Text>
      )}
    </Screen>
  );
}

export default AccountSharing;
