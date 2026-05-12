import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ApolloQueryResult, WatchQueryFetchPolicy } from "@apollo/client";

export function useFocusPolling<Q>({
  refetch,
  startPolling,
  stopPolling,
  focusPollInterval = 5000,
  fetchPolicy,
}: {
  refetch: () => Promise<ApolloQueryResult<Q>>;
  startPolling: (ms: number) => void;
  stopPolling: () => void;
  focusPollInterval: number;
  fetchPolicy?: WatchQueryFetchPolicy;
}): void {
  const [initialFocus, setInitialFocus] = useState(true);

  useFocusEffect(
    useCallback(() => {
      // We don't want to poll if the fetchPolicy expects to only use the cache
      // eslint-disable-next-line default-case
      switch (fetchPolicy) {
        case "cache-only":
        case "cache-first":
          return;
      }
      // Since the polling can take some time to kick in, we want to
      // kick off one request immediately once the wrapped component
      // _regains_ focus
      if (!initialFocus) {
        try {
          void refetch();
        } catch {
          console.warn("refetch failed");
        }
      }

      startPolling(focusPollInterval);
      return () => {
        stopPolling();
        setInitialFocus(false);
      };
    }, [
      fetchPolicy,
      focusPollInterval,
      initialFocus,
      refetch,
      startPolling,
      stopPolling,
    ])
  );
}
