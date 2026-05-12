import { Platform } from "react-native";

import { attemptToOpenURL } from "~/utils/linking";

import WhiteLabelConstants from "~/utils/white-label";

const APP_ID = Platform.select({
  ios: WhiteLabelConstants.IOS_STORE_ID,
  default: WhiteLabelConstants.ANDROID_STORE_ID,
});

const APP_STORE_LINK = `itms-apps://apps.apple.com/app/id${APP_ID}?action=write-review`;
const PLAY_STORE_LINK = `market://details?id=${APP_ID}`;

const STORE_LINK = Platform.select({
  ios: APP_STORE_LINK,
  default: PLAY_STORE_LINK,
});

export const openReviewInStore = (): void => attemptToOpenURL(STORE_LINK);
