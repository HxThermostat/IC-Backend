import { useNavigation } from "@react-navigation/native";

import { trackSegmentScreen } from "~/utils/kohort";
import { addNavigationBreadcrumb } from "~/utils/sentry";

export type NavigationOptionsProp = {
  navigation: ReturnType<typeof useNavigation>;
};

export const handleScreenChange = (
  screenName: string | undefined,
  previousScreenName: string | null | undefined
): void => {
  if (screenName) {
    trackSegmentScreen(screenName);
    addNavigationBreadcrumb(screenName, previousScreenName);
  }
};
