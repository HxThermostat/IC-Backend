import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import { useTheme } from "~/theme";

import { CURSOR_WIDTH } from "./constants";

// More-or-less the height of the header on the home screen
// We'll extend the dial this amount for landscape aspect ratios
const GROW_UP = 100;

type ModeGradients = Record<"HEAT" | "COOL" | "DISABLED", [string, string]>;

interface StaticDialDimens {
  cx: number;
  cy: number;
  r: number;
  dialSize: number;
  growUp: number;
}

export default function useStaticDial(): {
  dimensions: StaticDialDimens;
  modeGradients: ModeGradients;
} {
  const { spacing } = useTheme();
  const { height, width } = useWindowDimensions();

  const dimensions = useMemo((): StaticDialDimens => {
    let growUp: number, dialSize: number;

    if (width > height * 1.3) {
      growUp = GROW_UP;
      dialSize = height * 0.44 + growUp;
    } else {
      growUp = 0;
      dialSize = width - 2 * spacing.l;
    }

    dialSize = Math.min(Math.max(dialSize, 320), 480);

    const r = (dialSize - CURSOR_WIDTH) / 2;
    const cx = dialSize / 2;
    const cy = dialSize / 2;

    return { growUp, dialSize, r, cx, cy };
  }, [width, height, spacing.l]);

  const { colors } = useTheme();
  const modeGradients = useMemo(
    (): ModeGradients => ({
      HEAT: [colors.dialHeatGradientStart, colors.dialHeatGradientEnd],
      COOL: [colors.dialCoolGradientStart, colors.dialCoolGradientEnd],
      DISABLED: [colors.dialInactive, colors.dialInactive],
    }),
    [colors]
  );
  return { dimensions, modeGradients };
}
