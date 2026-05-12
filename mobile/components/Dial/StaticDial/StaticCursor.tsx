import React, { memo, useRef, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from "react-native-gesture-handler";

import { useTheme } from "~/theme";

import { ROTATION_RAD, ARC_RAD, CURSOR_WIDTH } from "./constants";

import { Row } from "~/components/Box";
import Text from "~/components/Text";

import useStaticDial from "./useStaticDial";
import { lerp, toCanvas, interpolateColor, toCartesian } from "~/utils/math";
import {
  displayableDecimalValueOfNumber,
  displayValueWithoutDecimal,
  hasDecimalPlace,
} from "~/utils/display";

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -CURSOR_WIDTH / 2,
    marginTop: -CURSOR_WIDTH / 2,
    width: CURSOR_WIDTH,
    height: CURSOR_WIDTH,
  },
  containerActive: {
    zIndex: 1,
  },
  cursor: {
    overflow: "hidden",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    width: CURSOR_WIDTH,
    height: CURSOR_WIDTH,
    borderRadius: CURSOR_WIDTH / 2,
  },
  cursorInactiveBorder: {
    borderWidth: 1,
  },
});

interface CursorProps {
  active?: boolean;
  colors: [string, string];
  horizontalGradient?: boolean;
  offset: number;
  value?: string | number;
  onTap?: () => void;
  onDrag: (theta: number, ended: boolean) => void;
}

function Cursor({
  active,
  colors: [start, stop],
  horizontalGradient,
  offset,
  value,
  onTap,
  onDrag,
}: CursorProps): JSX.Element {
  const {
    dimensions: { cx, cy, r },
  } = useStaticDial();

  const { colors } = useTheme();

  const theta = lerp(-ROTATION_RAD, ARC_RAD - ROTATION_RAD, offset);

  const [translateX, translateY] = toCanvas({ r, theta }, [cx, cy]);

  // Handle Tap Gesture
  const tapRef = React.createRef<TapGestureHandler>();
  const handleTapGestureEvent = useCallback(
    (e: TapGestureHandlerGestureEvent) => {
      if (e.nativeEvent.state === State.BEGAN && onTap) {
        onTap();
      }
    },
    [onTap]
  );

  // Handle Pan Gesture
  const panRef = React.createRef<PanGestureHandler>();
  const panStartPosRef = useRef({ x: translateX, y: translateY });
  const handlePanGestureEvent = useCallback(
    (e: PanGestureHandlerGestureEvent) => {
      const {
        nativeEvent: { state, translationX, translationY },
      } = e;

      // Ignore error events
      if (
        state !== State.ACTIVE &&
        state !== State.BEGAN &&
        state !== State.END
      ) {
        return;
      }

      // Use the start position of the detected pan gesture
      const panStartPos = panStartPosRef.current;
      if (state === State.BEGAN) {
        panStartPos.x = translateX;
        panStartPos.y = translateY;
      }

      const panPosX = panStartPos.x + translationX;
      const panPosY = panStartPos.y + translationY;

      const [x, y] = toCartesian([panPosX, panPosY], [cx, cy]);
      const theta = Math.atan2(y, x);

      onDrag(theta, state === State.END);
    },
    [cx, cy, onDrag, translateX, translateY]
  );

  const translate = horizontalGradient ? translateX : translateY;
  return (
    <PanGestureHandler
      ref={panRef}
      enabled={active}
      waitFor={onTap ? tapRef : undefined}
      onGestureEvent={handlePanGestureEvent}
      onHandlerStateChange={handlePanGestureEvent}
      shouldCancelWhenOutside={false}
      maxPointers={1}
    >
      <TapGestureHandler
        ref={tapRef}
        onHandlerStateChange={handleTapGestureEvent}
      >
        <View
          style={[
            styles.container,
            { top: translateY, left: translateX },
            active ? styles.containerActive : null,
          ]}
        >
          <View
            style={[
              styles.cursor,
              {
                backgroundColor: colors.dialCursorBackgroundColor,
                borderColor: active
                  ? interpolateColor(start, stop, translate / (2 * r))
                  : colors.dialInactive,
              },
              active ? null : styles.cursorInactiveBorder,
            ]}
          >
            {value != null && (
              <Row>
                <Text
                  variant="dialCursorInteger"
                  fontVariant="tabular-nums"
                  maxFontSizeMultiplier={1.5}
                >
                  {displayValueWithoutDecimal(value)}
                </Text>
                {hasDecimalPlace(value) && (
                  <Text
                    variant="dialCursorFraction"
                    fontVariant="tabular-nums"
                    maxFontSizeMultiplier={1.5}
                  >
                    {displayableDecimalValueOfNumber(value)}
                  </Text>
                )}
              </Row>
            )}
          </View>
        </View>
      </TapGestureHandler>
    </PanGestureHandler>
  );
}

export default memo(Cursor);
