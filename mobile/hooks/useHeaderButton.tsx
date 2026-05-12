import React, { useCallback, useLayoutEffect, useState } from "react";
import { Platform, PlatformOSType } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { HeaderButton } from "~/components/Touchables";

import i18n from "~/i18n";

type HeaderButtonHookParams = Pick<
  React.ComponentProps<typeof HeaderButton>,
  "disabled" | "loading" | "onPress" | "text"
> & {
  placement: "headerLeft" | "headerRight";
  platform?: PlatformOSType[] | PlatformOSType;
};

export function useHeaderButton({
  onPress,
  placement,
  platform,
  text,
  disabled = false,
  loading = false,
}: HeaderButtonHookParams): void {
  const navigation = useNavigation();

  let platformMatch: boolean;

  if (platform == null) {
    platformMatch = true;
  } else {
    platformMatch = (Array.isArray(platform) ? platform : [platform]).includes(
      Platform.OS
    );
  }

  useLayoutEffect(() => {
    if (!platformMatch) return;

    navigation.setOptions({
      // eslint-disable-next-line react/display-name
      [placement]: () => (
        <HeaderButton
          disabled={disabled}
          onPress={onPress}
          text={text}
          loading={loading}
        />
      ),
    });
  }, [disabled, loading, navigation, onPress, placement, platformMatch, text]);
}

export function useBackButton(
  params?: Partial<Omit<HeaderButtonHookParams, "onPress">>
): void {
  const navigation = useNavigation();
  const onPress = useCallback(() => navigation.goBack(), [navigation]);
  return useHeaderButton({
    placement: "headerRight",
    text: i18n.t("Common.back"),
    onPress,
    ...params,
  });
}

export function useSaveButton({
  disabled,
  handleSave,
  navigateBack = false,
  ...rest
}: Partial<Omit<HeaderButtonHookParams, "onPress">> & {
  handleSave: () => Promise<unknown> | unknown;
  navigateBack?: boolean;
}): { didChange: (changed?: boolean) => void } {
  const navigation = useNavigation();

  const [changed, setChanged] = useState(false);

  const didChange = useCallback((changed = true) => {
    setChanged(changed);
  }, []);

  const onPress = useCallback(async () => {
    setChanged(false);
    await handleSave();
    if (navigateBack) navigation.goBack();
  }, [handleSave, navigateBack, navigation]);

  useHeaderButton({
    disabled: disabled || !changed,
    placement: "headerRight",
    text: i18n.t("Common.save"),
    onPress,
    ...rest,
  });

  return {
    didChange,
  };
}
