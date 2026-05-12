import React, { useCallback, useEffect, useState } from "react";

import { useControlledDialContext } from "~/contexts/ControlledDialContext";

import { ChangeSetpointMutationVariables, DualSetpoint } from "~/graph";
import { equal } from "~/utils/math";

import StaticDialDual from "./StaticDial/StaticDialDual";

export interface ControlledDialDualProps {
  changeSetpoint: ({
    variables,
  }: {
    variables: ChangeSetpointMutationVariables;
  }) => void;
  allowUpdateFromCache: () => boolean;
  setpoint: DualSetpoint;
}

export default function ControlledDialDual({
  changeSetpoint,
  allowUpdateFromCache,
  setpoint,
}: ControlledDialDualProps): JSX.Element {
  const { controllerId } = useControlledDialContext();

  const [lowerSetpoint, setLowerSetpoint] = useState(setpoint.lower);
  const [upperSetpoint, setUpperSetpoint] = useState(setpoint.upper);

  const onChangeSetpointDual = useCallback(
    (newLower: number, newUpper: number) => {
      setLowerSetpoint((current) => {
        if (equal(current.value, newLower)) return current;

        return { ...current, value: newLower };
      });
      setUpperSetpoint((current) => {
        if (equal(current.value, newUpper)) return current;

        return { ...current, value: newUpper };
      });

      changeSetpoint({
        variables: {
          id: controllerId,
          single: null,
          dual: { lower: newLower, upper: newUpper },
        },
      });
    },
    [changeSetpoint, controllerId]
  );

  useEffect(() => {
    if (allowUpdateFromCache()) {
      setLowerSetpoint(setpoint.lower);
      setUpperSetpoint(setpoint.upper);
    }
  }, [
    lowerSetpoint.value,
    allowUpdateFromCache,
    setpoint,
    setpoint.lower,
    setpoint.upper,
    upperSetpoint.value,
  ]);

  return (
    <StaticDialDual
      lowerSetpoint={lowerSetpoint}
      minInterval={setpoint.minInterval}
      onChange={onChangeSetpointDual}
      upperSetpoint={upperSetpoint}
    />
  );
}
