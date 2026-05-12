import React, { useCallback, useState } from "react";
import {
  Platform,
  StyleSheet,
  StyleProp,
  TouchableOpacity as RNTouchableOpacity,
  TouchableOpacityProps,
  TouchableHighlightProps,
  TouchableWithoutFeedbackProps,
  TouchableNativeFeedbackProps,
  View,
  ViewStyle,
  GestureResponderEvent,
} from "react-native";

// Use the RNGH Touchable to ensure it place nicely when embedded in a
// Component that uses RNGH (e.g. the BottomSheet)
import { TouchableOpacity as RNGHTouchableOpacity } from "react-native-gesture-handler";

import ActivityIndicator, {
  ActivityIndicatorProps,
} from "~/components/ActivityIndicator";
import { BoxProps, withBoxProps } from "~/components/Box";
import { useIsCloaked } from "~/contexts";

const TouchableOpacity = Platform.select({
  android: RNGHTouchableOpacity,
  default: RNTouchableOpacity,
});

/**
 * Override Touchable to provide a single entry to easily adjust things like default font, color, accessibility options etc.
 */

const styles = StyleSheet.create({
  disabled: { opacity: 0.5 },
  loading: { opacity: 0 },
  loadingIndicator: {
    ...StyleSheet.absoluteFillObject,
  },
});

export interface TouchableProps
  extends TouchableOpacityProps,
    TouchableHighlightProps,
    TouchableWithoutFeedbackProps,
    TouchableNativeFeedbackProps,
    BoxProps {
  children: JSX.Element | JSX.Element[];
  contentContainerStyle?: StyleProp<ViewStyle>;
  disabledStyle?: StyleProp<ViewStyle>;
  loading?: boolean;
  onPress?:
    | (() => Promise<unknown>)
    | TouchableNativeFeedbackProps["onPress"]
    | (() => void);
  activityIndicatorProps?: ActivityIndicatorProps;
  shareAndroidContainerStyle?: boolean;
}

const Touchable = (props: TouchableProps): JSX.Element => {
  const {
    children,
    contentContainerStyle,
    disabled: isDisabled,
    disabledStyle,
    loading: loadingProp,
    onPress,
    style,
    activityIndicatorProps,
    shareAndroidContainerStyle,
    ...rest
  } = props;

  const hidden = useIsCloaked();

  const [loadingLocal, setLoadingLocal] = useState(false);

  const loading = loadingProp ?? loadingLocal;
  const disabled = isDisabled || loading;

  const handlePress = useCallback(
    async (event: GestureResponderEvent) => {
      if (onPress) {
        setLoadingLocal(true);
        await onPress(event);
        setLoadingLocal(false);
      }
    },
    [onPress]
  );

  return (
    <TouchableOpacity
      hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
      activeOpacity={0.6}
      disabled={hidden ? true : disabled}
      onPress={hidden ? noop : handlePress}
      {...rest}
      // Using RN Touchable, this would be style. It seems like the
      // RNGH Touchable behaves _slightly_ differently:
      // https://github.com/software-mansion/react-native-gesture-handler/pull/854
      // https://github.com/software-mansion/react-native-gesture-handler/issues/488#issuecomment-773626970
      containerStyle={Platform.select({
        android: [
          shareAndroidContainerStyle ? style : [],
          ...[disabled ? [styles.disabled, disabledStyle] : []],
        ],
      })}
      style={[style, ...[disabled ? [styles.disabled, disabledStyle] : []]]}
    >
      {loading == null && contentContainerStyle == null ? (
        children
      ) : (
        <View style={[loading ? styles.loading : null, contentContainerStyle]}>
          {children}
        </View>
      )}

      <ActivityIndicator
        animating={loading}
        hidesWhenStopped={true}
        size={"small"}
        style={styles.loadingIndicator}
        {...activityIndicatorProps}
      />
    </TouchableOpacity>
  );
};

export default withBoxProps(Touchable);
