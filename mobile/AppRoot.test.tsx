import "react-native";
import React from "react";
import App from "./AppRoot";

// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

jest.useFakeTimers();

describe("AppRoot", () => {
  it("renders correctly", () => {
    expect(() => renderer.create(<App />)).not.toThrow();
  });
});
