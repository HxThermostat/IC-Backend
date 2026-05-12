import React, { memo } from "react";
import { Platform, StyleSheet } from "react-native";

import { Svg, Path, Circle } from "react-native-svg";
import Androw from "react-native-androw";

import { toCanvas, normalizeTheta } from "~/utils/math";

import { ROTATION } from "./constants";
import useStaticDial from "./useStaticDial";

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000000",
    ...Platform.select({
      android: {
        shadowOffset: { height: 3, width: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      default: {
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
    }),
  },
});

interface RingProps {
  startAngle: number;
  endAngle: number;
  stroke: string;
  strokeWidth: number;
  shadow?: boolean;
}

function Ring({
  startAngle,
  endAngle,
  stroke,
  strokeWidth,
  shadow = false,
}: RingProps): JSX.Element {
  const {
    dimensions: { r, cx, cy, dialSize: size },
  } = useStaticDial();

  const [x0, y0] = toCanvas({ r, theta: startAngle }, [cx, cy]);
  const [x1, y1] = toCanvas({ r, theta: endAngle }, [cx, cy]);

  let pathD = "";
  if (startAngle !== endAngle) {
    const largeArcFlag: 1 | 0 =
      normalizeTheta(endAngle) - normalizeTheta(startAngle) >= Math.PI ? 1 : 0;
    pathD = `M ${x0} ${y0} A ${r} ${r} 0 ${largeArcFlag} 0 ${x1} ${y1}`;
  }

  const transform = `rotate(${ROTATION} ${size / 2} ${size / 2})`;

  const svg = (
    <Svg
      width={size}
      height={size}
      style={shadow ? null : StyleSheet.absoluteFill}
    >
      <Circle
        cx={x0}
        cy={y0}
        r={strokeWidth / 2}
        fill={stroke}
        transform={transform}
      />
      <Path
        d={pathD}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={"butt"}
        transform={transform}
      />
      <Circle
        cx={x1}
        cy={y1}
        r={strokeWidth / 2}
        fill={stroke}
        transform={transform}
      />
    </Svg>
  );

  return shadow ? (
    <Androw style={[StyleSheet.absoluteFill, styles.shadow]}>{svg}</Androw>
  ) : (
    svg
  );
}

export default memo(Ring);
