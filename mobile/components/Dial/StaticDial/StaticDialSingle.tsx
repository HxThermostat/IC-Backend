import React, { memo, useCallback, useRef } from "react";
import { StyleSheet } from "react-native";

import MaskedView from "@react-native-community/masked-view";

import RNLinearGradient from "react-native-linear-gradient";

import { useRangeSafe } from "~/hooks";

import { EffectiveMode, RangeValue } from "~/graph";

import { useControlledDialContext } from "~/contexts/ControlledDialContext";

import { toDisplay } from "~/utils/display";
import { hapticSelectionIOS } from "~/utils/haptics";
import { deriveNewValueFromDial, equal } from "~/utils/math";

import { useTheme } from "~/theme";

import { ARC_RAD, ARC_WIDTH, ROTATION_RAD } from "./constants";

import Cursor from "./StaticCursor";
import Ring from "./StaticRing";
import StaticDial from "./StaticDial";
import { useLocalSetpoint } from "./useLocalSetpoint";
import useStaticDial from "./useStaticDial";

interface StaticDialSingleProps {
  onChange: (target: number) => void;
  targetSetpoint: RangeValue;
}

function StaticDialSingle({
  onChange,
  targetSetpoint,
}: StaticDialSingleProps): JSX.Element {
  const {
    mode,
    awayActive,
    connectionStatus,
    temperatureUnit,
    setpointMin,
    setpointMax,
  } = useControlledDialContext();

  const { colors } = useTheme();

  const {
    dimensions: { dialSize },
    modeGradients,
  } = useStaticDial();

  const range = setpointMax - setpointMin;

  // We're going to keep the state of intermediate values inside the
  // component, but want to ensure that prop changes from external
  // updates can still be reflected here
  const [target, setTargetDebounced] = useLocalSetpoint(targetSetpoint.value);

  // Apply some sanity checks to new values before comitting them
  const onValueChange = useCallback(
    (newTarget: number, updateServer?: boolean) => {
      setTargetDebounced(newTarget);
      if (updateServer) {
        onChange(newTarget);
      }
    },
    [onChange, setTargetDebounced]
  );

  const {
    setValueSafe: setSetpointSafe,
    increaseValueSafe: increaseSetpointSafe,
    decreaseValueSafe: decreaseSetpointSafe,
  } = useRangeSafe(target, targetSetpoint, onValueChange);

  // Offset and highlight represent the proportional (in the range
  // [0,1]) values which determine the position + length of the color
  // band
  const offset = 1 - (target - setpointMin) / range;

  // Select the appropriate gradient from the list
  let finalMode: EffectiveMode | "DISABLED" = mode ?? "DISABLED";
  if (connectionStatus === "OFFLINE") {
    finalMode = "OFF";
  }

  const tempDragRef = useRef(targetSetpoint.value);

  const onDrag = useCallback(
    (theta: number, ended: boolean): void => {
      const value = deriveNewValueFromDial({
        theta,
        arcRad: ARC_RAD,
        rotationRad: ROTATION_RAD,
        range: { ...targetSetpoint, min: setpointMin, max: setpointMax },
      });

      if (!equal(tempDragRef?.current, value)) {
        void hapticSelectionIOS();
      }

      setSetpointSafe(value, ended);
      tempDragRef.current = value;
    },
    [setSetpointSafe, targetSetpoint, setpointMin, setpointMax]
  );

  const onDecreasePress = useCallback(() => {
    decreaseSetpointSafe();
    void hapticSelectionIOS();
  }, [decreaseSetpointSafe]);
  const onIncreasePress = useCallback(() => {
    increaseSetpointSafe();
    void hapticSelectionIOS();
  }, [increaseSetpointSafe]);

  return (
    <StaticDial
      disabled={awayActive || connectionStatus === "OFFLINE" || mode === "OFF"}
      onDecreasePress={onDecreasePress}
      onIncreasePress={onIncreasePress}
      trackColor={
        connectionStatus === "OFFLINE"
          ? colors.dialRingColorOffline
          : mode === "OFF"
          ? colors.dialRingColorOff
          : colors.dialRingColor
      }
    >
      {(finalMode === "HEAT" || finalMode === "HEATCOOL") && (
        <MaskedView
          style={StyleSheet.absoluteFillObject}
          maskElement={
            <Ring
              startAngle={ARC_RAD * 0}
              endAngle={ARC_RAD * offset}
              stroke="white"
              strokeWidth={ARC_WIDTH}
            />
          }
        >
          <RNLinearGradient
            colors={modeGradients["HEAT"]}
            style={{ width: dialSize, height: dialSize }}
          />
        </MaskedView>
      )}
      {(mode === "COOL" || mode === "HEATCOOL") && (
        <MaskedView
          style={StyleSheet.absoluteFillObject}
          maskElement={
            <Ring
              startAngle={ARC_RAD * offset}
              endAngle={ARC_RAD * 1}
              stroke="white"
              strokeWidth={ARC_WIDTH}
            />
          }
        >
          <RNLinearGradient
            colors={modeGradients["COOL"]}
            style={{ width: dialSize, height: dialSize }}
          />
        </MaskedView>
      )}
      {finalMode !== "OFF" && (
        <Cursor
          colors={
            finalMode === "HEATCOOL"
              ? modeGradients["COOL"]
              : modeGradients[finalMode]
          }
          offset={offset}
          value={toDisplay(temperatureUnit, target)}
          active={!awayActive}
          onDrag={onDrag}
        />
      )}
    </StaticDial>
  );
}

export default memo(StaticDialSingle);
