import { useCallback } from "react";
import { Platform } from "react-native";

import { useApolloClient } from "@apollo/client";

import { getInstallationTimeAsync } from "expo-application";

import { useDebouncedCallback } from "use-debounce";

import {
  RequestSurveyFeedbackDocument,
  RequestSurveyFeedbackQuery,
  RequestSurveyFeedbackQueryVariables,
} from "~/graph";

import { loadFromAsyncStorage, saveToAsyncStorage } from "~/utils/storage";
import { trackSegmentEvent } from "~/utils/kohort";
import { nativeBuild, nativeVersion } from "~/utils/version";

import { useSurveyFeedback } from "~/contexts/SurveyFeedbackContext";

type UseSurveyFeedbackRequestResult = {
  requestSurveyFeedback: () => void;
};

const DELAY = 2000;

export const useSurveyFeedbackRequest = (
  trigger: string
): UseSurveyFeedbackRequestResult => {
  const client = useApolloClient();
  const { sessionToken, setShowPrompt } = useSurveyFeedback();

  const { callback } = useDebouncedCallback(
    useCallback(async () => {
      // Make sure we don't hit the server until we have a SendBird session
      if (!sessionToken) return;

      const lastDisplayedAt = await loadFromAsyncStorage(
        "last_survey_prompt_at"
      );
      const lastResponseAt = await loadFromAsyncStorage(
        "last_survey_response_at"
      );

      const installedAt = (await getInstallationTimeAsync()).toISOString();

      const {
        data: { requestSurveyFeedback },
      } = await client.query<
        RequestSurveyFeedbackQuery,
        RequestSurveyFeedbackQueryVariables
      >({
        query: RequestSurveyFeedbackDocument,
        variables: {
          build: nativeBuild,
          installedAt,
          lastDisplayedAt,
          lastResponseAt,
          platform: Platform.select({
            ios: "IOS",
            default: "ANDROID",
          }),
          version: nativeVersion,
        },
        fetchPolicy: "network-only",
      });

      if (!requestSurveyFeedback) return;

      trackSegmentEvent("Survey Feedback Prompt Triggered", { trigger });

      setShowPrompt(true);

      void saveToAsyncStorage(
        "last_survey_prompt_at",
        new Date().toISOString()
      );
    }, [client, trigger, sessionToken, setShowPrompt]),
    DELAY,
    {
      leading: false,
      trailing: true,
    }
  );

  return {
    requestSurveyFeedback: callback,
  };
};
