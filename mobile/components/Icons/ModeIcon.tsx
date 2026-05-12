import React from "react";
import { ViewStyle } from "react-native";

import {
  Svg,
  SvgProps,
  Path,
  G,
  Defs,
  ClipPath,
  Color,
} from "react-native-svg";

import { EffectiveMode } from "~/graph";

import { useTheme } from "~/theme";

interface ModeIconProps {
  mode: EffectiveMode;
  size: number;
}
interface IconProps {
  color: Color;
}
export const HeatIcon = (props: SvgProps & IconProps): JSX.Element => {
  const { color, ...rest } = props;
  return (
    <Svg width={21} height={21} viewBox="0 0 21 21" fill="none" {...rest}>
      <Path
        d="M18.453 11.443L21 10.5l-2.547-.943c-.911-.337-1.148-1.223-.528-1.97l1.736-2.09-2.679.46c-.956.165-1.605-.483-1.44-1.44l.46-2.678-2.09 1.735c-.747.62-1.633.383-1.97-.527L11 .5l-.942 2.547c-.337.91-1.224 1.148-1.97.528l-2.09-1.736.46 2.679c.165.957-.483 1.604-1.44 1.44L2.34 5.497l1.735 2.09c.62.747.382 1.633-.528 1.97L1 10.499l2.547.943c.91.337 1.148 1.223.528 1.97l-1.736 2.09 2.679-.46c.956-.165 1.604.483 1.44 1.44l-.46 2.679 2.09-1.736c.746-.62 1.633-.383 1.97.527l.941 2.548.943-2.547c.337-.91 1.223-1.148 1.97-.528l2.09 1.735-.461-2.678c-.165-.957.483-1.604 1.44-1.44l2.679.461-1.736-2.09c-.62-.747-.382-1.633.529-1.97zM11 15.795a5.295 5.295 0 110-10.59 5.295 5.295 0 010 10.59z"
        stroke={color}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const PowerIcon = (props: SvgProps & IconProps): JSX.Element => {
  const { color, ...rest } = props;
  return (
    <Svg width={20} height={21} viewBox="0 0 20 21" fill="none" {...rest}>
      <G clipPath="url(#prefix__clip0)" fill={color}>
        <Path d="M4.526 4.39a.725.725 0 10-.95-1.094 9.802 9.802 0 1012.788-.052.724.724 0 10-.941 1.102 8.347 8.347 0 012.93 6.353c0 4.606-3.748 8.352-8.353 8.352-4.605 0-8.352-3.746-8.352-8.353A8.353 8.353 0 014.526 4.39z" />
        <Path d="M10.725 11.38V1.222a.725.725 0 10-1.45 0v10.156a.725.725 0 001.45 0z" />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0">
          <Path fill="#fff" transform="translate(0 .5)" d="M0 0h20v20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export const CoolIcon = (props: SvgProps & IconProps): JSX.Element => {
  const { color, ...rest } = props;
  return (
    <Svg width={19} height={20} viewBox="0 0 19 20" fill="none" {...rest}>
      <Path
        d="M18.45 11.44a.566.566 0 01-.4.694l-2.553.684 2.444 1.408a.567.567 0 11-.566.98l-2.44-1.408.685 2.555a.565.565 0 11-1.093.293L13.551 13l-3.496-2.019v4.036l2.67 2.67a.567.567 0 11-.8.8l-1.87-1.869v2.817a.566.566 0 11-1.133 0v-2.817l-1.87 1.874a.567.567 0 11-.8-.801l2.67-2.67v-4.04L5.426 13l-.976 3.645a.566.566 0 11-1.093-.293l.684-2.555-2.44 1.41a.565.565 0 11-.565-.98l2.44-1.408-2.554-.684a.568.568 0 11.292-1.097l3.652.98L8.356 10l-3.49-2.018-3.652.98A.566.566 0 11.922 7.87l2.553-.684-2.44-1.411a.566.566 0 01.567-.98l2.44 1.408-.686-2.555a.566.566 0 111.093-.293L5.426 7 8.922 9.02V4.984l-2.67-2.67a.567.567 0 01.8-.805l1.87 1.874V.566a.566.566 0 111.133 0v2.817l1.87-1.874a.566.566 0 01.8.801l-2.67 2.674V9.02L13.55 7l.976-3.646a.566.566 0 111.093.293l-.684 2.555 2.44-1.41a.566.566 0 01.565.98l-2.44 1.41 2.554.684a.566.566 0 11-.292 1.093l-3.652-.977L10.621 10l3.49 2.018 3.652-.98a.566.566 0 01.688.403z"
        fill={color}
      />
    </Svg>
  );
};

interface HeatCoolIconProps {
  colorCool: Color;
  colorHeat: Color;
}
export const HeatCoolIcon = (
  props: SvgProps & HeatCoolIconProps
): JSX.Element => {
  const { colorCool, colorHeat, ...rest } = props;
  return (
    <Svg width={21} height={22} viewBox="0 0 21 22" fill="none" {...rest}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 1.324v19.352a.566.566 0 01-1.078-.242v-2.817l-1.87 1.874a.567.567 0 11-.8-.801l2.67-2.67v-4.04L5.426 14l-.976 3.645a.566.566 0 11-1.093-.293l.684-2.555-2.44 1.41a.565.565 0 11-.565-.98l2.44-1.408-2.554-.684a.568.568 0 11.292-1.097l3.652.98L8.356 11l-3.49-2.018-3.652.98A.566.566 0 11.922 8.87l2.553-.684-2.44-1.411a.566.566 0 01.567-.98l2.44 1.408-.686-2.555a.566.566 0 111.093-.293L5.426 8l3.496 2.019V5.984l-2.67-2.67a.567.567 0 11.8-.805l1.87 1.874V1.566A.566.566 0 0110 1.324z"
        fill={colorCool}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 21.024a.5.5 0 00.468-.326l.898-2.425c.115-.31.296-.446.451-.488.155-.041.38-.015.635.197l1.99 1.652a.5.5 0 00.811-.47l-.438-2.549c-.056-.327.033-.534.146-.647.112-.113.32-.202.647-.146l2.55.439a.5.5 0 00.47-.812l-1.652-1.99c-.212-.255-.239-.48-.197-.635.041-.155.177-.336.488-.452l2.425-.896a.5.5 0 000-.938l-2.425-.898c-.311-.115-.447-.297-.488-.451-.041-.155-.015-.38.197-.635l1.652-1.99a.5.5 0 00-.469-.812l-2.55.438c-.327.057-.535-.033-.648-.146-.112-.112-.202-.32-.146-.647l.439-2.55a.5.5 0 00-.812-.47l-1.99 1.653c-.255.212-.48.238-.635.197-.154-.041-.336-.177-.451-.487l-.897-2.426A.5.5 0 0011 .988v1.941l.428 1.158c.205.555.606.966 1.13 1.106.526.14 1.078-.015 1.533-.394l.948-.787-.21 1.216c-.1.584.041 1.14.426 1.524.384.384.94.524 1.524.424l-.068-.391.068.391 1.215-.21-.787.949c-.379.456-.535 1.007-.394 1.532.14.525.552.926 1.107 1.131l1.157.429-1.157.427c-.556.206-.966.606-1.107 1.131-.14.525.015 1.077.393 1.533l.787.948-1.215-.21c-.584-.1-1.14.04-1.524.425-.384.384-.525.94-.425 1.524L15.04 18l-.948-.787c-.456-.378-1.008-.534-1.533-.393-.524.14-.925.55-1.13 1.106L11 19.082v1.942zm0-4.478a5.539 5.539 0 000-11.08v1a4.539 4.539 0 110 9.08v1z"
        fill={colorHeat}
      />
    </Svg>
  );
};

export const ModeIcon = ({ mode, size }: ModeIconProps): JSX.Element => {
  const { colors } = useTheme();

  const baseStyle: ViewStyle = {
    width: size,
    height: size,
  };

  switch (mode) {
    case "COOL":
      return (
        <CoolIcon
          color={colors.modeCool}
          height={baseStyle.height}
          width={baseStyle.width}
        />
      );
    case "HEAT":
      return (
        <HeatIcon
          color={colors.modeHeat}
          height={baseStyle.height}
          width={baseStyle.width}
        />
      );
    case "HEATCOOL":
      return (
        <HeatCoolIcon
          colorCool={colors.modeCool}
          colorHeat={colors.modeHeat}
          height={baseStyle.height}
          width={baseStyle.width}
        />
      );
    case "OFF":
    default:
      return (
        <PowerIcon
          color={colors.text}
          height={baseStyle.height}
          width={baseStyle.width}
        />
      );
  }
};
