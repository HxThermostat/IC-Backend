import React, { useContext } from "react";

export type CloakContextProps = { hidden: boolean };

const CloakContext = React.createContext<CloakContextProps>({
  hidden: false,
});

type CloakContextProviderProps = React.PropsWithChildren<{
  hidden: boolean;
}>;

export function CloakProvider({
  children,
  hidden,
}: CloakContextProviderProps): JSX.Element {
  return (
    <CloakContext.Provider value={{ hidden }}>{children}</CloakContext.Provider>
  );
}

export function useIsCloaked(): boolean {
  const { hidden } = useContext(CloakContext);
  return hidden;
}
