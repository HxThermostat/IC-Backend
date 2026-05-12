import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";

import Animated, { Extrapolate, interpolate } from "react-native-reanimated";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  BottomSheetBackdropProps,
  BottomSheetBackgroundProps,
  BottomSheetHandleProps,
  BottomSheetModal as RNBottomSheetModal,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";

import Box from "~/components/Box";

import { useTheme } from "~/theme";
import { useBackHandler } from "~/hooks";

export type BottomSheetModalMethods = RNBottomSheetModal;
export type BottomSheetModalRef = React.MutableRefObject<BottomSheetModalMethods>;

const MAX_WIDTH = 540;

type BottomSheetModalPropsWithChildren = React.ComponentProps<
  typeof RNBottomSheetModal
> & {
  children: React.ReactNode | React.ReactNode[];
  backdrop?: boolean;
};

const CustomBackdrop = ({
  animatedIndex,
  style,
}: BottomSheetBackdropProps): JSX.Element => {
  const { dismissAll } = useBottomSheetModal();
  const { colors } = useTheme();

  const animatedOpacity = useMemo(
    () =>
      interpolate(animatedIndex, {
        inputRange: [0, 1],
        outputRange: [0, 0.2],
        extrapolate: Extrapolate.CLAMP,
      }),
    [animatedIndex]
  );

  const containerStyle = useMemo(
    () => [
      style,
      StyleSheet.absoluteFill,
      {
        backgroundColor: colors.bottomSheetBackdrop,
        opacity: animatedOpacity,
      },
    ],
    [style, animatedOpacity, colors.bottomSheetBackdrop]
  );

  return (
    <Animated.View style={containerStyle}>
      <TouchableWithoutFeedback onPress={dismissAll}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

const BottomSheetModal = React.forwardRef<
  RNBottomSheetModal,
  BottomSheetModalPropsWithChildren
>(
  (props: BottomSheetModalPropsWithChildren, ref): JSX.Element => {
    const { children, backdrop, ...rest } = props;

    const { top } = useSafeAreaInsets();

    // Center modal with a maxWidth
    const { width } = useWindowDimensions();
    const marginHorizontal = Math.max((width - MAX_WIDTH) / 2, 0);

    const renderBackground = useCallback(
      (props: BottomSheetBackgroundProps) => {
        return (
          <Box
            backgroundColor="bottomSheetBackground"
            borderTopStartRadius={10}
            borderTopEndRadius={10}
            {...props}
          />
        );
      },
      []
    );

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => {
        if (!backdrop) return null;

        return <CustomBackdrop {...props} />;
      },
      [backdrop]
    );

    const renderHandle = useCallback((props: BottomSheetHandleProps) => {
      const window = Dimensions.get("window");
      const width = (10 * Math.min(window.width, window.height)) / 100;

      return (
        <Box
          backgroundColor="bottomSheetHandle"
          marginTop="s"
          marginBottom="m"
          alignSelf="center"
          width={width}
          height={6}
          borderRadius={4}
          {...props}
        />
      );
    }, []);

    const { dismissAll } = useBottomSheetModal();
    const [isOpen, setIsOpen] = useState(false);
    const onChange = useCallback((index: number) => setIsOpen(index > -1), []);

    useBackHandler(
      useCallback((): boolean => {
        if (isOpen) {
          dismissAll();
        }
        return isOpen;
      }, [isOpen, dismissAll])
    );

    return (
      <RNBottomSheetModal
        backgroundComponent={renderBackground}
        backdropComponent={renderBackdrop}
        handleComponent={renderHandle}
        ref={ref}
        topInset={top}
        onChange={onChange}
        style={{ marginHorizontal }}
        {...rest}
      >
        {children}
      </RNBottomSheetModal>
    );
  }
);

BottomSheetModal.displayName = "BottomSheetModal";
export default BottomSheetModal;

export const useModalRef = (): React.RefObject<BottomSheetModalMethods> =>
  useRef<BottomSheetModalMethods>(null);
