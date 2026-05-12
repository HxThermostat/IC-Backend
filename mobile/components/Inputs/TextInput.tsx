import React, { useCallback, useState } from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  Platform,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInputSubmitEditingEventData,
  TextInputEndEditingEventData,
} from "react-native";

import { TextInput as PaperTextInput } from "react-native-paper";

import ActivityIndicator from "~/components/ActivityIndicator";
import Box, { Row } from "~/components/Box";

import { useTheme } from "~/theme";

type PaperInputProps = React.ComponentProps<typeof PaperTextInput>;

// For uniformity (and to ensure we don't accidentally pass props that
// won't have an effect on a given platform) we're defaulting to the
// RNTextInputProps and carrying forward a few props from the
// PaperTextInput. We can add more as needed, but prefer these to be
// explicit additions over implicitly being supported.
export type TextInputProps = RNTextInputProps &
  Pick<PaperInputProps, "label" | "selectionColor" | "theme"> & {
    loading?: boolean;
  };

export const TextInputIOS = React.forwardRef<RNTextInput, TextInputProps>(
  (
    {
      clearButtonMode,
      editable,
      loading,
      maxFontSizeMultiplier = 1.4,
      style,
      ...rest
    }: TextInputProps,
    ref
  ) => {
    const { colors, spacing } = useTheme();
    return (
      <Row
        backgroundColor="textInputBackgroundIOS"
        borderRadius={5}
        justifyContent="space-between"
      >
        <RNTextInput
          style={[
            // eslint-disable-next-line react-native/no-inline-styles
            {
              flex: 1,
              color: colors.text,
              paddingVertical: spacing.s,
              paddingHorizontal: spacing.s,
            },
            style,
          ]}
          {...rest}
          ref={ref}
          clearButtonMode={loading ? "never" : clearButtonMode}
          editable={loading ? false : editable}
          maxFontSizeMultiplier={maxFontSizeMultiplier}
          placeholderTextColor={colors.textPlaceholder}
        />
        {loading && <ActivityIndicator marginHorizontal="s" size="small" />}
      </Row>
    );
  }
);

TextInputIOS.displayName = "TextInputIOS";

export const TextInputAndroid = React.forwardRef<RNTextInput, TextInputProps>(
  (props: TextInputProps, ref): JSX.Element => {
    const { colors } = useTheme();
    const {
      clearButtonMode,
      editable,
      label,
      loading,
      maxFontSizeMultiplier,
      onBlur,
      onEndEditing,
      onFocus,
      onSubmitEditing,
      style,
      theme,
      ...rest
    } = props;

    const [focused, setFocused] = useState(false);

    const handleFocus = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setFocused(true);
        onFocus && onFocus(e);
      },
      [onFocus]
    );

    const handleBlur = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setFocused(false);
        onBlur && onBlur(e);
      },
      [onBlur]
    );

    const handleOnSubmitEditing = useCallback(
      (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        setFocused(false);
        onSubmitEditing && onSubmitEditing(e);
      },
      [onSubmitEditing]
    );

    const handleEndEditing = useCallback(
      (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
        setFocused(false);
        onEndEditing && onEndEditing(e);
      },
      [onEndEditing]
    );

    return (
      <Box>
        <PaperTextInput
          {...rest}
          clearButtonMode={loading ? "never" : clearButtonMode}
          editable={loading ? false : editable}
          label={label ?? ""}
          maxFontSizeMultiplier={maxFontSizeMultiplier}
          onSubmitEditing={handleOnSubmitEditing}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onEndEditing={handleEndEditing}
          placeholderTextColor={colors.textPlaceholder}
          ref={ref}
          style={[
            // eslint-disable-next-line react-native/no-inline-styles
            { flex: 1 },
            style,
          ]}
          theme={{
            ...theme,
            colors: {
              disabled: colors.textDisabled,
              ...theme?.colors,
            },
          }}
          underlineColor={
            focused && !loading
              ? colors.tint
              : colors.textInputUnderlineInactiveAndroid
          }
        />
        {loading && (
          // Vertically-center the loading indicator in the TextInput
          <ActivityIndicator
            alignItems="flex-end"
            justifyContent="center"
            bottom={0}
            top={0}
            right={0}
            position="absolute"
            marginRight="m"
            size={"small"}
          />
        )}
      </Box>
    );
  }
);

TextInputAndroid.displayName = "TextInputAndroid";

const TextInput = Platform.select({
  default: TextInputIOS,
  android: TextInputAndroid,
});

export default TextInput;
