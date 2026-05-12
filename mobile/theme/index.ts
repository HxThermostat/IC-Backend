import {
  createTheme,
  useTheme as useThemeRS,
  ColorProps as RsColorProps,
  useResponsiveProp,
} from "@shopify/restyle";

import {
  colors,
  defaultPalette,
  darkPalette,
  ThemeColor,
  isThemeColor,
} from "./color";

import textVariants from "./variants/Fonts";
import stepperButtonVariants from "./variants/StepperButton";

export { ThemeColor, ThemeColors, isThemeColor } from "./color";

export const theme = createTheme({
  isDarkTheme: false,
  breakpoints: { phone: 0 },
  colors: colors(defaultPalette),
  spacing: {
    z: 0,
    xxs: 2,
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },
  stepperButtonVariants: {
    ...stepperButtonVariants,
  },
  textVariants: {
    ...textVariants,
  },
});

export const darkTheme = createTheme({
  ...theme,
  isDarkTheme: true,
  colors: colors(darkPalette),
});

export type Theme = typeof theme;

export type ColorProps = RsColorProps<Theme>;

export const useTheme = (): Theme => useThemeRS<Theme>();

export function useThemeColor(color: ThemeColor): string;
export function useThemeColor(color: ColorProps["color"]): string | undefined;
export function useThemeColor(
  color: [ThemeColor, ThemeColor]
): [string, string];
export function useThemeColor(
  color: [ColorProps["color"], ColorProps["color"]]
): [string | undefined, string | undefined];
export function useThemeColor(
  color: ColorProps["color"] | [ColorProps["color"], ColorProps["color"]]
): string | undefined | [string | undefined, string | undefined] {
  const { colors: palette } = useTheme();
  const colors = Array.isArray(color) ? color : [color];

  const color1 = useResponsiveProp(colors[0]);
  const color2 = useResponsiveProp(colors[1]);

  if (colors.length === 1) {
    return color1 ? palette[color1] : undefined;
  } else {
    return [
      color1 ? palette[color1] : undefined,
      color2 ? palette[color2] : undefined,
    ];
  }
}

export function useIsThemeColor(): (color: string) => color is ThemeColor {
  const { colors: palette } = useTheme();
  return (color: string): color is ThemeColor => isThemeColor(color, palette);
}
