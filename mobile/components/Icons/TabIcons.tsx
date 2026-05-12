import * as React from "react";

import { Svg, SvgProps, Path, G, Color } from "react-native-svg";

interface IconProps extends SvgProps {
  color: Color;
}

export const HomeTabIcon = (props: IconProps): JSX.Element => {
  const { color, ...rest } = props;
  return (
    <Svg width={22} height={20} viewBox="0 0 22 20" fill="none" {...rest}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.889 8l6.001-6.001L16.891 8h-.001v10h-12V8h-.001zM2.89 9.999l-1.477 1.476L0 10.063 9.477.585c.78-.78 2.046-.78 2.826 0l9.477 9.477-1.413 1.414-1.477-1.477V18a2 2 0 01-2 2h-12a2 2 0 01-2-2V9.999z"
        fill={color}
      />
    </Svg>
  );
};

export const ScheduleTabIcon = (props: IconProps): JSX.Element => {
  const { color, ...rest } = props;
  return (
    <Svg width={24} height={23} viewBox="0 0 24 23" fill="none" {...rest}>
      <G fill={color}>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.034 23C5.674 23 .52 17.851.52 11.5S5.674 0 12.034 0 23.55 5.149 23.55 11.5 18.394 23 12.034 23zm9.87-11.5c0-5.443-4.419-9.856-9.87-9.856s-9.87 4.413-9.87 9.857c0 5.444 4.419 9.857 9.87 9.857s9.87-4.413 9.87-9.857z"
        />
        <Path d="M16.915 13.67a.626.626 0 01-.871.242l-.002-.002-3.723-2.226a.661.661 0 01-.316-.57H12V6.66c0-.365.285-.66.637-.66.352 0 .637.295.637.66v4.072l3.407 2.037c.305.182.41.585.234.901z" />
      </G>
    </Svg>
  );
};
export const SettingsTabIcon = (props: IconProps): JSX.Element => {
  const { color, ...rest } = props;
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none" {...rest}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 15a4 4 0 110-8 4 4 0 010 8zm2-4a2 2 0 11-4 0 2 2 0 014 0z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.656 19.897l2.217-2.217-.78-2.837.34-.813L22 12.582V9.446l-2.56-1.454-.335-.811.791-2.839-2.219-2.215-2.837.78-.81-.34L12.58 0H9.446L7.991 2.56l-.811.334-2.838-.791-2.215 2.215.78 2.838-.34.81L0 9.416v3.134l2.558 1.458.335.811-.791 2.838 2.216 2.216 2.838-.78.81.34 1.45 2.566h3.134l1.457-2.558.811-.334 2.838.79zm.197-7.271l-.872 2.082.655 2.38-.568.569-2.376-.662-2.083.86-1.222 2.144h-.804L9.37 17.853l-2.08-.872-2.382.655-.567-.567.662-2.376-.86-2.083L2 11.388v-.805l2.147-1.212.872-2.08-.655-2.382.566-.566 2.376.663 2.084-.86L10.61 2h.803l1.211 2.147 2.08.872 2.383-.655.569.568-.662 2.375.86 2.084L20 10.61v.803l-2.147 1.212z"
        fill={color}
      />
    </Svg>
  );
};
