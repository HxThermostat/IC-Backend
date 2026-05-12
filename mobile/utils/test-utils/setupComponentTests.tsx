import { render } from "@testing-library/react-native";

import { wait } from "./wait";

import { BackgroundWrapper, ReStyleWrapper, ScreenWrapper } from "./wrappers";

let calledRender = false;

const AFTER_TEST_WAIT_TIME = 100;

beforeAll(() => {
  calledRender = false;
});

afterAll(async () => {
  if (calledRender) await wait(AFTER_TEST_WAIT_TIME);
});

type SetupComponentTestsResult = {
  BackgroundWrapper: typeof BackgroundWrapper;
  ReStyleWrapper: typeof ReStyleWrapper;
  ScreenWrapper: typeof ScreenWrapper;
  render: (
    ...renderArgs: Parameters<typeof render>
  ) => ReturnType<typeof render>;
};

/**
 * Abstracted helpers for running component tests. Can be called from top-level in tests or
 * inside of describe() blocks if you want more scoping.
 *
 * @example
 * import { setupComponentTests } from "~/utils/test-utils"
 *
 * const { render, ReStyleWrapper } = setupComponentTests();
 *
 * describe("FanSpeed", () => {
 *   it("renders SpeedNameFan (HIGH) correctly", () => {
 *     const { queryByText } = render(<FanSpeed speed="HIGH" />, {
 *       wrapper: ReStyleWrapper,
 *     });
 *
 *     expect(queryByText(/running on high/)).not.toBeNull();
 *   });
 * });
 */
export function setupComponentTests(): SetupComponentTestsResult {
  return {
    BackgroundWrapper,
    ReStyleWrapper,
    ScreenWrapper,
    render: (
      ...renderArgs: Parameters<typeof render>
    ): ReturnType<typeof render> => {
      calledRender = true;
      return render(...renderArgs);
    },
  };
}
