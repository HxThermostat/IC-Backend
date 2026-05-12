import { Platform } from "react-native";

import * as Localization from "expo-localization";
import i18n from "i18n-js";

import moment from "moment";

import { APP_NAME } from "~/config/constants";

import en from "./en.json";
import fr from "./fr.json";
import es from "./es.json";

i18n.defaultLocale = "en";
i18n.fallbacks = true;
i18n.translations = { en, fr, es };
i18n.locale = Localization.locale;

// It's just an object for our monkey patch
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
i18n.globals = { appName: APP_NAME };

moment.locale(i18n.locale);

const bestGuessRegionForAndroid = (locale: string): string => {
  // can't grab country code on Android using Localization.region
  if (locale.includes("-")) {
    // es-US, fr-CA, de-DE etc.
    return locale.split("-")[1];
  }
  return "US";
};

export const usersCurrentRegion =
  Platform.OS === "ios"
    ? Localization.region
    : bestGuessRegionForAndroid(i18n.locale);

export default i18n;
