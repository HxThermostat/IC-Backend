import { useCallback } from "react";
import { RangeValue } from "~/graph";

import { insideRange } from "~/utils/math";

type RangeSafe = {
  setValueSafe: (newValue: number, updateServer?: boolean) => void;
  increaseValueSafe: () => void;
  decreaseValueSafe: () => void;
};

export function useRangeSafe(
  value: number,
  valueRange: RangeValue,
  onValuesChange: (value: number, updateServer?: boolean) => void
): RangeSafe {
  const setValueSafe = useCallback(
    (newValue: number, updateServer = true) => {
      // Check if newLower is inside valid lowerRange
      if (!insideRange(valueRange.max, valueRange.min, newValue)) {
        return;
      }

      onValuesChange(newValue, updateServer);
    },
    [valueRange.max, valueRange.min, onValuesChange]
  );

  const increaseValueSafe = useCallback(
    () => setValueSafe(value + valueRange.step),
    [setValueSafe, value, valueRange.step]
  );
  const decreaseValueSafe = useCallback(
    () => setValueSafe(value - valueRange.step),
    [setValueSafe, value, valueRange.step]
  );

  return {
    setValueSafe,
    increaseValueSafe,
    decreaseValueSafe,
  };
}
