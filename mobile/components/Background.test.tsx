/* eslint jest/expect-expect: ["warn", { "assertFunctionNames": ["expect", "expectTextColor"] }] */

import React from "react";

import { setupComponentTests } from "~/utils/test-utils";

const { render, BackgroundWrapper: Background } = setupComponentTests();

describe("<Background />", () => {
  it("uses the theme colors by default", () => {
    const { getByTestId } = render(<Background />);
    const background = getByTestId("background");

    expect(background.props.colors).toEqual(
      expect.arrayContaining([
        parseInt("FFF1F1F1", 16),
        parseInt("FFF1F1F1", 16),
      ])
    );
  });

  describe("gradient color", () => {
    it("takes the colors passed in via props", () => {
      const { getByTestId } = render(
        <Background colors={["text", "textOnColor"]} />
      );
      const background = getByTestId("background");

      expect(background.props.colors).toEqual(
        expect.arrayContaining([
          parseInt("FF181718", 16),
          parseInt("FFF1F1F1", 16),
        ])
      );
    });
  });

  describe("backgroundColor style", () => {
    it("skips the linear gradient", () => {
      const { getByTestId } = render(
        // eslint-disable-next-line react-native/no-inline-styles
        <Background containerStyle={{ backgroundColor: "#000" }} />
      );
      const background = getByTestId("background");
      expect(background.props.colors).toEqual(expect.arrayContaining([0, 0]));
      expect(background.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: "#000" }),
        ])
      );
    });
  });
});
