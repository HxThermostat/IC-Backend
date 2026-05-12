import { useCallback } from "react";
import { RangeValue } from "~/graph";

import { greaterThan, insideRange, lessThan } from "~/utils/math";

type ValueKey = "lower" | "upper";

type DualRangeSafe = {
  setDualRangeSafe: (
    type: ValueKey,
    newValue: number,
    updateServer?: boolean
  ) => void;
  increaseDualRangeSafe: (type: ValueKey) => void;
  decreaseDualRangeSafe: (type: ValueKey) => void;
};

export function useDualRangeSafe(
  lower: number,
  upper: number,
  lowerRange: RangeValue,
  upperRange: RangeValue,
  minInterval: number,
  onValuesChange: (lower: number, upper: number, updateServer?: boolean) => void
): DualRangeSafe {
  const setLowerSafe = useCallback(
    (newLower: number, updateServer: boolean) => {
      // Check if newLower is inside valid lowerRange
      if (!insideRange(lowerRange.max, lowerRange.min, newLower)) {
        return;
      }

      // Check if updating lower is going to push upper out of valid upperRange
      if (greaterThan(newLower + minInterval, upperRange.max)) {
        return;
      }

      let newUpper = upper;
      // Update max if needed because of minInterval
      if (upper && lessThan(upper, newLower + minInterval)) {
        newUpper = newLower + minInterval;
      }
      onValuesChange(newLower, newUpper, updateServer);
    },
    [
      lowerRange.min,
      lowerRange.max,
      minInterval,
      upperRange.max,
      upper,
      onValuesChange,
    ]
  );

  const setUpperSafe = useCallback(
    (newUpper: number, updateServer: boolean) => {
      // Check if newUpper is inside valid upperRange
      if (!insideRange(upperRange.max, upperRange.min, newUpper)) {
        return;
      }

      // Check if updating upper is going to push lower out of valid lowerRange
      if (lessThan(newUpper - minInterval, lowerRange.min)) {
        return;
      }

      let newLower = lower;
      // Update lower if needed because of minInterval
      if (lower && greaterThan(lower, newUpper - minInterval)) {
        newLower = newUpper - minInterval;
      }
      onValuesChange(newLower, newUpper, updateServer);
    },
    [
      upperRange.min,
      upperRange.max,
      minInterval,
      lowerRange.min,
      lower,
      onValuesChange,
    ]
  );

  // Shortcut to increase/decrease range values
  const setDualRangeSafe = useCallback(
    (type: ValueKey, newValue: number, updateServer = true) => {
      type === "upper"
        ? setUpperSafe(newValue, updateServer)
        : setLowerSafe(newValue, updateServer);
    },
    [setUpperSafe, setLowerSafe]
  );
  const increaseDualRangeSafe = useCallback(
    (type: ValueKey) => {
      const newValue =
        type === "lower" ? lower + lowerRange.step : upper + upperRange.step;
      setDualRangeSafe(type, newValue);
    },
    [lower, lowerRange.step, setDualRangeSafe, upper, upperRange.step]
  );
  const decreaseDualRangeSafe = useCallback(
    (type: ValueKey) => {
      const newValue =
        type === "lower" ? lower - lowerRange.step : upper - upperRange.step;
      setDualRangeSafe(type, newValue);
    },
    [setDualRangeSafe, lower, lowerRange.step, upper, upperRange.step]
  );

  return {
    setDualRangeSafe,
    increaseDualRangeSafe,
    decreaseDualRangeSafe,
  };
}
