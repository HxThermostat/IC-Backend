import React, { useCallback, useContext, useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

export type AppStateContextProps = Pick<AppState, "currentState">;

const AppStateContext = React.createContext<AppStateContextProps | undefined>(
  undefined
);

interface AppStateContextProviderProps {
  children: React.ReactNode;
}

export function AppStateProvider({
  children,
}: AppStateContextProviderProps): JSX.Element {
  const [context, setContext] = useState<AppStateContextProps>({
    currentState: AppState.currentState,
  });

  const onChangeAppState = useCallback((currentState: AppStateStatus) => {
    setContext({ currentState });
  }, []);

  useEffect(() => {
    AppState.addEventListener("change", onChangeAppState);
    return () => {
      AppState.removeEventListener("change", onChangeAppState);
    };
  }, [onChangeAppState]);

  return (
    <AppStateContext.Provider value={context}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppStateContextProps["currentState"] {
  const context = useContext(AppStateContext);

  if (context === undefined) {
    throw new Error("useAppState must be used within a AppStateProvider");
  }

  return context.currentState;
}
