import {
  ApolloQueryResult,
  isApolloError,
  Reference,
  StoreObject,
  useApolloClient,
} from "@apollo/client";
import React, {
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useState,
} from "react";
import { Platform } from "react-native";
import { openComposer } from "react-native-email-link";

import { FeatureFlagProvider, FeatureMap } from "~/contexts";
import { useActionSheet, useSingletonAlert } from "~/hooks";

import {
  BootstrapDocument,
  BootstrapQuery,
  LoadDocument,
  LoadQuery,
  useRemoveAccountMutation,
  useRemoveLocationMutation,
} from "~/graph";
import { buildLink } from "~/graph/links";

import i18n from "~/i18n";

import { clearToken, setToken } from "~/utils/auth";
import { clearLink } from "~/utils/linking";
import { registerDevice, unregisterDevice } from "~/utils/notifications";
import { setSentryUser } from "~/utils/sentry";
import { reloadIfAvailable } from "~/utils/updates";
import { nativeBuild, nativeVersion } from "~/utils/version";
import {
  KohortFunnel,
  KohortFunnelEventStep,
  resetSegmentForUser,
  useKohortTracking,
} from "~/utils/kohort";

export interface Token {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}
interface AuthContext {
  bootstrap: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  reload: (options: { awaitLoad?: boolean; hard?: boolean }) => Promise<void>;
  removeAccount: (promptForConfirmation?: boolean) => Promise<void>;
  removeLocation: (locationId: string) => Promise<void>;
  signIn: (token: Token) => Promise<void>;
  signOut: (promptForConfirmation?: boolean) => Promise<void>;
  isLoading: boolean;
  isSignout: boolean;
  isOnboarding: boolean;
  isUpdateRequired: boolean;
}

const AuthContext = React.createContext<AuthContext | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

interface State {
  isLoading: boolean;
  isSignout: boolean;
  isOnboarding: boolean;
  isUpdateRequired: boolean;
}

type Action =
  | { type: "BOOTSTRAP"; hasDevicesSetup: boolean }
  | { type: "COMPLETE_ONBOARDING" }
  | { type: "LOADING" }
  | { type: "SIGN_IN" }
  | { type: "SIGN_OUT" }
  | { type: "UPDATE_REQUIRED" };

