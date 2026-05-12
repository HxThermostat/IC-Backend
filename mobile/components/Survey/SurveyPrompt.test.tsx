import { ApolloProvider } from "@apollo/client";
import React from "react";
import { waitFor } from "@testing-library/react-native";

import { SurveyFeedbackProvider } from "~/contexts/SurveyFeedbackContext";

import { client } from "~/graph/client";

import { setupComponentTests } from "~/utils/test-utils";
import { SurveyPrompt } from "./SurveyPrompt";

// Prevents trackSegmentEvent
jest.mock("~/utils/kohort");

// Mock the connection/availability states to true
jest.mock("~/hooks/useSurveyFeedbackChat", () => {
  const originalModule: Record<string, unknown> = jest.requireActual(
    "~/hooks/useSurveyFeedbackChat"
  );

  return {
    __esmodule: true,
    ...originalModule,
    useSurveyFeedbackChat: jest.fn().mockImplementation(() => ({
      connected: true,
      isChatAvailable: true,
      connect: jest.fn(),
    })),
  } as unknown;
});

// Mock the sessionToken and showPrompt states
jest.mock("~/contexts/SurveyFeedbackContext/SurveyFeedbackContext", () => {
  const originalModule: Record<string, unknown> = jest.requireActual(
    "~/contexts/SurveyFeedbackContext/SurveyFeedbackContext"
  );

  return {
    __esmodule: true,
    ...originalModule,
    useSurveyFeedback: jest.fn().mockImplementation(() => ({
      sessionToken: "test-token-1234",
      showPrompt: true,
    })),
  } as unknown;
});

// These mocks prevent errors/warnings from the test renderer
jest.mock("react-native-gesture-handler");
jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper");

const { render, ScreenWrapper } = setupComponentTests();

describe("SurveyPrompt", () => {
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

  const TestingPrompt = (): React.ReactElement => (
    <SurveyPrompt
      onPress={jest.fn()}
      userId="test-user-id"
      userName="test@user.com"
    />
  );

  it("renders without error", () => {
    const { getByText } = render(<TestingPrompt />, {
      wrapper: TestingProvider,
    });

    expect(getByText(/Feedback\?/)).toBeTruthy();
  });

  it("is visible when connected and chat is available", async () => {
    const { getByTestId } = render(<TestingPrompt />, {
      wrapper: TestingProvider,
    });

    const container = getByTestId("survey-prompt-container");
    await waitFor(() =>
      expect((container.props.style as Record<string, unknown>).opacity).toBe(1)
    );
  });
});
