import * as React from "react";
import { Svg, G, Circle, Defs, RadialGradient, Stop } from "react-native-svg";

import { useTheme } from "~/theme";

type GlowProps = {
  color: string;
  size: number;
};

function Glow({ color, size }: GlowProps): JSX.Element {
  const { isDarkTheme } = useTheme();
  return (
    <Svg width={size} height={size} fill="none">
      <Defs>
        <RadialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <Stop
            offset="0%"
            stopColor={color}
            stopOpacity={isDarkTheme ? "0.3" : "0.2"}
          />
          <Stop
            offset="30%"
            stopColor={color}
            stopOpacity={isDarkTheme ? "0.3" : "0.2"}
          />
          <Stop offset="100%" stopColor={color} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <G>
        <Circle cx="50%" cy="50%" r="50%" fill="url(#glow)" />
      </G>
    </Svg>
  );
}

export default React.memo(Glow);
