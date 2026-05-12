import { useCallback } from "react";

import { Platform, StyleSheet, TextStyle } from "react-native";

import {
  useActionSheet as useExpoActionSheet,
  ActionSheetOptions,
} from "@expo/react-native-action-sheet";

import { useTheme } from "~/theme";

import { useDeviceContext } from "~/contexts";

const styles = StyleSheet.create({
  container: {},
  message: {
    opacity: 0.74,
  },
  text: {},
  title: {
    opacity: 0.74,
  },
});

export type ActionSheetItem = {
  label: string;
  onPress?: () => void | Promise<void>;
  cancel?: boolean;
  destructive?: boolean;
};

export type Config = Omit<
  ActionSheetOptions,
  "options" | "cancelButtonIndex" | "destructiveButtonIndex"
> & {
  items: ActionSheetItem[];
};

// Don't use light colors on iOS, Version < 13
const supportCustomAppearance =
  Platform.OS !== "ios" || parseInt(Platform.Version as string, 10) >= 13;

export const useActionSheet = (): {
  showActionSheetWithOptions: (config: Config) => void;
} => {
  const { showActionSheetWithOptions } = useExpoActionSheet();
  const { isIpad } = useDeviceContext();
  const { colors } = useTheme();

  return {
    showActionSheetWithOptions: useCallback(
      (config: Config) => {
        const defaults = supportCustomAppearance
          ? {
              containerStyle: styles.container,
              messageTextStyle: { ...styles.message, color: colors.text },
              textStyle: { color: colors.text } as TextStyle,
              tintColor: colors.tint,
              titleTextStyle: { ...styles.title, color: colors.text },
            }
          : {};
        const { items, ...rest } = config;

        const sortedItems = items.sort((a) => (a.cancel ? 1 : 0));

        const cancelButtonIndex = sortedItems.findIndex((i) => i.cancel);
        const destructiveButtonIndex = sortedItems.findIndex(
          (i) => i.destructive
        );

        const options = {
          options: sortedItems.map((i) => i.label),
          cancelButtonIndex:
            !isIpad && cancelButtonIndex > -1 ? cancelButtonIndex : undefined,
          destructiveButtonIndex:
            destructiveButtonIndex > -1 ? destructiveButtonIndex : undefined,
          ...rest,
        };

        showActionSheetWithOptions({ ...defaults, ...options }, (i) => {
          const item = sortedItems[i];

          item.onPress && item.onPress();
        });
      },
      [colors.text, colors.tint, isIpad, showActionSheetWithOptions]
    ),
  };
};
