import React, { useMemo } from "react";

import { StyleSheet } from "react-native";

import Box, { Row } from "~/components/Box";
import Text from "~/components/Text";
import { ChevronIcon } from "~/components/Icons";
import LinearGradient from "~/components/LinearGradient";
import { Touchable } from "~/components/Touchables";

import {
  GoBack,
  useScheduleEventQuery,
  withQueryData,
  WithQueryDataProps,
} from "~/graph";

import { useScheduleLinearGradient } from "~/hooks";

import { setpointRange } from "~/utils/display";

import { useTheme } from "~/theme";

import { formatScheduleTime } from "./time";

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 10,
  },
  border: {
    borderWidth: 1,
  },
  disabled: {
    opacity: 1,
  },
});

type ScheduleCardProps = {
  disabled?: boolean;
  toDisplay?: (value: number) => number;
  onPress: () => void;
  useEmptyState?: boolean;
} & WithQueryDataProps<typeof useScheduleEventQuery>;

const ScheduleCard = ({
  disabled,
  onPress,
  toDisplay = identity,
  useEmptyState = false,
  data: { scheduleEvent },
}: ScheduleCardProps): JSX.Element => {
  if (!scheduleEvent) throw new GoBack();

  const { colors } = useTheme();

  const {
    start,
    end,
    temperaturePreset: { slot, name, setpoint },
  } = scheduleEvent;

  const gradientProps = useScheduleLinearGradient(
    useEmptyState ? "BLANK" : slot ?? "VIRTUAL"
  );

  const startTime = formatScheduleTime(start);
  const endTime = formatScheduleTime(end);
  const setpoints = setpointRange(setpoint, toDisplay);

  const fontColor = useEmptyState ? "text" : "textOnColor";

  return (
    <Box marginBottom="l">
      <LinearGradient
        {...gradientProps}
        style={[
          styles.gradient,
          useEmptyState ? [styles.border, { borderColor: colors.text }] : {},
        ]}
      >
        <Touchable
          paddingHorizontal="m"
          paddingVertical="s"
          onPress={onPress}
          disabled={disabled || useEmptyState}
          disabledStyle={styles.disabled}
        >
          <Row justifyContent="space-between" alignItems="center">
            <Text variant="cardTitle" color={fontColor}>
              {name}
            </Text>
            {useEmptyState ? null : <ChevronIcon size={26} color={fontColor} />}
          </Row>
          <Row marginBottom="xl">
            <Text variant="scheduleTimeMetadata" color={fontColor}>
              {`${startTime} - ${endTime}`}
            </Text>
          </Row>
          <Row>
            <Text color={fontColor}>{setpoints}</Text>
          </Row>
        </Touchable>
      </LinearGradient>
    </Box>
  );
};

export default withQueryData(useScheduleEventQuery, {
  options: { fetchPolicy: "cache-and-network" },
  useVariables: (_, queryId) =>
    useMemo(() => ({ scheduleEventId: queryId }), [queryId]),
})(ScheduleCard);
