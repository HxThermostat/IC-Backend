import { Linking } from "react-native";

import {
  LinkingOptions,
  PathConfigMap,
  getStateFromPath,
} from "@react-navigation/native";

import { addNotificationReceivedListener } from "expo-notifications";

import { URI_SCHEME } from "~/config/constants";

import { insertSiblingRoute, AppRoute } from "./helpers";

// example cmds for iOS and Android:
// xcrun simctl openurl booted klimate:// path
// adb shell am start -W -a android.intent.action.VIEW -d 'klimate://path' com.kraftful.klimate

export enum NavigatorType {
  STACK,
  TAB,
}

type DeepLinkingConfigOptions = {
  navigator: NavigatorType;
};

const SettingsConfig = {
  initialRouteName: "Settings",
  path: "settings",
  screens: {
    About: "about",
    Away: {
      path: "away/:locationId",
    },
    AwayController: {
      path: "adjustControllerAway/:locationCount/:locationId/:controllerId",
    },
    AwayLocation: {
      path: "adjustLocationAway/:locationCount/:locationId",
    },
    FaultLogsLocation: {
      path: "faultLogs/:locationCount/:locationId",
    },
  },
};

const HomeConfig = {
  path: "home/:showModeModal?/:showControllerModal?",
  parse: {
    showModeModal: (str: string): boolean => JSON.parse(str) as boolean,
    showControllerModal: (str: string): boolean => JSON.parse(str) as boolean,
  },
};

const tabScreens = {
  Tabs: {
    screens: {
      Home: HomeConfig,
      Schedules: "schedules",
      Settings: SettingsConfig,
    },
  },
};
const stackScreens = {
  Home: HomeConfig,
  Settings: SettingsConfig,
};
const config = (
  options: DeepLinkingConfigOptions
): {
  initialRouteName?: string | undefined;
  screens: PathConfigMap;
} => ({
  screens: {
    App: {
      screens: {
        Authenticated: {
          initialRouteName: "Home",
          screens: {
            ...(options.navigator === NavigatorType.TAB
              ? tabScreens
              : stackScreens),
          },
        },
        Unauthenticated: {
          initialRouteName: "EnterEmailAddress",
          screens: {
            EnterEmailConfirmation: "signIn/:email/:emailToken",
            EnterEmailAddress: "*",
          },
        },
      },
    },
  },
});

const deepLinkingConfig = (
  options: DeepLinkingConfigOptions
): LinkingOptions => ({
  prefixes: [`${URI_SCHEME}://`, `https://${URI_SCHEME}.kraftful.app`],
  config: config(options),
  getStateFromPath: (path, options) => {
    const state = getStateFromPath(path, options);

    if (
      path.includes("adjustLocationAway") ||
      path.includes("adjustControllerAway")
    ) {
      const [, , locationCount, locationId] = path.split("/");
      const awayRoute: AppRoute = {
        name: "Away",
        params: { locationId },
      };
      const locationRoute: AppRoute = {
        name: "Location",
        params: { locationId },
      };

      if (locationCount === "1") {
        return insertSiblingRoute(state, awayRoute);
      } else {
        return insertSiblingRoute(
          insertSiblingRoute(state, locationRoute),
          awayRoute
        );
      }
    }

    if (path.includes("faultLogs")) {
      const [, , locationCount, locationId] = path.split("/");
      const locationRoute: AppRoute = {
        name: "Location",
        params: { locationId },
      };
      if (locationCount === "1") {
        return state;
      } else {
        return insertSiblingRoute(state, locationRoute);
      }
    }

    return state;
  },

  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }): void => listener(url);

    Linking.addEventListener("url", onReceiveURL);

    const subscription = addNotificationReceivedListener((response) => {
      const url = response.request.content.data?.url;

      // If we provide a URL property, deep link to it right away
      if (typeof url === "string" && url.startsWith(`${URI_SCHEME}://`)) {
        listener(url);
      }
    });

    return () => {
      Linking.removeEventListener("url", onReceiveURL);
      subscription.remove();
    };
  },
});

export default deepLinkingConfig;
