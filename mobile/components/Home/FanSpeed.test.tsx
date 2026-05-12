import React from "react";

import { FanSpeed } from "~/components/Home/FanSpeed";

import { setupComponentTests } from "~/utils/test-utils";

const { render, ReStyleWrapper } = setupComponentTests();

describe("FanSpeed", () => {
  describe("SpeedNameFan", () => {
    it("renders SpeedNameFan (HIGH) correctly", () => {
      const { queryByText } = render(<FanSpeed speed="HIGH" />, {
        wrapper: ReStyleWrapper,
      });

      expect(queryByText(/running on high/)).not.toBeNull();
    });

    it("does not render if speed is OFF", () => {
      const { queryByText } = render(<FanSpeed speed="OFF" />, {
        wrapper: ReStyleWrapper,
      });

      expect(queryByText(/running on/)).toBeNull();
    });
  });

  describe("PercentageFan", () => {
    it("renders PercentageFan (70) correctly", () => {
      const { queryByText } = render(<FanSpeed speed={70} />, {
        wrapper: ReStyleWrapper,
      });

      expect(queryByText(/running at 70%/)).not.toBeNull();
    });
  });
});
