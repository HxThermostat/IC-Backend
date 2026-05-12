import { useCallback } from "react";
import { TemperatureUnit, useChangeTemperatureUnitMutation } from "~/graph";

export interface TemperatureUnitProps {
  setTemperatureUnit: (
    locationId: string,
    temperatureUnit: TemperatureUnit
  ) => void;
}

export function useSetTemperatureUnit(): TemperatureUnitProps {
  const [changeTemperatureUnit] = useChangeTemperatureUnitMutation();
  const setTemperatureUnit = useCallback(
    (locationId: string, temperatureUnit: TemperatureUnit) => {
      void changeTemperatureUnit({
        variables: {
          input: {
            id: locationId,
            temperatureUnit,
          },
        },
        optimisticResponse: {
          changeTemperatureUnit: {
            __typename: "ChangeTemperatureUnitSuccess",
            location: {
              __typename: "Location",
              id: locationId,
              temperatureUnit,
            },
          },
        },
      });
    },
    [changeTemperatureUnit]
  );

  return {
    setTemperatureUnit,
  };
}
