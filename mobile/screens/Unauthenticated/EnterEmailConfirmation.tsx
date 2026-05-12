import React, { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";

import Clipboard from "@react-native-clipboard/clipboard";

import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/native-stack";

import Box from "~/components/Box";
import Onboarding from "~/components/Onboarding";
import TextInput from "~/components/Inputs/TextInput";
import Text from "~/components/Text";
import { Link } from "~/components/Touchables";

import { useAppState, useAuth } from "~/contexts";

import { useSendTokenMutation, useSignInMutation } from "~/graph";

import { useHeaderButton, useLazyEffect } from "~/hooks";

import i18n from "~/i18n";

import { UnauthenticatedNavigatorRouteList } from "~/navigators/UnauthenticatedNavigator";

import { attemptToOpenEmail, clearLink } from "~/utils/linking";

import { isValidToken, TOKEN_LENGTH } from "./helpers";
import {
  KohortFunnel,
  KohortFunnelEventStep,
  useKohortTracking,
} from "~/utils/kohort";

const scope = "Screens.Unauthenticated.EnterEmailConfirmation";

type EnterEmailConfirmationScreenNavigationProp = NativeStackNavigationProp<
  UnauthenticatedNavigatorRouteList,
  "EnterEmailConfirmation"
>;

export type EnterEmailConfirmationProps = {
  navigation: EnterEmailConfirmationScreenNavigationProp;
  route: RouteProp<UnauthenticatedNavigatorRouteList, "EnterEmailConfirmation">;
};

export default function EnterEmailConfirmation(
  props: EnterEmailConfirmationProps
): JSX.Element {
  // email should always be present
  // a deep link may also contain the email token from which we could submit immediately
  const { email, emailToken } = props.route.params;
  const { navigation } = props;

  const [token, setToken] = useState<string>();
  const [invalidToken, setInvalidToken] = useState<string>();
  const { trackFunnel } = useKohortTracking();

  const appState = useAppState();

  const tryToFillInputWithCopiedCode = useCallback(async () => {
    if (await Clipboard.hasString()) {
      const content = await Clipboard.getString();
      const pasted = content?.trim() ?? "";

      if (isValidToken(pasted)) {
        setToken(pasted);
      }
    }
  }, []);

  useLazyEffect(() => {
    if (appState === "active") {
      void tryToFillInputWithCopiedCode();
    }
  }, [appState, tryToFillInputWithCopiedCode]);

  useEffect(() => {
    setToken(emailToken);
  }, [emailToken]);

  const { signIn: setAuthToken } = useAuth();

  const [sendTokenMutation] = useSendTokenMutation({
    variables: { input: { email } },
  });

  const [signInMutation, { loading }] = useSignInMutation({
    variables: {
      input: {
        email,
        token: emailToken ? emailToken : token ?? "",
      },
    },
    onCompleted: ({ signIn }) => {
      switch (signIn.__typename) {
        case "SignInSuccess": {
          trackFunnel({
            funnel: KohortFunnel.Adoption,
            step: KohortFunnelEventStep.SignIn,
          });
          trackFunnel({
            funnel: KohortFunnel.SignIn,
            step: KohortFunnelEventStep.SignInSuccess,
          });
          void setAuthToken({
            ...signIn,
            expiresAt: new Date(Date.now() + signIn.ttl * 1000),
          });
          clearLink();
          break;
        }
        default: {
          if (emailToken) {
            Alert.alert(
              i18n.t("alertDeeplink.title", { scope }),
              i18n.t("alertDeeplink.message", { scope, email }),
              [
                {
                  text: i18n.t("alertDeeplink.defaultButton", { scope }),
                  style: "default",
                  onPress: () => sendTokenMutation(),
                },
              ]
            );
          } else {
            Alert.alert(
              i18n.t("alertManual.title", { scope }),
              i18n.t("alertManual.message", { scope, email }),
              [
                {
                  text: i18n.t("alertManual.defaultButton", { scope }),
                  style: "default",
                },
                {
                  text: i18n.t("alertManual.cancelButton", { scope }),
                  style: "cancel",
                  onPress: () => sendTokenMutation(),
                },
              ]
            );
          }
          navigation.setParams({ emailToken: undefined });
          setInvalidToken(emailToken ? emailToken : token ?? "");
          break;
        }
      }
    },
  });

  useEffect(() => {
    // if we have the email token from a deep link submit
    if (emailToken) {
      void signInMutation();
    }
  }, [signInMutation, emailToken]);

  const handleSubmitToken = useCallback(() => {
    if (loading || !token) {
      return;
    }
    void signInMutation();
  }, [signInMutation, loading, token]);

  useHeaderButton({
    onPress: handleSubmitToken,
    loading,
    placement: "headerRight",
    disabled: !token || token.length < TOKEN_LENGTH || token === invalidToken,
    text: i18n.t("headerRightText", { scope }),
  });

  const showEmailNotRecievedAlert = useCallback(() => {
    Alert.alert(
      i18n.t("alertEmailNotReceived.title", { scope }),
      i18n.t("alertEmailNotReceived.message", { scope }),
      [
        {
          text: i18n.t("alertEmailNotReceived.defaultButton", { scope }),
          style: "default",
          onPress: () => sendTokenMutation(),
        },
        {
          text: i18n.t("alertEmailNotReceived.cancelButton", { scope }),
          style: "cancel",
        },
      ]
    );
  }, [sendTokenMutation]);

  return (
    <Onboarding
      Content={
        <>
          <Text textAlign="center">
            {i18n.t("instructions", { scope })}
            {"\n"}
            <Text variant="bodyStrong">{email}</Text>
          </Text>
        </>
      }
      Footer={
        <Box flexGrow={1}>
          <Text variant="onboardingHelper" marginBottom="s">
            {i18n.t("fallbackInstructions", { scope })}
          </Text>
          <TextInput
            value={token}
            onChangeText={setToken}
            placeholder={i18n.t("placeholder", { scope })}
            returnKeyType="done"
            autoCapitalize="none"
            spellCheck={false}
            onSubmitEditing={handleSubmitToken}
          />
          <Link
            touchableProps={{ marginTop: "m" }}
            variant="onboardingHelper"
            textAlign="center"
            text={i18n.t("emailNotReceived", { scope })}
            onPress={showEmailNotRecievedAlert}
          />
        </Box>
      }
      title={i18n.t("title", { scope })}
      button={{
        loading,
        onPress: attemptToOpenEmail,
        text: i18n.t("button", { scope }),
      }}
    />
  );
}
