import React, { useCallback, useMemo, useState } from "react";

import { RouteProp, useRoute } from "@react-navigation/native";
import { SettingsNavigatorRouteList } from "~/navigators/SettingsNavigator";

import AdjustTemperatureBlock from "~/components/AdjustTemperatureBlock";
import Box from "~/components/Box";
import Screen from "~/components/Screen";
import Text from "~/components/Text";
import SetpointRenderer from "~/components/SetpointRenderer";

import {
  DualSetpoint,
  DualSetpointInput,
  GoBack,
  Setpoint,
  SingleSetpointInput,
  WithQueryDataProps,
  useAwayControllerQuery,
  useAwayLocationQuery,
  useChangeControllerAwaySetpointMutation,
  useChangeLocationAwaySetpointMutation,
  withQueryData,
  SingleSetpoint,
} from "~/graph";

import { useDualRangeSafe, useRangeSafe, useSaveButton } from "~/hooks";

import i18n from "~/i18n";

import { makeToDisplay } from "~/utils/display";

const scope = "Screens.Authenticated.SettingsNavigator.AdjustAway";

export type AdjustAwayProps = WithQueryDataProps<typeof useAwayLocationQuery> &
  WithQueryDataProps<typeof useAwayControllerQuery>;

type CommonProps = {
  changeSetpoint: (input: SingleSetpointInput | DualSetpointInput) => void;
  toDisplay: (value: number) => number;
};

type SingleSetpointAdjustAwayProps = {
  target: number;
  setpoint: SingleSetpoint;
} & CommonProps;

type DualSetpointAdjustAwayProps = {
  lower: number;
  upper: number;
  setpoint: DualSetpoint;
} & CommonProps;

function SingleSetpointAdjustAway({
  changeSetpoint,
  target,
  setpoint,
  toDisplay,
}: SingleSetpointAdjustAwayProps): JSX.Element {
  const onValuesChange = useCallback(
    (target: number) => changeSetpoint({ target }),
    [changeSetpoint]
  );

  const { decreaseValueSafe, increaseValueSafe } = useRangeSafe(
    target,
    setpoint,
    onValuesChange
  );

  return (
    <Box>
      <Text variant="heading">{i18n.t("targetTo", { scope })}</Text>
      <AdjustTemperatureBlock
        currentTemperature={toDisplay(target)}
        onDecreasePress={decreaseValueSafe}
        onIncreasePress={increaseValueSafe}
      />
    </Box>
  );
}

function DualSetpointAdjustAway({
  changeSetpoint,
  setpoint,
  lower,
  upper,
  toDisplay,
}: DualSetpointAdjustAwayProps): JSX.Element {
  const onValuesChange = useCallback(
    (lower: number, upper: number) => changeSetpoint({ lower, upper }),
    [changeSetpoint]
  );

  const {
    increaseDualRangeSafe: increaseSetpointSafe,
    decreaseDualRangeSafe: decreaseSetpointSafe,
  } = useDualRangeSafe(
    lower,
    upper,
    setpoint.lower,
    setpoint.upper,
    setpoint.minInterval,
    onValuesChange
  );

  return (
    <Box>
      <Box>
        <Text variant="heading">{i18n.t("lowerTo", { scope })}</Text>
        <AdjustTemperatureBlock
          currentTemperature={toDisplay(lower)}
          onDecreasePress={() => decreaseSetpointSafe("lower")}
          onIncreasePress={() => increaseSetpointSafe("lower")}
        />
      </Box>
      <Box>
        <Text variant="heading">{i18n.t("upperTo", { scope })}</Text>
        <AdjustTemperatureBlock
          currentTemperature={toDisplay(upper)}
          onDecreasePress={() => decreaseSetpointSafe("upper")}
          onIncreasePress={() => increaseSetpointSafe("upper")}
        />
      </Box>
    </Box>
  );
}

function AdjustAway({
  data: { controller, location },
}: AdjustAwayProps): JSX.Element {
  const setpoint: Setpoint | undefined =
    controller?.away?.setpoint ?? location?.away?.setpoint;

  if (!setpoint) throw new GoBack();

  const temperatureUnit =
    location?.temperatureUnit ?? controller?.location.temperatureUnit;

  if (!temperatureUnit) throw new GoBack();

  const toDisplay = makeToDisplay(temperatureUnit);

  const [
    singleSetpoint,
    setSingleSetpoint,
  ] = useState<SingleSetpointInput | null>(null);
  const [dualSetpoint, setDualSetpoint] = useState<DualSetpointInput | null>(
    null
  );

  const [
    changeControllerAwaySetpoint,
    { loading: controllerLoading },
  ] = useChangeControllerAwaySetpointMutation();

  const [
    changeLocationAwaySetpoint,
    { loading: locationLoading },
  ] = useChangeLocationAwaySetpointMutation();

  const handleSave = useCallback(async () => {
    if (controller?.id) {
      await changeControllerAwaySetpoint({
        variables: {
          input: {
            id: controller?.id,
            single: singleSetpoint,
            dual: dualSetpoint,
          },
        },
      });
    } else if (location?.id) {
      await changeLocationAwaySetpoint({
        variables: {
          input: {
            id: location?.id,
            single: singleSetpoint,
            dual: dualSetpoint,
          },
        },
      });
    }
  }, [
    changeControllerAwaySetpoint,
    changeLocationAwaySetpoint,
    controller?.id,
    dualSetpoint,
    location?.id,
    singleSetpoint,
  ]);

  const { didChange } = useSaveButton({
    handleSave,
    loading: controllerLoading || locationLoading,
  });

  const changeSetpoint = useCallback(
    (input: SingleSetpointInput | DualSetpointInput) => {
      const single = input as SingleSetpointInput;
      const dual = input as DualSetpointInput;

      if (typeof single.target === "number") {
        setSingleSetpoint(single);
      } else if (typeof dual.lower === "number") {
        setDualSetpoint(dual);
      }

      didChange();
    },
    [didChange]
  );

  return (
    <Screen>
      <Text variant="heading">{i18n.t("awayMode", { scope })}</Text>
      <Text>{i18n.t("saveEnergyDescription", { scope })}</Text>
      <Box paddingTop="xxl">
        <SetpointRenderer
          setpoint={setpoint}
          single={(single) => (
            <SingleSetpointAdjustAway
              changeSetpoint={changeSetpoint}
              target={singleSetpoint?.target ?? single.value}
              setpoint={single}
              toDisplay={toDisplay}
            />
          )}
          dual={(dual) => (
            <DualSetpointAdjustAway
              lower={dualSetpoint?.lower ?? dual.lower.value}
              upper={dualSetpoint?.upper ?? dual.upper.value}
              changeSetpoint={changeSetpoint}
              setpoint={dual}
              toDisplay={toDisplay}
            />
          )}
        />
      </Box>
    </Screen>
  );
}

export const AdjustLocation = withQueryData(useAwayLocationQuery, {
  useVariables() {
    const route = useRoute<
      RouteProp<SettingsNavigatorRouteList, "AwayLocation">
    >();
    return useMemo(() => ({ locationId: route.params.locationId }), [
      route.params.locationId,
    ]);
  },
})(AdjustAway);

export const AdjustController = withQueryData(useAwayControllerQuery, {
  useVariables() {
    const route = useRoute<
      RouteProp<SettingsNavigatorRouteList, "AwayController">
    >();
    return useMemo(() => ({ controllerId: route.params.controllerId }), [
      route.params.controllerId,
    ]);
  },
})(AdjustAway);
