import React, { PropsWithChildren } from "react";

import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from "react-native-keyboard-aware-scroll-view";

import {
  SafeAreaView,
  NativeSafeAreaViewProps,
} from "react-native-safe-area-context";

import Background, { BackgroundProps } from "~/components/Background";
import Box, { BoxProps } from "~/components/Box";

type ScreenProps = BoxProps &
  Pick<NativeSafeAreaViewProps, "edges"> & {
    scrollViewProps?: KeyboardAwareScrollViewProps;
  } & { backgroundProps?: BackgroundProps };

type ListScreenProps = BoxProps &
  Pick<NativeSafeAreaViewProps, "edges"> & {
    backgroundProps?: BackgroundProps;
  };

// If we try to use a List within the <Screen/> component below, we get this warning:
// "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead."
// So this component is pretty much the same as below, but without the scroll view inside it
export const ListScreen = ({
  children,
  edges,
  backgroundProps,
  ...props
}: PropsWithChildren<ListScreenProps>): JSX.Element => {
  return (
    <Background {...backgroundProps}>
      <SafeAreaView
        style={
          // eslint-disable-next-line react-native/no-inline-styles
          { flex: 1 }
        }
        edges={edges}
      >
        <Box flexGrow={1} paddingHorizontal="l" {...props}>
          {children}
        </Box>
      </SafeAreaView>
    </Background>
  );
};

export default function Screen({
  children,
  edges,
  scrollViewProps,
  backgroundProps,
  ...props
}: PropsWithChildren<ScreenProps>): JSX.Element {
  return (
    <Background {...backgroundProps}>
      <SafeAreaView
        style={
          // eslint-disable-next-line react-native/no-inline-styles
          { flex: 1 }
        }
        edges={edges}
      >
        <KeyboardAwareScrollView
          alwaysBounceVertical={false}
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{
            flexGrow: 1,
          }}
          contentInsetAdjustmentBehavior={"automatic"}
          extraHeight={120}
          {...scrollViewProps}
        >
          <Box flexGrow={1} paddingHorizontal="l" {...props}>
            {children}
          </Box>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </Background>
  );
}

type WithScreenProps = Record<string, unknown>;

// It wants us to use `Record<string, unknown> instead of `object`, but this causes errors when wrapping screen components in navigators.
// eslint-disable-next-line @typescript-eslint/ban-types
export const withScreen = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
  const ComponentWithScreen = (props: P & WithScreenProps): JSX.Element => {
    const { ...rest } = props;
    return (
      <Screen>
        <WrappedComponent {...(rest as P)} />
      </Screen>
    );
  };

  return ComponentWithScreen;
};
