import React, { useContext, useMemo } from "react";

import {
  Call,
  ConnectionStatus,
  EffectiveMode,
  TemperatureUnit,
} from "~/graph";

export interface ControlledDialContextProps {
  activeState: Call | undefined;
  awayActive: boolean;
  connectionStatus: ConnectionStatus;
  controllerId: string;
  mode?: EffectiveMode;
  setpointMin: number;
  setpointMax: number;
  temperatureAmbient: number;
  temperatureUnit: TemperatureUnit;
}

const ControlledDialContext = React.createContext<
  ControlledDialContextProps | undefined
>(undefined);

interface ControlledDialContextProviderProps {
  children: React.ReactNode;
  activeState: Call | undefined;
  awayActive: boolean;
  connectionStatus: ConnectionStatus;
  controllerId: string;
  mode?: EffectiveMode;
  setpointMin: number;
  setpointMax: number;
  temperatureAmbient: number;
  temperatureUnit: TemperatureUnit;
}

export function ControlledDialProvider({
  children,
  activeState,
  awayActive,
  connectionStatus,
  controllerId,
  mode,
  setpointMin,
  setpointMax,
  temperatureAmbient,
  temperatureUnit,
}: ControlledDialContextProviderProps): JSX.Element {
  const context = useMemo(
    () => ({
      activeState,
      awayActive,
      connectionStatus,
      controllerId,
      mode,
      setpointMin,
      setpointMax,
      temperatureAmbient,
      temperatureUnit,
    }),
    [
      activeState,
      awayActive,
      connectionStatus,
      controllerId,
      mode,
      temperatureAmbient,
      temperatureUnit,
      setpointMin,
      setpointMax,
    ]
  );

  return (
    <ControlledDialContext.Provider value={context}>
      {children}
    </ControlledDialContext.Provider>
  );
}

export function useControlledDialContext(): ControlledDialContextProps {
  const context = useContext(ControlledDialContext);

  if (context === undefined) {
    throw new Error(
      "useControlledDialContext must be used within a ControlledDialContextProvider"
    );
  }

  return context;
}
