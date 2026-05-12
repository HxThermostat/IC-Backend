import { useState } from "react";
import { DualSetpointInput, Setpoint, SingleSetpointInput } from "~/graph";

export const useSetpointState = (
  setpoint: Setpoint
): {
  singleSetpoint: SingleSetpointInput | null;
  setSingleSetpoint: React.Dispatch<
    React.SetStateAction<SingleSetpointInput | null>
  >;
  dualSetpoint: DualSetpointInput | null;
  setDualSetpoint: React.Dispatch<
    React.SetStateAction<DualSetpointInput | null>
  >;
} => {
  const lower = setpoint.__typename === "DualSetpoint" && setpoint.lower.value;
  const upper = setpoint.__typename === "DualSetpoint" && setpoint.upper.value;

  const dual = lower && upper ? { upper, lower } : null;
  const single =
    setpoint.__typename === "SingleSetpoint"
      ? { target: setpoint.value }
      : null;

  const [
    singleSetpoint,
    setSingleSetpoint,
  ] = useState<SingleSetpointInput | null>(single);
  const [dualSetpoint, setDualSetpoint] = useState<DualSetpointInput | null>(
    dual
  );
  return {
    singleSetpoint,
    setSingleSetpoint,
    dualSetpoint,
    setDualSetpoint,
  };
};
