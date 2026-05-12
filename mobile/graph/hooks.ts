import { useDebouncedCallback } from "use-debounce";
import {
  MutationTuple,
  MutationResult,
  MutationFunctionOptions,
} from "@apollo/client";

export function useDebouncedMutation<TData, TVariables>(
  [mutation, result]: MutationTuple<TData, TVariables>,
  options: {
    delay: number;
    maxWait?: number;
    leading?: boolean;
    trailing?: boolean;
  } = {
    delay: 1000,
  }
): [
  (options?: MutationFunctionOptions<TData, TVariables> | undefined) => void,
  {
    result: MutationResult<TData>;
    cancel: () => void;
    flush: () => void;
    pending: () => boolean;
  }
] {
  const { callback, cancel, flush, pending } = useDebouncedCallback(
    mutation,
    options.delay,
    options
  );

  return [callback, { result, cancel, flush, pending }];
}
