import React, { useState } from "react";
import { Alert } from "react-native";

import { NavigationProp, useNavigation } from "@react-navigation/native";

import { TextInput } from "~/components/Inputs";
import Onboarding from "~/components/Onboarding";
import Text from "~/components/Text";

import { useConnectAylaDisplayMutation } from "~/graph";

import i18n from "~/i18n";

import { ConnectNavigatorRouteList } from "~/navigators/ConnectNavigator";

import { logNotSupported } from "~/utils/sentry";
import { useHeaderButton } from "~/hooks";
import Box from "~/components/Box";
import {
  KohortFunnel,
  KohortFunnelEventStep,
  useKohortTracking,
} from "~/utils/kohort";

const scope = "Screens.Connect.AylaDisplay.Token";

export default function Token(): JSX.Element {
  const navigation = useNavigation<NavigationProp<ConnectNavigatorRouteList>>();
  const { trackFunnel } = useKohortTracking();

  const [token, setToken] = useState<string>("");

  const [onPress, { loading }] = useConnectAylaDisplayMutation({
    variables: { token },
    onCompleted({ connectAylaDisplay }) {
      switch (connectAylaDisplay.__typename) {
        case "ConnectAylaDisplaySuccess":
          trackFunnel({
            funnel: KohortFunnel.Adoption,
            step: KohortFunnelEventStep.Connection,
          });
          trackFunnel({
            funnel: KohortFunnel.Connection,
            step: KohortFunnelEventStep.ConnectionSuccess,
          });

          navigation.navigate("Success", {
            locationId: connectAylaDisplay.location.id,
          });
          break;
        case "TokenInvalid":
          Alert.alert(
            i18n.t("TokenInvalid.title", { scope }),
            i18n.t("TokenInvalid.message", { scope })
          );
          break;
        case "DeviceStateInvalid":
          Alert.alert(
            i18n.t("DeviceStateInvalid.title", { scope }),
            i18n.t("DeviceStateInvalid.message", { scope })
          );
          break;
        default:
          logNotSupported({ connectAylaDisplay });
          break;
      }
    },
    onError() {
      Alert.alert(
        i18n.t("RequestFailed.title", { scope }),
        i18n.t("RequestFailed.message", { scope }),
        [{ text: i18n.t("RequestFailed.defaultButton", { scope }) }]
      );
    },
  });

  const disabled = token.length < 6;

  useHeaderButton({
    loading,
    disabled,
    onPress,
    placement: "headerRight",
    text: i18n.t("Common.continue"),
  });

  return (
    <Onboarding
      Content={
        <>
          <Text textAlign="center" marginBottom="l">
            {i18n.t("body", { scope })}
          </Text>
          <Box>
            <TextInput
              onChangeText={setToken}
              placeholder={i18n.t("placeholder", { scope })}
              clearButtonMode="always"
              returnKeyType="default"
            />
          </Box>
        </>
      }
      button={{
        disabled,
        loading,
        onPress,
      }}
      title={i18n.t("title", { scope })}
      progress={{ dots: 4, activeIndex: 2 }}
    />
  );
}
