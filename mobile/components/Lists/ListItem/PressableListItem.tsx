import React from "react";

import {
  Platform,
  PressableProps,
  ViewStyle,
  StyleProp,
  Pressable,
} from "react-native";

import {
  RectButton,
  LongPressGestureHandler,
  State,
} from "react-native-gesture-handler";

import { useTheme } from "~/theme";

export type PressableListItemProps = Omit<
  PressableProps,
  "hitSlop" | "onPress" | "style" | "onLongPress"
> & {
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

function PressableHighlight({
  style,
  ...props
}: PressableListItemProps): JSX.Element {
  const { colors } = useTheme();
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        style,
        {
          backgroundColor: pressed
            ? colors.listItemHighlightUnderlay
            : colors.listItemBackground,
        },
      ]}
    />
  );
}
function PressableRipple({
  disabled,
  onLongPress,
  delayLongPress,
  ...props
}: PressableListItemProps): JSX.Element {
  const { colors } = useTheme();
  const enabled = disabled !== true;

  return (
    <LongPressGestureHandler
      onHandlerStateChange={(e) => {
        if (e.nativeEvent.state === State.ACTIVE) {
          onLongPress && onLongPress();
        }
      }}
      minDurationMs={delayLongPress ?? undefined}
    >
      <RectButton
        enabled={enabled}
        rippleColor={colors.listItemRipple}
        {...props}
      />
    </LongPressGestureHandler>
  );
}

function PressableListItem(props: PressableListItemProps): JSX.Element {
  const { children, ...rest } = props;

  const PressableComponent = Platform.select<
    React.ComponentType<PressableListItemProps>
  >({
    android: PressableRipple,
    default: PressableHighlight,
  });

  return <PressableComponent {...rest}>{children}</PressableComponent>;
}

export default PressableListItem;
