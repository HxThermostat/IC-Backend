import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import Box from "~/components/Box";
import Text from "~/components/Text";
import { useSurveyFeedback } from "~/contexts/SurveyFeedbackContext";
import { ChatIcon } from "~/components/Icons";
import { useSurveyFeedbackChat } from "~/hooks";

import i18n from "~/i18n";

import { trackSegmentEvent } from "~/utils/kohort";

const scope = "Screens.Authenticated.Home";

type SurveyPromptProps = {
  onPress: () => void;
  userId: string;
  userName: string;
};

export function SurveyPrompt({
  onPress,
  userId,
  userName,
}: SurveyPromptProps): JSX.Element {
  const {
    connected,
    connecting,
    connect,
    isChatAvailable,
  } = useSurveyFeedbackChat({
    userId,
    userName,
  });
  const {
    showPrompt,
    sessionToken,
    requestSurveySession,
  } = useSurveyFeedback();
  const [trackedPrompting, setTrackedPrompting] = useState(false);
  const animatedOpacityVal = useRef(new Animated.Value(0)).current;
  const animatedOpacity = animatedOpacityVal.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const show: boolean = connected && isChatAvailable && showPrompt;

  useEffect(() => {
    if (!sessionToken) requestSurveySession();
  }, [sessionToken, requestSurveySession]);

  useEffect(() => {
    if (sessionToken && !connected && !connecting) {
      void connect();
    }
  }, [sessionToken, connected, connect, connecting]);

  useEffect(() => {
    Animated.timing(animatedOpacityVal, {
      toValue: show ? 1 : 0,
      duration: 400,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [animatedOpacityVal, show]);

  useEffect(() => {
    if (show && !trackedPrompting) {
      trackSegmentEvent("Survey Feedback Prompt Shown", {
        trigger: "SurveyPrompt",
      });
      setTrackedPrompting(true);
    }
  }, [show, trackedPrompting]);

  return (
    <Animated.View
      style={{ opacity: animatedOpacity }}
      testID="survey-prompt-container"
    >
      <Box flexDirection="row" alignItems="center">
        <Text variant="scheduleOverrideCaption" paddingRight="s">
          {i18n.t("survey.prompt", { scope })}
        </Text>
        <TouchableOpacity onPress={onPress}>
          <ChatIcon color="tint" size={30} />
        </TouchableOpacity>
      </Box>
    </Animated.View>
  );
}
