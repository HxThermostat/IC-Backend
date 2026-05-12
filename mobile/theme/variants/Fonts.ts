import { TextStyle } from "react-native";

import { systemWeights } from "react-native-typography";

import { ThemeColor } from "../color";

const palette: Record<
  string,
  Omit<TextStyle, "color"> & { color?: ThemeColor }
> = {
  body: {
    ...systemWeights.regular,
    color: "text",
    fontSize: 17,
    lineHeight: 20,
    letterSpacing: -0.24,
  },
  caption: {
    ...systemWeights.light,
    color: "text",
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
  },
  displayLarge: {
    ...systemWeights.regular,
    color: "text",
    fontSize: 34,
    letterSpacing: -0.251,
  },
  pageHeading: {
    ...systemWeights.semibold,
    color: "text",
    fontSize: 18,
    lineHeight: 20,
    letterSpacing: -0.24,
  },
};

const modifiers: Record<string, TextStyle> = {
  strong: {
    ...systemWeights.bold,
  },
  light: {
    ...systemWeights.light,
  },
  subdued: {
    opacity: 0.6,
  },
};

// We'd like to type this something like Record<string, TextStyle>,
// but doing so erases type inference down the line (i.e. it breaks
// keyof)
const variants = {
  adjustBlockLabel: {
    ...palette.displayLarge,
  },
  body: { ...palette.body },
  bodyStrong: { ...palette.body, ...modifiers.strong },
  button: {
    ...palette.body,
    ...systemWeights.semibold,
    color: "textOnColor",
  },
  dialAmbientInteger: {
    ...systemWeights.light,
    color: "text",
    fontSize: 90,
    lineHeight: 90,
  },
  dialAmbientFraction: {
    ...systemWeights.light,
    color: "text",
    fontSize: 30,
    lineHeight: 34,
  },
  dialAmbientLabel: {
    ...palette.caption,
    ...modifiers.subdued,
    textTransform: "uppercase",
  },
  dialCursorInteger: {
    ...systemWeights.regular,
    color: "text",
    fontSize: 20,
    lineHeight: 20,
  },
  dialCursorFraction: {
    ...systemWeights.regular,
    color: "text",
    fontSize: 12,
    lineHeight: 12.5,
  },
  headerButton: {
    ...palette.pageHeading,
    ...systemWeights.regular,
    color: "tint",
  },
  heading: {
    ...palette.pageHeading,
  },
  homeTitleBarText: {
    ...palette.caption,
    ...modifiers.subdued,
    textAlign: "right",
    textTransform: "lowercase",
  },
  homeTitleBarValue: {
    ...palette.body,
    textAlign: "right",
    textTransform: "lowercase",
  },
  onboardingHelper: { ...palette.caption },
  largeTitle: { ...palette.displayLarge },
  listLabel: {
    ...palette.body,
  },
  modalHeader: {
    ...palette.pageHeading,
    textAlign: "center",
  },
  cardTitle: {
    ...systemWeights.semibold,
    color: "text",
    fontSize: 26,
    lineHeight: 41,
    letterSpacing: 0.31,
  },
  scheduleOverrideCaption: {
    ...palette.caption,
  },
  scheduleTimeMetadata: {
    ...palette.caption,
    ...modifiers.subdued,
  },
  presetLabelTemperature: {
    ...palette.caption,
    ...systemWeights.thin,
  },
  presetLabelEdit: {
    ...palette.caption,
    ...modifiers.subdued,
    ...systemWeights.semibold,
  },
  scheduleTitleMetadata: {
    ...palette.body,
    ...systemWeights.semibold,
  },

  sublistLabel: {
    ...palette.body,
    ...modifiers.subdued,
  },
  separatorLabel: {
    ...palette.caption,
    textTransform: "uppercase",
  },
  separatorHelperLabel: {
    ...palette.caption,
  },
  offlineHelperLabel: {
    ...palette.pageHeading,
    color: "error",
  },
  textInputTextLabelIOS: {
    ...palette.caption,
    ...systemWeights.thin,
    textTransform: "uppercase",
  },
};

export default variants;
