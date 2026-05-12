import React from "react";

import { DualSetpoint, Setpoint, SingleSetpoint } from "~/graph";

interface SetpointRendererProps {
  setpoint: Setpoint;
  single: (setpoint: SingleSetpoint) => JSX.Element;
  dual: (setpoint: DualSetpoint) => JSX.Element;
}

const SetpointRenderer = ({
  setpoint,
  single,
  dual,
}: SetpointRendererProps): JSX.Element => {
  return (
    <>
      {setpoint.__typename === "SingleSetpoint" && single(setpoint)}
      {setpoint.__typename === "DualSetpoint" && dual(setpoint)}
    </>
  );
};

export default SetpointRenderer;
