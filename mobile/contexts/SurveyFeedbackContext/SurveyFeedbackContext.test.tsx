import { ApolloProvider } from "@apollo/client";
import React from "react";
import { Button } from "react-native";
import { fireEvent, waitFor } from "@testing-library/react-native";

import Box from "~/components/Box";
import Text from "~/components/Text";
import {
  SurveyFeedbackProvider,
  useSurveyFeedback,
} from "~/contexts/SurveyFeedbackContext";

import { client } from "~/graph/client";

import { loadFromAsyncStorage, saveToAsyncStorage } from "~/utils/storage";
import { setupComponentTests } from "~/utils/test-utils";

jest.mock("~/graph/client");
jest.mock("~/utils/storage");

const ONE_WEEK_FROM_NOW = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
const ONE_HOUR_FROM_NOW = new Date(Date.now() + 60 * 60 * 1000);

const { render, ScreenWrapper } = setupComponentTests();

const loadFromAsyncStorageMock = loadFromAsyncStorage as jest.Mock;
const saveToAsyncStorageMock = saveToAsyncStorage as jest.Mock;
// eslint-disable-next-line @typescript-eslint/unbound-method
const clientQueryMock = client.query as jest.Mock;

afterEach(() => {
  loadFromAsyncStorageMock.mockClear();
  saveToAsyncStorageMock.mockClear();
  clientQueryMock.mockClear();
});

describe("SurveyFeedbackProvider", () => {
  const TestingProvider = (props: {
    children: React.ReactElement;
  }): React.ReactElement => (
    <ApolloProvider client={client}>
      <ScreenWrapper>
        <SurveyFeedbackProvider appId="test-app-id">
          {props.children}
        </SurveyFeedbackProvider>
      </ScreenWrapper>
    </ApolloProvider>
  );

  const SessionTokenDisplay = (): React.ReactElement => {
    const { sessionToken, requestSurveySession } = useSurveyFeedback();

    return (
      <Box>
        <Text>Session Token: {sessionToken ?? "?"}</Text>
        <Button
          title="Request Session"
          onPress={() => requestSurveySession()}
        ></Button>
      </Box>
    );
  };

  it("renders without error", () => {
    const { getByText } = render(<SessionTokenDisplay />, {
      wrapper: TestingProvider,
    });

    // Renders "?" at first because of no session token
    expect(getByText(/Session Token: \?/)).toBeTruthy();
  });

  describe("sessionToken", () => {
    it("requests sessionToken from the server when localStorage is empty", async () => {
      const { getByText } = render(<SessionTokenDisplay />, {
        wrapper: TestingProvider,
      });

      // Mock out the localStorage access
      loadFromAsyncStorageMock.mockImplementation(() => Promise.resolve(null));
      saveToAsyncStorageMock.mockImplementation(() => Promise.resolve(true));

      // Have to cast this as a Mock to prevent TypeScript confusion
      clientQueryMock.mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            requestSurveySession: {
              sessionToken: "test-token-1234",
              sessionExpiresAt: new Date(ONE_WEEK_FROM_NOW).toISOString(),
            },
          },
        })
      );

      // Kick off a request for the survey session
      const button = getByText(/Request Session/);
      fireEvent.press(button);

      // Render session token from query result
      await waitFor(() =>
        expect(getByText(/Session Token: test-token-1234/)).toBeTruthy()
      );

      // Loads and saves from async storage
      expect(loadFromAsyncStorageMock).toBeCalledWith(
        "survey_feedback_session_token"
      );
      expect(loadFromAsyncStorageMock).toBeCalledWith(
        "survey_feedback_session_expires_at"
      );
      expect(saveToAsyncStorageMock).toBeCalledWith(
        "survey_feedback_session_token",
        "test-token-1234"
      );
      expect(saveToAsyncStorageMock).toBeCalledWith(
        "survey_feedback_session_expires_at",
        new Date(ONE_WEEK_FROM_NOW).toISOString()
      );
    });

    it("loads sessionToken from localStorage when not expired", async () => {
      const { getByText } = render(<SessionTokenDisplay />, {
        wrapper: TestingProvider,
      });

      const fakeStorage: { [key: string]: string } = {
        survey_feedback_session_token: "test-local-token-1234",
        survey_feedback_session_expires_at: ONE_WEEK_FROM_NOW.toISOString(),
      };

      // Load from fakeStorage
      loadFromAsyncStorageMock.mockImplementation((key: string) =>
        Promise.resolve(fakeStorage[key])
      );
      saveToAsyncStorageMock.mockImplementation(() => Promise.resolve(true));

      // Kick off a request for the survey session
      const button = getByText(/Request Session/);
      fireEvent.press(button);

      // Render session token from query result
      await waitFor(() =>
        expect(getByText(/Session Token: test-local-token-1234/)).toBeTruthy()
      );

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(clientQueryMock).not.toBeCalled();

      // Loads and saves from async storage
      expect(loadFromAsyncStorageMock).toBeCalledWith(
        "survey_feedback_session_token"
      );
      expect(loadFromAsyncStorageMock).toBeCalledWith(
        "survey_feedback_session_expires_at"
      );
      expect(saveToAsyncStorageMock).not.toBeCalled();
    });

    it("loads sessionToken from server when localStorage token is expiring within 24 hours", async () => {
      const { getByText } = render(<SessionTokenDisplay />, {
        wrapper: TestingProvider,
      });

      const fakeStorage: { [key: string]: string } = {
        survey_feedback_session_token: "test-local-token-2345",
        survey_feedback_session_expires_at: ONE_HOUR_FROM_NOW.toISOString(),
      };

      // Load from fakeStorage
      loadFromAsyncStorageMock.mockImplementation((key: string) =>
        Promise.resolve(fakeStorage[key])
      );
      saveToAsyncStorageMock.mockImplementation(() => Promise.resolve(true));

      clientQueryMock.mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            requestSurveySession: {
              sessionToken: "test-new-token-1234",
              sessionExpiresAt: ONE_WEEK_FROM_NOW.toISOString(),
            },
          },
        })
      );

      // Kick off a request for the survey session
      const button = getByText(/Request Session/);
      fireEvent.press(button);

      // Render session token from query result
      await waitFor(() =>
        expect(getByText(/Session Token: test-new-token-1234/)).toBeTruthy()
      );

      // Loads and saves from async storage
      expect(loadFromAsyncStorageMock).toBeCalledWith(
        "survey_feedback_session_token"
      );
      expect(loadFromAsyncStorageMock).toBeCalledWith(
        "survey_feedback_session_expires_at"
      );
      expect(saveToAsyncStorageMock).toBeCalledWith(
        "survey_feedback_session_token",
        "test-new-token-1234"
      );
      expect(saveToAsyncStorageMock).toBeCalledWith(
        "survey_feedback_session_expires_at",
        ONE_WEEK_FROM_NOW.toISOString()
      );
    });
  });
});
