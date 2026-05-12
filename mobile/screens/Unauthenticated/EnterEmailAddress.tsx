import React, { useCallback, useState } from "react";
import { Platform } from "react-native";

import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/native-stack";

import TextInput from "~/components/Inputs/TextInput";
import { EmailIcon } from "~/components/Icons";
import Onboarding from "~/components/Onboarding";

import { useSendTokenMutation } from "~/graph";

import i18n from "~/i18n";

import { UnauthenticatedNavigatorRouteList } from "~/navigators/UnauthenticatedNavigator";

import { isValidEmail } from "~/utils/display";
import {
  KohortFunnel,
  KohortFunnelEventStep,
  useKohortTracking,
} from "~/utils/kohort";

const scope = "Screens.Unauthenticated.EnterEmailAddress";

type EnterEmailAddressScreenNavigationProp = NativeStackNavigationProp<
  UnauthenticatedNavigatorRouteList,
  "EnterEmailAddress"
>;

type EnterEmailAddressScreenProps = {
  navigation: EnterEmailAddressScreenNavigationProp;
  router: RouteProp<UnauthenticatedNavigatorRouteList, "EnterEmailAddress">;
};

export default function EnterEmailAddress(
  props: EnterEmailAddressScreenProps
): JSX.Element {
  const [email, setEmail] = useState("");
  const { trackFunnel } = useKohortTracking();

  const [sendTokenMutation, { loading }] = useSendTokenMutation({
    variables: { input: { email } },
    onCompleted: ({ sendToken }) => {
      switch (sendToken.__typename) {
        case "SendTokenSuccess":
          props.navigation.navigate("EnterEmailConfirmation", { email });
          break;
        case "EmailInvalid":
          props.navigation.navigate("EnterNewSignUpInfo", { email });
          break;
        default:
      }
    },
  });

  const handleEmailSubmit = useCallback(() => {
    if (!isValidEmail(email)) {
      return;
    }
    trackFunnel({
      funnel: KohortFunnel.SignIn,
      step: KohortFunnelEventStep.SignInStart,
    });
    void sendTokenMutation();
  }, [email, sendTokenMutation, trackFunnel]);

  return (
    <Onboarding
      Icon={<EmailIcon alignSelf="center" marginBottom="m" />}
      Content={
        <TextInput
          onChangeText={(v) => setEmail(v.trim())}
          value={email}
          label={
            Platform.OS === "android" ? i18n.t("label", { scope }) : undefined
          }
          placeholder={
            Platform.OS === "ios" ? i18n.t("placeholder", { scope }) : undefined
          }
          autoCorrect={false}
          keyboardType={"email-address"}
          autoCompleteType={"email"}
          textContentType={"emailAddress"}
          autoCapitalize={"none"}
          returnKeyType="done"
          onSubmitEditing={handleEmailSubmit}
        />
      }
      title={i18n.t("title", { scope })}
      button={{ loading, onPress: handleEmailSubmit }}
      caption={i18n.t("caption", { scope })}
    />
  );
}
