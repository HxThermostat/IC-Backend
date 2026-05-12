import React from "react";
import { View, ViewProps } from "react-native";

import { setupComponentTests } from "~/utils/test-utils";

import Cloak from "./Cloak";

const { render } = setupComponentTests();

function Probe({ opacity }: ViewProps & { opacity?: number }): JSX.Element {
  return <View testID="probe" style={{ opacity }} />;
}

describe("Cloak", () => {
  test.each`
    hidden       | visible      | expected
    ${true}      | ${undefined} | ${"hidden"}
    ${true}      | ${true}      | ${"visible"}
    ${true}      | ${false}     | ${"hidden"}
    ${false}     | ${undefined} | ${"visible"}
    ${false}     | ${true}      | ${"visible"}
    ${false}     | ${false}     | ${"hidden"}
    ${undefined} | ${undefined} | ${"visible"}
    ${undefined} | ${true}      | ${"visible"}
    ${undefined} | ${false}     | ${"hidden"}
  `(
    "<Cloak hidden={$hidden} visible={$visible} /> is $expected",
    ({
      hidden,
      visible,
      expected,
    }: {
      hidden?: boolean;
      visible?: boolean;
      expected: "visible" | "hidden";
    }) => {
      const { queryByTestId } = render(
        <Cloak hidden={hidden} visible={visible}>
          {({ opacity }) => <Probe opacity={opacity} />}
        </Cloak>
      );

      expect(queryByTestId("probe")?.props.style).toEqual(
        expect.objectContaining({
          opacity: expected === "hidden" ? 0 : undefined,
        })
      );
    }
  );
});
