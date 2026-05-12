import React, {
  useEffect,
  useState,
  memo,
  useCallback,
  useRef,
  useMemo,
} from "react";

import MaskedView from "@react-native-community/masked-view";

import RNLinearGradient from "react-native-linear-gradient";

import { useDualRangeSafe } from "~/hooks";

import { EffectiveMode, RangeValue } from "~/graph";

import { useTheme } from "~/theme";

import { useControlledDialContext } from "~/contexts/ControlledDialContext";

import { makeToDisplay } from "~/utils/display";
import { hapticSelectionIOS } from "~/utils/haptics";
import { deriveNewValueFromDial } from "~/utils/math";

import { ARC_RAD, ARC_WIDTH, ROTATION_RAD } from "./constants";

import Cursor from "./StaticCursor";
import Ring from "./StaticRing";
import StaticDial from "./StaticDial";

import { useLocalSetpoint } from "./useLocalSetpoint";
import useStaticDial from "./useStaticDial";

interface StaticDialDualProps {
  lowerSetpoint: RangeValue;
  minInterval: number;
  onChange: (lower: number, upper: number) => void;
  upperSetpoint: RangeValue;
}

function StaticDialDual({
  lowerSetpoint,
  minInterval,
  onChange,
  upperSetpoint,
}: StaticDialDualProps): JSX.Element {
  const {
    awayActive,
    connectionStatus,
    mode,
    temperatureUnit,
    setpointMin,
    setpointMax,
  } = useControlledDialContext();
  const toDisplay = makeToDisplay(temperatureUnit);

  const { colors } = useTheme();

  const {
    dimensions: { dialSize },
    modeGradients,
  } = useStaticDial();
  const autoModeGradients = useMemo(
    (): [string, string] => [
      modeGradients["COOL"][1],
      modeGradients["HEAT"][0],
    ],
    [modeGradients]
  );

  const min = setpointMin;
  const max = setpointMax;

  const range = max - min;

  // We're going to keep the state of intermediate values inside the
  // component, but want to ensure that prop changes from external
  // updates can still be reflected here
  const [lower, setLowerDebounced] = useLocalSetpoint(lowerSetpoint.value);
  const [upper, setUpperDebounced] = useLocalSetpoint(upperSetpoint.value);

  // Apply some sanity checks to new values before comitting them
  const onValuesChange = useCallback(
    (newLower: number, newUpper: number, updateServer?: boolean) => {
      setUpperDebounced(newUpper);
      setLowerDebounced(newLower);
      if (updateServer) {
        onChange(newLower, newUpper);
      }
    },
    [onChange, setUpperDebounced, setLowerDebounced]
  );

  const {
    setDualRangeSafe: setSetpointSafe,
    increaseDualRangeSafe: increaseSetpointSafe,
    decreaseDualRangeSafe: decreaseSetpointSafe,
  } = useDualRangeSafe(
    lower,
    upper,
    lowerSetpoint,
    upperSetpoint,
    minInterval,
    onValuesChange
  );

  // The active cursor can be changed by the user when then are more
  // than one, but also needs to be computed for single-cursor modes
  const [selectedCursor, setSelectedCursor] = useState<"lower" | "upper">();

  const deriveActive = useCallback((mode: EffectiveMode | undefined) => {
    switch (mode) {
      case "COOL":
        setSelectedCursor("upper");
        break;
      case "HEAT":
        setSelectedCursor("lower");
        break;
      case "HEATCOOL":
        setSelectedCursor((selectedCursor) => selectedCursor ?? "lower");
        break;
      case "OFF":
      case undefined:
        break;
      default:
    }
  }, []);

  useEffect(() => deriveActive(mode), [deriveActive, mode]);

  // Offset and highlight represent the proportional (in the range
  // [0,1]) values which determine the position + length of the color
  // band
  const offset = mode === "HEAT" ? 0 : 1 - (upper - min) / range;
  const highlight = mode === "COOL" ? 1 : 1 - (lower - min) / range;

  // Select the appropriate mode from the list
  let finalMode: EffectiveMode | "DISABLED" = mode ?? "DISABLED";
  if (connectionStatus === "OFFLINE") {
    finalMode = "OFF";
  }

  const tempDragRef = useRef({
    lower: lowerSetpoint.value,
    upper: upperSetpoint.value,
  });

  const onDrag = useCallback(
    (theta: number, cursor: "lower" | "upper", ended: boolean): void => {
      const dialMinMax = { min: setpointMin, max: setpointMax };
      const value = deriveNewValueFromDial({
        theta,
        arcRad: ARC_RAD,
        rotationRad: ROTATION_RAD,
        range:
          cursor === "lower"
            ? { ...lowerSetpoint, ...dialMinMax }
            : { ...upperSetpoint, ...dialMinMax },
      });

      if (
        (cursor === "lower" && tempDragRef?.current[cursor] !== value) ||
        (cursor === "upper" && tempDragRef?.current[cursor] !== value)
      ) {
        void hapticSelectionIOS();
      }

      if (cursor !== selectedCursor) {
        setSelectedCursor(cursor);
      } else {
        setSetpointSafe(cursor, value, ended);
      }
      tempDragRef.current[cursor] = value;
    },
    [
      lowerSetpoint,
      upperSetpoint,
      selectedCursor,
      setSetpointSafe,
      setpointMin,
      setpointMax,
    ]
  );
  const onDragUpper = useCallback(
    (theta: number, ended: boolean) => onDrag(theta, "upper", ended),
    [onDrag]
  );
  const onDragLower = useCallback(
    (theta: number, ended: boolean) => onDrag(theta, "lower", ended),
    [onDrag]
  );

  const onTap = useCallback(
    (cursor: "lower" | "upper") => {
      if (selectedCursor !== cursor) {
        setSelectedCursor(cursor);
      }
    },
    [selectedCursor, setSelectedCursor]
  );
  const onTapUpper = useCallback(() => onTap("upper"), [onTap]);
  const onTapLower = useCallback(() => onTap("lower"), [onTap]);

  const onDecreasePress = useCallback(() => {
    if (selectedCursor) {
      decreaseSetpointSafe(selectedCursor);
      void hapticSelectionIOS();
    }
  }, [selectedCursor, decreaseSetpointSafe]);
  const onIncreasePress = useCallback(() => {
    if (selectedCursor) {
      increaseSetpointSafe(selectedCursor);
      void hapticSelectionIOS();
    }
  }, [selectedCursor, increaseSetpointSafe]);

  return (
    <StaticDial
      disabled={awayActive || connectionStatus === "OFFLINE" || mode === "OFF"}
      trackColor={
        connectionStatus === "OFFLINE"
          ? colors.dialRingColorOffline
          : mode === "OFF"
          ? colors.dialRingColorOff
          : colors.dialRingColor
      }
      onIncreasePress={onIncreasePress}
      onDecreasePress={onDecreasePress}
    >
      {finalMode !== "OFF" && finalMode !== "DISABLED" && (
        <MaskedView
          maskElement={
            <Ring
              startAngle={ARC_RAD * offset}
              endAngle={ARC_RAD * highlight}
              stroke="white"
              strokeWidth={ARC_WIDTH}
            />
          }
        >
          <RNLinearGradient
            colors={
              finalMode === "HEATCOOL"
                ? autoModeGradients
                : modeGradients[finalMode]
            }
            useAngle={finalMode === "HEATCOOL"}
            angle={90}
            style={{
              width: dialSize,
              height: dialSize,
            }}
          />
        </MaskedView>
      )}

      {finalMode !== "HEAT" && finalMode !== "OFF" && (
        <Cursor
          colors={
            finalMode === "HEATCOOL"
              ? autoModeGradients
              : modeGradients[finalMode]
          }
          horizontalGradient={finalMode === "HEATCOOL"}
          offset={offset}
          value={toDisplay(upper)}
          active={!awayActive && selectedCursor === "upper"}
          onTap={onTapUpper}
          onDrag={onDragUpper}
        />
      )}
      {finalMode !== "COOL" && finalMode !== "OFF" && (
        <Cursor
          colors={
            finalMode === "HEATCOOL"
              ? autoModeGradients
              : modeGradients[finalMode]
          }
          horizontalGradient={finalMode === "HEATCOOL"}
          offset={highlight}
          value={toDisplay(lower)}
          active={!awayActive && selectedCursor === "lower"}
          onTap={onTapLower}
          onDrag={onDragLower}
        />
      )}
    </StaticDial>
  );
}

export default memo(StaticDialDual);
