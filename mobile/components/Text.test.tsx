/* eslint jest/expect-expect: ["warn", { "assertFunctionNames": ["expect", "expectTextColor"] }] */

import React from "react";

import { fireEvent } from "@testing-library/react-native";

import { BackgroundProps } from "~/components/Background";

import RawText, { TextProps } from "./Text";

import { setupComponentTests } from "~/utils/test-utils";

const { render, BackgroundWrapper } = setupComponentTests();

function Text({
  backgroundProps,
  ...props
}: TextProps & { backgroundProps?: BackgroundProps }): JSX.Element {
  return (
    <BackgroundWrapper {...backgroundProps}>
      <RawText testID="text" {...props} />
    </BackgroundWrapper>
  );
}

describe("<Text />", () => {
  let getByTestId: ReturnType<typeof render>["getByTestId"];

  const fireLayoutEvent = (
    { x = 0, y = 0 }: { x?: number; y?: number } = { x: 0, y: 0 }
  ): void => {
    fireEvent(getByTestId("text"), "layout", {
      nativeEvent: {
        layout: { x, y, width: 0, height: 0 },
      },
    });
  };

  const expectTextColor = (color: string): void =>
    expect(getByTestId("text").props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color })])
    );

  describe("<StaticColorText />", () => {
    describe("with a color prop", () => {
      it("uses the named color from the theme", () => {
        ({ getByTestId } = render(<Text color="error">Hello</Text>));
        expectTextColor("#FF512F");
      });
    });

    describe("with a variant prop", () => {
      it("uses the color from the font variant", () => {
        ({ getByTestId } = render(
          <Text variant="offlineHelperLabel">Hello</Text>
        ));
        expectTextColor("#FF512F");
      });
    });

    describe("with a style prop", () => {
      it("uses the color from the stylesheet", () => {
        ({ getByTestId } = render(
          // eslint-disable-next-line react-native/no-inline-styles
          <Text style={{ color: "#FF512F" }}>Hello</Text>
        ));
        expectTextColor("#FF512F");
      });
    });
  });

  describe("<AutoColorText />", () => {
    describe("on a dark background", () => {
      it("uses a light color", () => {
        ({ getByTestId } = render(
          <Text backgroundProps={{ colors: ["text", "text"] }}>Hello</Text>
        ));
        fireLayoutEvent();
        expectTextColor("#F1F1F1");
      });
    });

    describe("on a light background", () => {
      it("uses a dark color", () => {
        ({ getByTestId } = render(
          <Text backgroundProps={{ colors: ["textOnColor", "textOnColor"] }}>
            Hello
          </Text>
        ));
        fireLayoutEvent();
        expectTextColor("#181718");
      });
    });
  });
});
