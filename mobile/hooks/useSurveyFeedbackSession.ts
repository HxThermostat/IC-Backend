import { useCallback, useState } from "react";
import { useApolloClient } from "@apollo/client";

import {
  RequestSurveySessionDocument,
  RequestSurveySessionMutation,
} from "~/graph";

import { loadFromAsyncStorage, saveToAsyncStorage } from "~/utils/storage";

type UseSurveyFeedbackSessionResult = {
  requestSurveySession: () => void;
  sessionToken?: string;
  sessionExpiresAt?: Date;
};

const ONE_DAY = 24 * 60 * 60 * 1000;

export const useSurveyFeedbackSession = (): UseSurveyFeedbackSessionResult => {
  const [sessionToken, setSessionToken] = useState<string>();
  const [sessionExpiresAt, setSessionExpiresAt] = useState<Date>();
  const client = useApolloClient();

  const requestSurveySession = useCallback(async () => {
    // Load the token info from localStorage if present
    const localToken = await loadFromAsyncStorage(
      "survey_feedback_session_token"
    );
    const localExpiresAt = await loadFromAsyncStorage(
      "survey_feedback_session_expires_at"
    );
    if (localToken && localExpiresAt) {
      const expiresDate = new Date(localExpiresAt);
      // Check for tokens that expire within 24 hours
      if (expiresDate.getTime() > Date.now() + ONE_DAY) {
        setSessionToken(localToken);
        setSessionExpiresAt(expiresDate);
        return;
      }
    }

    // Otherwise, load from the graph
    const {
      data: { requestSurveySession },
    } = await client.query<RequestSurveySessionMutation>({
      query: RequestSurveySessionDocument,
      fetchPolicy: "network-only",
    });

    if (!requestSurveySession) return;

    void saveToAsyncStorage(
      "survey_feedback_session_token",
      requestSurveySession.sessionToken
    );
    void saveToAsyncStorage(
      "survey_feedback_session_expires_at",
      requestSurveySession.sessionExpiresAt
    );

    setSessionToken(requestSurveySession.sessionToken);
    setSessionExpiresAt(new Date(requestSurveySession.sessionExpiresAt));
  }, [client, setSessionToken, setSessionExpiresAt]);

  return {
    requestSurveySession,
    sessionToken,
    sessionExpiresAt,
  };
};
