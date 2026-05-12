/* eslint jest/expect-expect: ["warn", { "assertFunctionNames": ["expect", "expectProbeColor"] }] */

import React, { PropsWithChildren } from "react";
import { Dimensions } from "react-native";

import { fireEvent } from "@testing-library/react-native";

import Box from "~/components/Box";

import { useForegroundColor } from "./BackgroundColorContext";

import { setupComponentTests } from "~/utils/test-utils";

const { render, BackgroundWrapper: Background } = setupComponentTests();

function Vertical({ children }: PropsWithChildren<unknown>): JSX.Element {
  return (
    <Background
      colors={["textOnColor", "text"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      {children}
    </Background>
  );
}

function Horizontal({ children }: PropsWithChildren<unknown>): JSX.Element {
  return (
    <Background
      colors={["textOnColor", "text"]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
    >
      {children}
    </Background>
  );
}

function Corner({ children }: PropsWithChildren<unknown>): JSX.Element {
  return (
    <Background
      colors={["textOnColor", "text"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </Background>
  );
}

function MidStop({ children }: PropsWithChildren<unknown>): JSX.Element {
  return (
    <Background
      colors={["textOnColor", "text"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.5 }}
    >
      {children}
    </Background>
  );
}

function Probe(): JSX.Element {
  const { color, onLayout } = useForegroundColor(["textOnColor", "text"]);

  return (
    <Box
      style={{ backgroundColor: color }}
      onLayout={onLayout}
      testID="probe"
    />
  );
}

describe("BackgroundColorContext", () => {
  let windowWidth: number;
  let windowHeight: number;
  let getByTestId: ReturnType<typeof render>["getByTestId"];

  const fireLayoutEvent = (
    { x = 0, y = 0 }: { x?: number; y?: number } = { x: 0, y: 0 }
  ): void => {
    fireEvent(getByTestId("probe"), "layout", {
      nativeEvent: {
        layout: { x, y, width: 0, height: 0 },
      },
    });
  };

  const expectProbeColor = (color: string): void =>
    expect(getByTestId("probe").props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: color }),
      ])
    );

  beforeAll(() => {
    ({ width: windowWidth, height: windowHeight } = Dimensions.get("window"));
  });

  describe("vertical gradient", () => {
    beforeEach(() => {
      ({ getByTestId } = render(
        <Vertical>
          <Probe />
        </Vertical>
      ));
    });

    test("top", () => {
      fireLayoutEvent();
      expectProbeColor("text");
    });
    test("middle", () => {
      fireLayoutEvent({ y: windowHeight / 2 });
      expectProbeColor("textOnColor");
    });
    test("bottom", () => {
      fireLayoutEvent({ y: windowHeight });
      expectProbeColor("textOnColor");
    });
  });

  describe("horizontal gradient", () => {
    beforeEach(() => {
      ({ getByTestId } = render(
        <Horizontal>
          <Probe />
        </Horizontal>
      ));
    });

    describe("vertical positions", () => {
      test("top", () => {
        fireLayoutEvent();
        expectProbeColor("text");
      });
      test("middle", () => {
        fireLayoutEvent({ y: windowHeight / 2 });
        expectProbeColor("text");
      });
      test("bottom", () => {
        fireLayoutEvent({ y: windowHeight });
        expectProbeColor("text");
      });
    });

    describe("horizontal positions", () => {
      test("left", () => {
        fireLayoutEvent();
        expectProbeColor("text");
      });
      test("middle", () => {
        fireLayoutEvent({ x: windowWidth / 2 });
        expectProbeColor("textOnColor");
      });
      test("right", () => {
        fireLayoutEvent({ x: windowWidth });
        expectProbeColor("textOnColor");
      });
    });
  });

  describe("corner-to-corner gradient", () => {
    beforeEach(() => {
      ({ getByTestId } = render(
        <Corner>
          <Probe />
        </Corner>
      ));
    });

    test("top-left", () => {
      fireLayoutEvent();
      expectProbeColor("text");
    });
    test("top-right", () => {
      fireLayoutEvent({ x: windowWidth });
      expectProbeColor("text");
    });
    test("bottom-left", () => {
      fireLayoutEvent({ y: windowHeight });
      expectProbeColor("textOnColor");
    });
    test("bottom-right", () => {
      fireLayoutEvent({ x: windowWidth, y: windowHeight });
      expectProbeColor("textOnColor");
    });
    test("middle", () => {
      fireLayoutEvent({ x: windowWidth / 2, y: windowHeight / 2 });
      expectProbeColor("textOnColor");
    });
  });

  // This is currently a known-broken case, leaving this here so we
  // can reference in an issue to tie is up
  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip("mid-stop gradient", () => {
    beforeEach(() => {
      ({ getByTestId } = render(
        <MidStop>
          <Probe />
        </MidStop>
      ));
    });

    test("top", () => {
      fireLayoutEvent();
      expectProbeColor("text");
    });
    test("middle", () => {
      fireLayoutEvent({ y: windowHeight / 2 });
      expectProbeColor("textOnColor");
    });
    test("bottom", () => {
      fireLayoutEvent({ y: windowHeight });
      expectProbeColor("textOnColor");
    });
    test("quarter", () => {
      fireLayoutEvent({ y: windowHeight / 4 });
      expectProbeColor("textOnColor");
    });
  });
});
