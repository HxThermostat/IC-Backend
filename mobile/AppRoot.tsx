import { ApolloProvider } from "@apollo/client";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppStateProvider, AuthProvider, DeviceProvider } from "~/contexts";
import AppThemeProvider from "~/theme/AppThemeProvider";

import { client } from "~/graph";

import "~/utils/globals";
import { initSentry } from "~/utils/sentry";
import { initUpdates } from "~/utils/updates";

import RootNavigator from "~/navigators/RootNavigator";

import { initializeKohort, KohortProvider } from "./utils/kohort";

initializeKohort();

initSentry();

initUpdates();

export default function App(): JSX.Element {
  return (
    <ApolloProvider client={client}>
      <ActionSheetProvider>
        <DeviceProvider>
          <AppStateProvider>
            <AppThemeProvider>
              <KohortProvider>
                <AuthProvider>
                  <SafeAreaProvider>
                    <RootNavigator />
                  </SafeAreaProvider>
                </AuthProvider>
              </KohortProvider>
            </AppThemeProvider>
          </AppStateProvider>
        </DeviceProvider>
      </ActionSheetProvider>
    </ApolloProvider>
  );
}
