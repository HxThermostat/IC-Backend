import * as ExpoApplication from "expo-application";

import WhiteLabelConstants from "~/utils/white-label";

export const GRAPH_URL = __DEV__
  ? process.env.GRAPH_URL ?? WhiteLabelConstants.GRAPH_URL
  : WhiteLabelConstants.GRAPH_URL;

export const URI_SCHEME = __DEV__
  ? process.env.URI_SCHEME ?? WhiteLabelConstants.URI_SCHEME
  : WhiteLabelConstants.URI_SCHEME;

export const APP_NAME = ExpoApplication.applicationName;
export const APP_ID = ExpoApplication.applicationId ?? "";

export const SENDBIRD_APP_ID = "53D6F28C-E0B9-428C-9F82-43AA6DB22034";

// These are from the Sendbird dashboard
export const SENDBIRD_CHAT_MODERATOR_USER_ID =
  process.env.SENDBIRD_CHAT_MODERATOR_USER_ID ?? "223471";
export const SENDBIRD_CHAT_MODERATOR_PUBLIC_CHANNEL_URL =
  process.env.SENDBIRD_CHAT_MODERATOR_PUBLIC_CHANNEL_URL ??
  "sendbird_open_channel_11538_ed494552067593a39760fc79149736c30a39d30e";
