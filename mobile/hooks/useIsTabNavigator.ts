import { useFeatureFlags } from "~/contexts";

export const useIsTabNavigator = (): boolean => {
  const { isFeatureEnabled } = useFeatureFlags();
  if (isFeatureEnabled) {
    return isFeatureEnabled("schedule");
  }
  return false;
};
