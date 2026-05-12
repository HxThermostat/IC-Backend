import React from "react";
import { StyleSheet } from "react-native";

import Box, { Row } from "~/components/Box";
import LinearGradient, {
  LinearGradientProps,
} from "~/components/LinearGradient";
import Text from "~/components/Text";
import { StepperButton } from "~/components/Touchables";

import { degreesSymbol } from "~/utils/display";

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 10,
  },
});

interface AdjustTemperatureBlockProps {
  currentTemperature: number | string;
  onIncreasePress: () => void;
  onDecreasePress: () => void;
}

interface AdjustTemperatureGradientBlockProps
  extends AdjustTemperatureBlockProps {
  label: string;
  type: "heat" | "cool";
}
export const AdjustTemperatureGradientBlock = (
  props: AdjustTemperatureGradientBlockProps
): JSX.Element => {
  const {
    currentTemperature,
    onIncreasePress,
    onDecreasePress,
    label,
    type,
  } = props;

  const gradient: Pick<LinearGradientProps, "colors"> =
    type === "heat"
      ? {
          colors: [
            "temperaturePresetStepperHeatGradientStart",
            "temperaturePresetStepperHeatGradientEnd",
          ],
        }
      : {
          colors: [
            "temperaturePresetStepperCoolGradientStart",
            "temperaturePresetStepperCoolGradientEnd",
          ],
        };
  return (
    <Box marginBottom="l">
      <LinearGradient
        {...gradient}
        locations={[0.1, 0.99]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Box paddingHorizontal="s" paddingVertical="xxl">
          <Box position="absolute" left={0} right={0} top={16}>
            <Text variant="bodyStrong" color="textOnColor" textAlign="center">
              {label}
            </Text>
          </Box>
          <Row
            justifyContent="space-between"
            alignItems="center"
            paddingHorizontal="m"
          >
            <StepperButton
              onPress={onDecreasePress}
              direction="down"
              variant="gradient"
            />
            <Text
              color="textOnColor"
              variant="adjustBlockLabel"
              fontVariant="tabular-nums"
            >
              {currentTemperature}
            </Text>
            <StepperButton
              direction="up"
              onPress={onIncreasePress}
              variant="gradient"
            />
          </Row>
        </Box>
      </LinearGradient>
    </Box>
  );
};

const AdjustTemperatureBlock = (
  props: AdjustTemperatureBlockProps
): JSX.Element => {
  const { currentTemperature, onIncreasePress, onDecreasePress } = props;
  return (
    <Row
      alignItems="center"
      justifyContent="space-between"
      marginTop={"xxl"}
      marginBottom="xl"
      paddingHorizontal="xxl"
    >
      <StepperButton onPress={onDecreasePress} direction="down" />
      <Text variant="adjustBlockLabel" fontVariant="tabular-nums">
        {currentTemperature}
        {degreesSymbol}
      </Text>
      <StepperButton direction="up" onPress={onIncreasePress} />
    </Row>
  );
};

export default AdjustTemperatureBlock;
