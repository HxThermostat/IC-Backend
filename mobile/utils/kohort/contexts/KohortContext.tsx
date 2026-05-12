import type { JsonMap } from "@segment/analytics-react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  KohortFunnel,
  KohortFunnelEventStep,
  KohortTracking,
} from "../KohortTracking";
import { useAppState } from "../hooks/useAppState";
import { addPlugin } from "../integrations/segment";
import { createSessionPlugin } from "../plugin";

export { KohortFunnel, KohortFunnelEventStep };

export type KohortContextProps = {
  identifyUser: KohortTracking["identify"];
  trackFunnel: KohortTracking["trackFunnel"];
  trackFeatureUse: (event: string, tag?: string | null) => void;
};

const KohortContext = React.createContext<KohortContextProps | undefined>(
  undefined
);

type KohortContextProviderProps = React.PropsWithChildren<{
  tracker?: KohortTracking;
}>;

export function KohortProvider({
  children,
  // Use the singleton() by default, but allow this to be passed in
  tracker = KohortTracking.singleton(),
}: KohortContextProviderProps): JSX.Element {
  const kohortRef = useRef(tracker);
  const [hydrating, setHydrating] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [middlewareAttached, setMiddlewareAttached] = useState(false);
  const appState = useAppState();

  // Load previous sessionId if within time limit
  useEffect(() => {
    if (hydrating) return;
    if (!hydrated) {
      setHydrating(true);
      kohortRef.current.session
        .loadSessionInfoFromStorage()
        .then(() => {
          setHydrated(true);
          setHydrating(false);

          return true;
        })
        .catch((err) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          let message = "?";
          if (err instanceof Error) {
            message = err.message;
          }

          throw new Error("Error loading session from storage; " + message);
        });
    }
  }, [hydrated, hydrating, kohortRef]);

  // Mark session active when foregrounded
  useEffect(() => {
    if (!hydrated) return;

    if (appState === "active") {
      kohortRef.current.session.markSessionActive();
    }
  }, [appState, hydrated, kohortRef]);

  // Attach the middleware that inserts session info
  useEffect(() => {
    // Wait for hydration of stored sessionId
    if (!hydrated) return;
    // Skip if already attached
    if (middlewareAttached) return;

    addPlugin(createSessionPlugin(kohortRef.current));
    setMiddlewareAttached(true);
  }, [hydrated, kohortRef, middlewareAttached]);

  // Functions that are exposed through the hook
  const identifyUser = useCallback(
    (userId: string, customTraits: JsonMap) => {
      kohortRef.current.identify(userId, customTraits);
    },
    [kohortRef]
  );
  const trackFeatureUse = useCallback(
    (event: string, tag: string | null = null) => {
      kohortRef.current.trackFeatureUse(event, tag);
    },
    [kohortRef]
  );
  const trackFunnel = useCallback<KohortTracking["trackFunnel"]>(
    (event) => {
      kohortRef.current.trackFunnel(event);
    },
    [kohortRef]
  );

  return (
    <KohortContext.Provider
      value={{
        identifyUser,
        trackFeatureUse,
        trackFunnel,
      }}
    >
      {children}
    </KohortContext.Provider>
  );
}

export function useKohortTracking(): KohortContextProps {
  const context = useContext(KohortContext);

  if (context === undefined) {
    throw new Error("useKohortTracking must be used within a KohortProvider");
  }

  return context;
}
