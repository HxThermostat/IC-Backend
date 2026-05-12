import { useCallback, useEffect } from "react";
import { Platform } from "react-native";

import { useApolloClient } from "@apollo/client";

import { getInstallationTimeAsync } from "expo-application";

import * as StoreReview from "react-native-store-review";

import { useDebouncedCallback } from "use-debounce";

import {
  RequestRatingDocument,
  RequestRatingQuery,
  RequestRatingQueryVariables,
} from "~/graph";

import { loadFromAsyncStorage, saveToAsyncStorage } from "~/utils/storage";
import { trackSegmentEvent } from "~/utils/kohort";
import { nativeBuild, nativeVersion } from "~/utils/version";

import useIsFocused from "./useIsFocused";

const DELAY = 5000;

export const useRatingRequest = (trigger: string): (() => void) => {
  const client = useApolloClient();

  const { callback, cancel } = useDebouncedCallback(
    useCallback(async () => {
      const lastDisplayedAt = await loadFromAsyncStorage(
        "last_rating_prompt_at"
      );

      const installedAt = (await getInstallationTimeAsync()).toISOString();

      const {
        data: { requestRating },
      } = await client.query<RequestRatingQuery, RequestRatingQueryVariables>({
        query: RequestRatingDocument,
        variables: {
          build: nativeBuild,
          installedAt,
          lastDisplayedAt,
          platform: Platform.select({
            ios: "IOS",
            default: "ANDROID",
          }),
          version: nativeVersion,
        },
        fetchPolicy: "network-only",
      });

      if (!requestRating) return;

      trackSegmentEvent("Rating Prompt Triggered", { trigger });

      StoreReview.requestReview();

      void saveToAsyncStorage(
        "last_rating_prompt_at",
        new Date().toISOString()
      );
    }, [client, trigger]),
    DELAY,
    {
      leading: false,
      trailing: true,
    }
  );

  // We don't want the request to trigger if the user navigated away
  // from the screen they were on when completing the trigger action
  const focused = useIsFocused();
  useEffect(() => {
    if (!focused) cancel();
  }, [cancel, focused]);

  if (!StoreReview.isAvailable) {
    return noop;
  }

  return callback;
};
