import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { ControlledDialProvider } from "~/contexts/ControlledDialContext";

import {
  WithQueryDataProps,
  useControlledDialQuery,
  useChangeSetpointMutation,
  withQueryData,
  ChangeSetpointMutation,
} from "~/graph";

import { useCounter, useRatingRequest } from "~/hooks";
import { KohortFunnelEventStep, useKohortTracking } from "~/utils/kohort";

import ControlledDialDual from "./ControlledDialDual";
import ControlledDialSingle from "./ControlledDialSingle";

export type ControlledDialProps = WithQueryDataProps<
  typeof useControlledDialQuery
>;

const ControlledDial = ({
  data: { controller },
  stopPolling,
  startPolling,
}: ControlledDialProps): JSX.Element => {
  if (!controller) {
    throw new Error();
  }

  const requestRating = useRatingRequest("ChangeSetpoint");
  const { trackFeatureUse, trackFunnel } = useKohortTracking();

  const awayActive =
    (controller.away ?? controller.location.away)?.active ?? false;

  // Keep the setpoint as state so that we're able to trigger a
  // re-render if the mutation fails (below)
  const [setpoint, setSetpoint] = useState(controller.setpoint);
  useEffect(() => setSetpoint(controller.setpoint), [controller.setpoint]);

  const { increment, decrement, count } = useCounter(
    {
      onChange: useCallback(
        (outstanding: number) => {
          if (outstanding === 0) {
            startPolling();
          } else if (outstanding === 1) {
            stopPolling();
          }
        },
        [startPolling, stopPolling]
      ),
      timeout: 10000,
    },
    [controller.id]
  );

  const [changeSetpointMutation] = useChangeSetpointMutation({
    onCompleted: useCallback(
      ({ changeSetpoint: { __typename } }: ChangeSetpointMutation) => {
        decrement();

        switch (__typename) {
          case "ChangeSetpointSuccess":
            requestRating();
            trackFeatureUse(
              "Change Setpoint",
              controller.mode.effectiveMode || "Unknown"
            );
            trackFunnel({ step: KohortFunnelEventStep.Action });
            break;
          case "AwayActive":
          case "NotFound":
          case "NotSupported":
          default:
          // No-op
        }
      },
      [decrement, requestRating, controller, trackFeatureUse, trackFunnel]
    ),
    onError: decrement,
  });

  const { callback: changeSetpoint } = useDebouncedCallback(
    useCallback<typeof changeSetpointMutation>(
      (options) => {
        increment();
        return changeSetpointMutation(options);
      },
      [changeSetpointMutation, increment]
    ),
    500,
    { leading: true }
  );

  // We want the underlying components to update their internal state
  // based on data in the cache only when there are no outstanding
  // mutations
  const allowUpdateFromCache = useCallback(() => count() === 0, [count]);

  function renderControlledDial(): JSX.Element {
    if (!controller) {
      throw new Error();
    }
    switch (setpoint.__typename) {
      case "SingleSetpoint":
        return (
          <ControlledDialSingle
            changeSetpoint={changeSetpoint}
            allowUpdateFromCache={allowUpdateFromCache}
            setpoint={setpoint}
          />
        );
      case "DualSetpoint":
        return (
          <ControlledDialDual
            changeSetpoint={changeSetpoint}
            allowUpdateFromCache={allowUpdateFromCache}
            setpoint={setpoint}
          />
        );
      default:
        throw new Error();
    }
  }

  return (
    <ControlledDialProvider
      setpointMin={controller.setpointRange.min}
      setpointMax={controller.setpointRange.max}
      activeState={controller.call ?? undefined}
      awayActive={awayActive}
      connectionStatus={controller.location.connectionStatus}
      controllerId={controller.id}
      mode={controller.mode.effectiveMode}
      temperatureAmbient={controller.temperatureAmbient}
      temperatureUnit={controller.location.temperatureUnit}
    >
      {renderControlledDial()}
    </ControlledDialProvider>
  );
};

ControlledDial.displayName = "ControlledDial";

export default withQueryData(useControlledDialQuery, {
  options: { fetchPolicy: "cache-only" },
  useVariables: ({ controllerId }) =>
    useMemo(() => ({ controllerId }), [controllerId]),
})(ControlledDial);
