import React, { ReactNode } from "react";
import { ViewStyle } from "react-native";

import LinearGradient, {
  LinearGradientProps,
} from "~/components/LinearGradient";

import { BackgroundColorProvider } from "~/contexts";

import { ThemeColor } from "~/theme";

export interface BackgroundProps {
  children?: ReactNode;
  containerStyle?: ViewStyle;
  colors?: [ThemeColor, ThemeColor];
  locations?: [number, number];
  start?: LinearGradientProps["start"];
  end?: LinearGradientProps["end"];
  testID?: string;
}

export default function Background({
  colors = ["backgroundGradientStart", "backgroundGradientEnd"],
  containerStyle,
  children,
  locations = [0.2, 1], // Pushing the start point down a bit makes it much easier to deal with the iOS headers
  testID,
  ...gradientProps
}: BackgroundProps): JSX.Element {
  return (
    <LinearGradient
      // eslint-disable-next-line react-native/no-inline-styles
      style={[{ flex: 1 }, containerStyle]}
      {...gradientProps}
      colors={
        containerStyle?.backgroundColor
          ? ["transparent", "transparent"]
          : colors
      }
      locations={locations}
      testID={testID}
    >
      <BackgroundColorProvider
        colors={
          containerStyle?.backgroundColor
            ? [containerStyle.backgroundColor as string]
            : colors
        }
        locations={locations}
        start={gradientProps.start}
        end={gradientProps.end}
      >
        {children}
      </BackgroundColorProvider>
    </LinearGradient>
  );
}

interface WithBackgroundProps {
  _backgroundContainerStyle?: BackgroundProps["containerStyle"];
}

// It wants us to use `Record<string, unknown> instead of `object`, but this causes errors when wrapping screen components in navigators.
// eslint-disable-next-line @typescript-eslint/ban-types
export const withBackground = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
  const ComponentWithBackground = (
    props: P & WithBackgroundProps
  ): JSX.Element => {
    const { _backgroundContainerStyle, ...rest } = props;
    return (
      <Background containerStyle={_backgroundContainerStyle}>
        <WrappedComponent {...(rest as P)} />
      </Background>
    );
  };

  return ComponentWithBackground;
};
