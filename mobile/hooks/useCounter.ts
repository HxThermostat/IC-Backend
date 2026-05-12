import React, { useCallback, useEffect, useRef } from "react";

export function useCounter(
  {
    onChange,
    timeout,
  }: {
    onChange?: (outstanding: number) => void;
    timeout?: number;
  } = {},
  deps?: React.DependencyList
): {
  increment: () => number;
  decrement: () => number;
  reset: () => void;
  count: () => number;
} {
  const outstandingRef = useRef(0);
  const outstandingTimeoutRef = useRef<number>();

  const count = useCallback(() => {
    return outstandingRef.current;
  }, []);

  const resetTimeout = useCallback(() => {
    clearTimeout(outstandingTimeoutRef.current);
    outstandingTimeoutRef.current = undefined;
  }, []);

  const reset = useCallback(() => {
    const outstanding = outstandingRef.current;
    outstandingRef.current = 0;
    resetTimeout();

    // Because we may call this method when the outstanding was
    // already set to zero, we don't want to trigger the onChange
    // callback for an unchanged value
    if (outstanding !== outstandingRef.current) {
      onChange?.(0);
    }
  }, [onChange, resetTimeout]);

  const increment = useCallback(() => {
    // Sanity check to avoid negative counts
    const outstanding = (outstandingRef.current = Math.max(
      1,
      outstandingRef.current + 1
    ));

    clearTimeout(outstandingTimeoutRef.current);

    if (timeout != null && timeout > 0) {
      outstandingTimeoutRef.current = setTimeout(reset, timeout);
    }

    onChange?.(outstanding);

    return outstanding;
  }, [onChange, reset, timeout]);

  const decrement = useCallback(() => {
    // Sanity check to avoid negative counts
    const outstanding = (outstandingRef.current = Math.max(
      0,
      outstandingRef.current - 1
    ));

    onChange?.(outstanding);

    if (outstanding === 0) {
      resetTimeout();
    }

    return outstanding;
  }, [onChange, resetTimeout]);

  // Alternatively we could type deps as:
  // deps?: unknown[]
  // But I think it's probably better to communicate intent through
  // the type so that the type signature more-or-less matches known
  // hooks, like useEffect
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  useEffect(reset, [reset, ...(deps ?? [])]);

  return { count, reset, increment, decrement };
}
