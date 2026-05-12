import { createText, useResponsiveProp } from "@shopify/restyle";
import React from "react";
import { TextStyle, StyleSheet } from "react-native";
import { NonUndefined, ValuesType } from "utility-types";

import { useForegroundColor } from "~/contexts";
import { Theme, useTheme, useThemeColor } from "~/theme";

const ReStyledText = createText<Theme>();

/**
 * Override Text to provide a single entry to easily adjust things
 * like default font, color, accessibility options across app for
 * future proofing etc.
 */
export type TextProps = React.ComponentProps<typeof ReStyledText> & {
  allowNull?: boolean;
  fontVariant?:
    | ValuesType<NonUndefined<TextStyle["fontVariant"]>>
    | NonUndefined<TextStyle["fontVariant"]>;
};

function AutoColorText(props: TextProps): JSX.Element {
  const { color, onLayout } = useForegroundColor(["text", "textOnColor"]);

  return <StaticColorText {...props} color={color} onLayout={onLayout} />;
}

function StaticColorText({
  allowNull,
  children,
  fontVariant,
  maxFontSizeMultiplier = 1.8,
  style,
  ...rest
}: TextProps): JSX.Element {
  // weird: iOS RN Text renders null as slightly smaller than with
  // content, so we want to render an empty-ish string, so the layout
  // doesn't shift when it's null
  // see https://snack.expo.dev/BK5e2xegt
  const childrenWithNullFix = allowNull ? children : children ?? " ";
  return (
    <ReStyledText
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={StyleSheet.flatten([
        fontVariant
          ? {
              fontVariant: Array.isArray(fontVariant)
                ? fontVariant
                : [fontVariant],
            }
          : {},
        style,
      ])}
      {...rest}
    >
      {childrenWithNullFix}
    </ReStyledText>
  );
}

export default function Text(props: TextProps): JSX.Element {
  const { textVariants } = useTheme();
  const responsiveColor = useThemeColor(props.color);
  const responsiveVariant = useResponsiveProp(props.variant);

  const assignedColor =
    responsiveColor ??
    (responsiveVariant ? textVariants[responsiveVariant].color : undefined) ??
    (props.style ? StyleSheet.flatten(props.style).color : undefined);

  if (assignedColor === undefined) {
    return <AutoColorText {...props} />;
  } else {
    return <StaticColorText {...props} />;
  }
}
