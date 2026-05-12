import React, { useContext, useEffect, useMemo, useState } from "react";

import { Platform } from "react-native";

import * as Device from "expo-device";

export interface DeviceContextProps {
  isTablet: boolean;
  isIpad: boolean;
}

const DeviceContext = React.createContext<DeviceContextProps | undefined>(
  undefined
);

interface DeviceContextProviderProps {
  children: React.ReactNode;
}

export function DeviceProvider({
  children,
}: DeviceContextProviderProps): JSX.Element {
  const [isTablet, setIsTablet] = useState(false);

  const discoverDeviceTypeAsync = async (): Promise<void> => {
    const deviceType = await Device.getDeviceTypeAsync();
    setIsTablet(deviceType === Device.DeviceType.TABLET);
  };

  useEffect(() => {
    void discoverDeviceTypeAsync();
  }, []);

  const isIpad = isTablet && Platform.OS === "ios";

  const context = useMemo(() => ({ isTablet, isIpad }), [isTablet, isIpad]);

  return (
    <DeviceContext.Provider value={context}>{children}</DeviceContext.Provider>
  );
}

export function useDeviceContext(): DeviceContextProps {
  const context = useContext(DeviceContext);

  if (context === undefined) {
    throw new Error(
      "useDeviceContext must be used within a DeviceContextProvider"
    );
  }

  return context;
}
