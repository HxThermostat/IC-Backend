import { useEffect, useState } from "react";

import { useDebouncedCallback } from "use-debounce";

export function useLocalSetpoint(
  serverValue: number
): [number, (v: number) => void] {
  const [localValue, setLocalValueUnsafe] = useState(serverValue);

  useEffect(() => setLocalValueUnsafe(serverValue), [serverValue]);

  // Debounce the UI updates, capping to ~60 updates/second
  const setLocalValueDebounced = useDebouncedCallback(setLocalValueUnsafe, 16, {
    leading: true,
    maxWait: 16,
  });
  return [localValue, setLocalValueDebounced.callback];
}