const authReducer = (prevState: State, action: Action): State => {
  switch (action.type) {
    case "BOOTSTRAP":
      return {
        ...prevState,
        isLoading: false,
        isOnboarding: !action.hasDevicesSetup,
        isSignout: false,
      };
    case "COMPLETE_ONBOARDING":
      return {
        ...prevState,
        isOnboarding: false,
      };
    case "LOADING":
      return {
        ...prevState,
        isLoading: true,
      };
    case "SIGN_IN":
      return {
        ...prevState,
        isLoading: true,
        isSignout: false,
      };
    case "SIGN_OUT":
      return {
        ...prevState,
        isLoading: false,
        isSignout: true,
      };
    case "UPDATE_REQUIRED":
      return {
        ...prevState,
        isLoading: false,
        isUpdateRequired: true,
      };
    default: {
      return prevState;
    }
  }
};

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(authReducer, {
    isLoading: true,
    isSignout: false,
    isOnboarding: false,
    isUpdateRequired: false,
  });

  const [features, setFeatures] = useState<FeatureMap | undefined>(undefined);

  const client = useApolloClient();

  const { showActionSheetWithOptions } = useActionSheet();
  const { showSingletonAlert } = useSingletonAlert();
  const [removeAccountMutation] = useRemoveAccountMutation();
  const [removeLocationMutation] = useRemoveLocationMutation();
  const { identifyUser, trackFunnel } = useKohortTracking();

  const loadData = useCallback(
    async (
      awaitLoad = false
    ): Promise<
      ApolloQueryResult<BootstrapQuery> | { error: Error; data: null }
    > => {
      // The Bootstrap query will return the most critical data required
      // to render the first screen of the app
      const bootstrapQueryResult = client
        .query<BootstrapQuery>({
          query: BootstrapDocument,
          variables: {
            platform: Platform.select({
              ios: "IOS",
              android: "ANDROID",
            }),
            version: nativeVersion,
            build: nativeBuild,
          },
          fetchPolicy: "network-only",
        })
        .catch((error: Error) => ({
          error,
          data: null,
        }));

      // The Load query will load (most) of the rest of the data so that
      // we don't have to present loading screens to the user all over
      // the place
      const loadQueryResult = client.query<LoadQuery>({
        query: LoadDocument,
        fetchPolicy: "network-only",
      });

      const data = await bootstrapQueryResult;

      setFeatures(data.data?.features);

      if (awaitLoad) await loadQueryResult;

      return data;
    },
    [client]
  );

  const signOut = useCallback(
    async (promptForConfirmation?: boolean) => {
      const handleSignOut = async (): Promise<void> => {
        await clearToken();

        resetSegmentForUser();
        setSentryUser(null);

        client.stop();
        await client.clearStore();
        client.setLink(buildLink());

        void unregisterDevice(client);

        dispatch({ type: "SIGN_OUT" });
      };
      if (promptForConfirmation) {
        showActionSheetWithOptions({
          items: [
            {
              label: i18n.t("Common.logoutSheet.logout"),
              onPress: async () => await handleSignOut(),
              destructive: true,
            },
            {
              label: i18n.t("Common.cancel"),
              cancel: true,
            },
          ],
          message: i18n.t("Common.logoutSheet.message"),
        });
      } else {
        await handleSignOut();
      }
    },
    [client, showActionSheetWithOptions]
  );

  const bootstrap = useCallback(async () => {
    const update = reloadIfAvailable();
    // Use the authenticated link chain without any refresh error
    // handling since we'll handle the cleanup of unauthenticated
    // requests later in the bootstrap process
    client.setLink(buildLink(async () => Promise.resolve()));

    const { data, error } = await loadData();

    // Don't continue with the process if we're about to reload the
    // whole app
    await update;

    if (!data?.features) {
      showSingletonAlert(
        i18n.t("Common.errorAlert.title"),
        i18n.t("Common.errorAlert.message"),
        [
          {
            text: i18n.t("Common.errorAlert.emailSupport"),
            style: "destructive",
            onPress: () =>
              openComposer({
                to: "feedback@appexperience.dev",
                subject: i18n.t("Common.errorAlert.emailSubject"),
                body: i18n.t("Common.errorAlert.emailBody"),
              }),
          },
          {
            text: i18n.t("Common.errorAlert.tryAgain"),
            style: "default",
            onPress: bootstrap,
          },
        ]
      );
      return;
    } else if (error && isApolloError(error) && error.networkError) {
      showSingletonAlert(
        i18n.t("Common.offlineAlert.title"),
        i18n.t("Common.offlineAlert.message"),
        [
          {
            text: i18n.t("Common.offlineAlert.logout"),
            style: "destructive",
            onPress: () => signOut(),
          },
          {
            text: i18n.t("Common.offlineAlert.tryAgain"),
            style: "default",
            onPress: bootstrap,
          },
        ]
      );
      return;
    }

    if (data?.updateRequired) {
      return dispatch({
        type: "UPDATE_REQUIRED",
      });
    }

    if (data?.me) {
      client.setLink(
        buildLink(async () => {
          await signOut();
        })
      );

      setSentryUser({
        id: data.me.id,
      });

      identifyUser(data.me.id, {});
      trackFunnel({
        funnel: KohortFunnel.Adoption,
        step: KohortFunnelEventStep.SignIn,
      });

      void registerDevice(client);

      dispatch({
        type: "BOOTSTRAP",
        hasDevicesSetup: data.locations.length > 0,
      });
    } else {
      await signOut();
    }
  }, [
    loadData,
    client,
    signOut,
    showSingletonAlert,
    identifyUser,
    trackFunnel,
  ]);

  const completeOnboarding = useCallback(async () => {
    await loadData();
    dispatch({ type: "COMPLETE_ONBOARDING" });
  }, [loadData]);

  const signIn = useCallback(
    async (token) => {
      client.stop();
      await client.clearStore();
      await setToken(token);
      dispatch({ type: "SIGN_IN" });
      await bootstrap();
      // Clear any deep links that signed the user in previously
      clearLink();
    },
    [bootstrap, dispatch, client]
  );

  const removeAccount = useCallback(
    async (promptForConfirmation?: boolean) => {
      const handleRemoveAccount = async (): Promise<void> => {
        await removeAccountMutation();
        void signOut(false);
      };
      if (promptForConfirmation) {
        showActionSheetWithOptions({
          title: i18n.t("Common.removeAccountSheet.title"),
          message: i18n.t("Common.removeAccountSheet.message"),
          items: [
            {
              label: i18n.t("Common.removeAccountSheet.confirm"),
              destructive: true,
              onPress: handleRemoveAccount,
            },
            {
              label: i18n.t("Common.cancel"),
              cancel: true,
            },
          ],
        });
      } else {
        await handleRemoveAccount();
      }
    },
    [removeAccountMutation, showActionSheetWithOptions, signOut]
  );

  const removeLocation = useCallback(
    async (locationId: string) => {
      // Track if we've removed the last location and need to present
      // the onboarding flow to the user
      let hasDevicesSetup = true;

      await removeLocationMutation({
        variables: { locationId },
        update: (cache, { data }) => {
          if (data?.removeLocation.__typename !== "RemoveLocationSuccess")
            return;

          // kraftful/klimate#370: It looks like there are still dangling
          // references in the cache in the form of
          //
          //    controller({"id":"xyz"}): {"__ref":"Controller:xyz"}
          //    location({"id":"def"}): {"__ref":"Location:def"}
          //
          // The underlying objects have been removed from the cache
          // (e.g. Controller:xyz), so these *shouldn't* matter, but
          // at some point it would be good to figure out how to clear
          // them out too (this could also be the source of a future
          // weird bug with state falling out of sync)

          const toEvict: Array<StoreObject | Reference> = [];

          cache.modify({
            fields: {
              locations(
                existingLocationRefs: Array<StoreObject | Reference> = [],
                { readField }
              ) {
                const remainingLocationRefs = existingLocationRefs.filter(
                  (locationRef) => locationId !== readField("id", locationRef)
                );

                existingLocationRefs
                  .filter(
                    (locationRef) => locationId === readField("id", locationRef)
                  )
                  .forEach((locationRef) => toEvict.push(locationRef));

                hasDevicesSetup = remainingLocationRefs.length > 0;

                return remainingLocationRefs;
              },
              controllers(
                existingControllerRefs: Array<StoreObject | Reference> = [],
                { readField, isReference }
              ) {
                return existingControllerRefs.filter((controllerRef) => {
                  const locationRef = readField("location", controllerRef);
                  if (isReference(locationRef)) {
                    if (locationId === readField("id", locationRef)) {
                      toEvict.push(controllerRef);

                      return false;
                    }
                  }

                  return true;
                });
              },
            },
          });

          toEvict.forEach((ref) => cache.evict({ id: cache.identify(ref) }));
          cache.gc();
        },
      });

      if (!hasDevicesSetup) {
        dispatch({ type: "LOADING" });
        await bootstrap();
      }
    },
    [bootstrap, removeLocationMutation]
  );

  const reload = useCallback(
    async ({ hard = false, awaitLoad = true }) => {
      if (hard) {
        dispatch({ type: "LOADING" });

        client.stop();
        await client.clearStore();

        await bootstrap();
      } else {
        await loadData(awaitLoad);
      }
    },
    [bootstrap, client, loadData]
  );

  const context = useMemo<AuthContext>(
    (): AuthContext => ({
      bootstrap,
      completeOnboarding,
      reload,
      removeAccount,
      removeLocation,
      signIn,
      signOut,
      isLoading: state.isLoading,
      isSignout: state.isSignout,
      isOnboarding: state.isOnboarding,
      isUpdateRequired: state.isUpdateRequired,
    }),
    [
      bootstrap,
      completeOnboarding,
      reload,
      removeAccount,
      removeLocation,
      signIn,
      signOut,
      state.isLoading,
      state.isSignout,
      state.isOnboarding,
      state.isUpdateRequired,
    ]
  );

  return (
    <AuthContext.Provider value={context}>
      <FeatureFlagProvider features={features}>{children}</FeatureFlagProvider>
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContext {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }

  return context;
}
