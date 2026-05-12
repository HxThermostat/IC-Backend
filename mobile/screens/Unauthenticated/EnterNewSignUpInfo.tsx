import { RouteProp } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";

import { NativeStackNavigationProp } from "react-native-screens/native-stack";

import Box from "~/components/Box";
import { TextInputWithLabel, RNTextInput } from "~/components/Inputs";
import Onboarding from "~/components/Onboarding";
import Text from "~/components/Text";

import { useSignUpMutation } from "~/graph";

import i18n from "~/i18n";

import { UnauthenticatedNavigatorRouteList } from "~/navigators/UnauthenticatedNavigator";

const scope = "Screens.Unauthenticated.EnterNewSignUpInfo";

type EnterNewSignUpInfoNavigationProp = NativeStackNavigationProp<
  UnauthenticatedNavigatorRouteList,
  "EnterNewSignUpInfo"
>;

type EnterNewSignUpInfoProps = {
  navigation: EnterNewSignUpInfoNavigationProp;
  route: RouteProp<UnauthenticatedNavigatorRouteList, "EnterNewSignUpInfo">;
};

export default function EnterNewSignUpInfo(
  props: EnterNewSignUpInfoProps
): JSX.Element {
  const { email } = props.route.params;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const lastNameInputRef = useRef<RNTextInput>(null);

  const [signUpMutation, { loading }] = useSignUpMutation({
    variables: {
      input: { email, firstName, lastName },
    },
    onCompleted: ({ signUp }) => {
      switch (signUp.__typename) {
        case "SignUpSuccess": {
          props.navigation.replace("EnterEmailConfirmation", { email });
          break;
        }
        case "EmailInvalid":
        case "EmailTaken":
        default:
          props.navigation.goBack();
          break;
      }
    },
  });

  function submissionIsValid(): boolean {
    return Boolean(firstName && lastName);
  }

  const handleInfoSubmit = useCallback(
    () => firstName && lastName && signUpMutation(),
    [signUpMutation, firstName, lastName]
  );

  const disabled = !submissionIsValid() || loading;

  return (
    <Onboarding
      Content={
        <>
          <Text textAlign="center">
            {i18n.t("createAccountFor", { scope })}
          </Text>
          <Text paddingBottom="xl" textAlign="center" variant="bodyStrong">
            {email}
          </Text>
          <TextInputWithLabel
            label={i18n.t("firstNameLabel", { scope })}
            onChangeText={(str) => setFirstName(str)}
            value={firstName}
            placeholder={i18n.t("firstNamePlaceholder", { scope })}
            returnKeyType="next"
            textContentType="givenName"
            onSubmitEditing={() => lastNameInputRef?.current?.focus()}
          />
          <Box paddingVertical="s" />
          <TextInputWithLabel
            label={i18n.t("lastNameLabel", { scope })}
            onChangeText={(str) => setLastName(str)}
            value={lastName}
            placeholder={i18n.t("lastNamePlaceholder", { scope })}
            returnKeyType="done"
            textContentType="familyName"
            onSubmitEditing={handleInfoSubmit}
            ref={lastNameInputRef}
          />
        </>
      }
      title={i18n.t("title", { scope })}
      button={{ onPress: handleInfoSubmit, disabled }}
    />
  );
}
