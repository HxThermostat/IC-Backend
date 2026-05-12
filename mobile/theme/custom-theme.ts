import { ColorPalette } from "./color";

import WhiteLabelConstants from "~/utils/white-label";

export const lightPalette: Partial<ColorPalette> = {
  // cool: "#0031FF",
  // coolButton: "#193694",
  // coolGradientStart: "#1D367F",
  // coolGradientEnd: "#0031FF",
  // heat: "#E10101",
  // heatButton: "#830202",
  // heatGradientStart: "#830202",
  // heatGradientEnd: "#FF0000",
  ...WhiteLabelConstants.LIGHT_COLORS,
};
export const darkPalette: Partial<ColorPalette> = {
  ...WhiteLabelConstants.DARK_COLORS,
};
