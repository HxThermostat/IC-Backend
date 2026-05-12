import React, { useContext } from "react";

export type QueryIdContextProps = string;

const QueryIdContext = React.createContext<QueryIdContextProps | undefined>(
  undefined
);

type QueryIdContextProviderProps = React.PropsWithChildren<{
  queryId: string;
}>;

export function QueryIdProvider({
  children,
  queryId,
}: QueryIdContextProviderProps): JSX.Element {
  return (
    <QueryIdContext.Provider value={queryId}>
      {children}
    </QueryIdContext.Provider>
  );
}

export function useQueryId(): QueryIdContextProps {
  const context = useContext(QueryIdContext);
  return context ?? "";
}
