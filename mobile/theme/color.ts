import chroma from "chroma-js";
import { Platform } from "react-native";

const defaultPalette = {
  // Reference colors
  transparent: "transparent",
  black: "black",
  gray: "gray",
  white: "white",

  // General colors
  backgroundGradientStart: "#F1F1F1",
  backgroundGradientEnd: "#F1F1F1",
  controls: "#FFFFFF",
  lines: "#96999E",
  tint: "#007AFF",
  text: "#181718",
  textOnColor: "#F1F1F1",

  // Temperature control colors
  cool: "#007AFF",
  coolButton: "#0597E0",
  coolGradientStart: "#048EE7",
  coolGradientEnd: "#05E9A9",
  heat: "#FF512F",
  heatButton: "#FF5403",
  heatGradientStart: "#FF5302",
  heatGradientEnd: "#FF8F04",
  off: "#3C2F2F",
  disabled: "#828282",

  // schedule temperature colors
  temperaturePresetHomeGradientStart: "#FF9214",
  temperaturePresetHomeGradientEnd: "#FF0A8E",
  temperaturePresetAwayGradientStart: "#00BE85",
  temperaturePresetAwayGradientEnd: "#96DD00",
  temperaturePresetSleepGradientStart: "#0023DA",
  temperaturePresetSleepGradientEnd: "#00F1D4",
  temperaturePresetCustomGradientStart: "#B001FE",
  temperaturePresetCustomGradientEnd: "#FE4876",
};

const darkPalette: ColorPalette = {
  ...defaultPalette,
  backgroundGradientStart: "#000",
  backgroundGradientEnd: "#000",
  controls: "#1C1C1E",
  lines: "#CACCCE",
  text: "#FFF",
};

// We're using the return type of this function *as* the type for the
// Theme, must like we would if we were building the Theme using a
// colors const
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
function colors(palette: ColorPalette) {
  return {
    backgroundGradientStart: palette.backgroundGradientStart,
    backgroundGradientEnd: palette.backgroundGradientEnd,

    bottomSheetBackground: palette.controls,
    bottomSheetHandle: chroma(palette.lines).alpha(0.3).hex(),
    bottomSheetBackdrop: palette.black,

    dialCoolGradientStart: palette.coolGradientStart,
    dialCoolGradientEnd: palette.coolGradientEnd,
    dialCursorBackgroundColor: palette.controls,
    dialGlowCool: palette.cool,
    dialGlowHeat: palette.heat,
    dialHeatGradientStart: palette.heatGradientStart,
    dialHeatGradientEnd: palette.heatGradientEnd,
    dialInactive: palette.lines,
    dialRingColor: palette.controls,
    dialRingColorOff: palette.off,
    dialRingColorOffline: palette.disabled,

    divider: chroma(palette.lines).alpha(0.5).hex(),

    error: palette.heat,
    badge: palette.heat,

    listChevron: palette.lines,
    listItemButtonBorder: palette.lines,
    listItemBackground: palette.controls,
    listItemHighlightUnderlay: chroma(palette.lines).alpha(0.2).hex(),
    listItemRipple: chroma(palette.lines).alpha(0.2).hex(),

    manageTemperaturePresetSelectedBorder: palette.white,
    addTemperaturePresetSelectedBorder: palette.text,

    mapBackground: Platform.select({
      android: chroma(palette.black).alpha(0.25).hex(),
      default: chroma(palette.white).alpha(0.25).hex(),
    }),
    mapBorder: Platform.select({
      android: chroma(palette.black).alpha(0.5).hex(),
      default: chroma(palette.white).alpha(0.5).hex(),
    }),

    modeButtonCool: palette.coolButton,
    modeButtonHeat: palette.heatButton,
    modeButtonOff: palette.off,
    modeButtonOffline: palette.disabled,

    modeCool: palette.cool,
    modeHeat: palette.heat,

    pickerActionBarBackground: palette.backgroundGradientStart,
    pickerBackground: palette.backgroundGradientEnd,

    primaryButton: palette.tint,
    stepperButton: palette.controls,

    scheduleHomeGradientEnd: palette.temperaturePresetHomeGradientStart,
    scheduleHomeGradientStart: palette.temperaturePresetHomeGradientEnd,
    scheduleAwayGradientEnd: palette.temperaturePresetAwayGradientStart,
    scheduleAwayGradientStart: palette.temperaturePresetAwayGradientEnd,
    scheduleSleepGradientEnd: palette.temperaturePresetSleepGradientStart,
    scheduleSleepGradientStart: palette.temperaturePresetSleepGradientEnd,
    scheduleCustomGradientEnd: palette.temperaturePresetCustomGradientStart,
    scheduleCustomGradientStart: palette.temperaturePresetCustomGradientEnd,

    emptyScheduleCardBackground: palette.controls,

    scheduleAddStart: chroma(palette.lines).alpha(0.12).hex(),
    scheduleAddEnd: chroma(palette.lines).alpha(0.2).hex(),

    switchAndroidTrackColorFalseDisabled: palette.gray,
    switchAndroidTrackColorTrueDisabled: palette.gray,

    switchAndroidTrackColorTrue: chroma(palette.tint).alpha(0.5).hex(),
    switchAndroidTrackColorFalse: chroma(palette.gray).alpha(0.5).hex(),

    switchAndroidThumbTrue: palette.tint,
    switchAndroidThumbFalse: palette.white,

    switchIOSTrackColorTrue: palette.tint,
    switchIOSTrackColorFalse: palette.tint,

    switchIOSThumbFalse: palette.white,
    switchIOSThumbTrue: palette.white,

    tabInactive: palette.lines,

    temperaturePresetIconBG: chroma(palette.lines).alpha(0.12).hex(),

    temperaturePresetStepperCoolGradientStart: palette.coolGradientStart,
    temperaturePresetStepperCoolGradientEnd: palette.coolGradientEnd,
    temperaturePresetStepperHeatGradientStart: palette.heatGradientStart,
    temperaturePresetStepperHeatGradientEnd: palette.heatGradientEnd,

    text: palette.text,
    textOnColor: palette.textOnColor,

    textDestructive: palette.heat,
    textDisabled: chroma(palette.text).alpha(0.74).hex(),
    textPlaceholder: chroma(palette.text).alpha(0.74).hex(),

    textInputBackgroundIOS: palette.controls,
    textInputUnderlineInactiveAndroid: chroma(palette.lines).alpha(0.3).hex(),

    tint: palette.tint,

    transparent: palette.transparent,

    stepperButtonOnGradientBackground: chroma(palette.white).alpha(0.3).hex(),

    qrCodeBackground: palette.white,
  };
}

export type ColorPalette = typeof defaultPalette;
export type ThemeColors = ReturnType<typeof colors>;
export type ThemeColor = keyof ThemeColors;

export function isThemeColor(
  color: string,
  palette: ThemeColors
): color is ThemeColor {
  return !!palette[color as ThemeColor];
}

export { colors, defaultPalette, darkPalette };
