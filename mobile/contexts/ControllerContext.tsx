import { ApolloQueryResult } from "@apollo/client";
import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import { ControllersContextQuery, useControllersContextQuery } from "~/graph";

import SplashScreen from "~/screens/Splash";

import {
  saveToAsyncStorage,
  loadFromAsyncStorage,
  removeFromAsyncStorage,
} from "~/utils/storage";

interface Pair {
  controllerId: string;
  locationId: string;
}

interface ControllerContext {
  controllerCount: number;
  controllerId: string;
  locationCount: number;
  locationId: string;
  selectController: (selection: Pair) => Promise<void>;
  setControllerId: (controllerId: string) => Promise<void>;
  setLocationId: (locationId: string) => Promise<void>;
  reset: () => Promise<void>;
}

export const ControllerContext = React.createContext<
  ControllerContext | undefined
>(undefined);

function selectMatch({
  controllerId,
  locationId,
  pairs,
}: {
  controllerId?: string;
  locationId?: string;
  pairs: Pair[];
}): { controllerId: string; locationId: string } {
  if (pairs.length === 0) throw new Error("No controllers provided");

  let resultControllerId: string | undefined;
  let resultLocationId: string | undefined;

  if (locationId) {
    const candidateIds = pairs.filter((pair) => locationId === pair.locationId);

    if (candidateIds.length === 0)
      throw new Error(`No locations match supplied locationId: ${locationId}`);

    ({ controllerId: resultControllerId } =
      candidateIds.find((pair) => controllerId === pair.controllerId) ??
      candidateIds[0]);

    if (controllerId == null || resultControllerId === controllerId) {
      resultLocationId = locationId;
    }
  } else {
    ({ controllerId: resultControllerId, locationId: resultLocationId } =
      pairs.find((pair) => controllerId === pair.controllerId) ?? pairs[0]);
  }

  if (resultControllerId == null)
    throw new Error("Could not find a controllerId");

  if (resultLocationId == null) throw new Error("Could not find a locationId");

  return { controllerId: resultControllerId, locationId: resultLocationId };
}

interface ControllerProviderLoadedProps {
  children: React.ReactNode;
  allPairs: Pair[];
  controllerId: string;
  locationId: string;
  refetch: () => Promise<ApolloQueryResult<ControllersContextQuery>>;
}

function ControllerProviderLoaded({
  refetch,
  ...props
}: ControllerProviderLoadedProps): JSX.Element {
  const [{ controllerId, locationId }, setPair] = useState({
    controllerId: props.controllerId,
    locationId: props.locationId,
  });

  const update = useCallback(async (pair: Pair) => {
    setPair(pair);
    await saveToAsyncStorage("selected_controller", [
      pair.controllerId,
      pair.locationId,
    ]);
  }, []);

  const refetchPairs = useCallback(async (): Promise<Pair[]> => {
    const {
      data: { controllers },
    } = await refetch();

    return controllers.map((c) => ({
      controllerId: c.id,
      locationId: c.location.id,
    }));
  }, [refetch]);

  const serializedPairs = JSON.stringify(props.allPairs);
  const contextValue = useMemo((): ControllerContext => {
    const allPairs = serializedPairs
      ? (JSON.parse(serializedPairs) as Pair[])
      : [];
    return {
      controllerCount: new Set(allPairs.map(({ controllerId }) => controllerId))
        .size,
      controllerId,
      locationCount: new Set(allPairs.map(({ locationId }) => locationId)).size,
      locationId,
      selectController: async ({ controllerId, locationId }) => {
        await update({ controllerId, locationId });
      },
      setControllerId: async (newControllerId: string) => {
        const { locationId: newLocationId } = selectMatch({
          controllerId: newControllerId,
          pairs: await refetchPairs(),
        });
        await update({
          controllerId: newControllerId,
          locationId: newLocationId,
        });
      },
      setLocationId: async (newLocationId: string) => {
        const { controllerId: newControllerId } = selectMatch({
          locationId: newLocationId,
          pairs: await refetchPairs(),
        });
        await update({
          controllerId: newControllerId,
          locationId: newLocationId,
        });
      },
      reset: async () => {
        await update(allPairs[0]);
      },
    };
  }, [controllerId, locationId, serializedPairs, refetchPairs, update]);

  return (
    <ControllerContext.Provider value={contextValue}>
      {props.children}
    </ControllerContext.Provider>
  );
}

interface ControllerProvider {
  children: React.ReactNode;
}

export function ControllerProvider(props: ControllerProvider): JSX.Element {
  const [pairFromStorage, setPairFromStorage] = useState<
    [string, string] | null | undefined
  >();

  const [pair, setPair] = useState<Pair | undefined>();

  const { data, loading: queryLoading, refetch } = useControllersContextQuery({
    fetchPolicy: "cache-only",
  });

  useEffect(() => {
    void (async () => {
      const pair = await loadFromAsyncStorage("selected_controller");
      setPairFromStorage(pair);
    })();
  }, []);

  const loading = (queryLoading && !data) || pairFromStorage === undefined;
  const controllers = data?.controllers;

  const allPairs = controllers?.map((c) => ({
    controllerId: c.id,
    locationId: c.location.id,
  }));

  // We need to turn the allPairs list into something that can be
  // compared as a dependency of the useEffect hook, otherwise changes
  // in Apollo cache could result in unecessary renders
  const serializedPairs = allPairs
    ? JSON.stringify(
        allPairs.sort((a, b) => {
          const combinedA = `${a.controllerId}${a.locationId}`;
          const combinedB = `${b.controllerId}${b.locationId}`;

          if (combinedA < combinedB) {
            return -1;
          } else if (combinedA > combinedB) {
            return 1;
          }

          return 0;
        })
      )
    : undefined;

  // Same with pairFromStorage, though the serialization is simpler in
  // this case. All we need to worry about is maintain the semantics
  // of undefined => not yet loaded
  const serializedPairFromStorage =
    pairFromStorage !== undefined ? JSON.stringify(pairFromStorage) : undefined;

  // And finally, we need to provide some fallback value for when a
  // pair has not yet been selected by the user (e.g. the first run
  // experience).
  const defaultControllerId = controllers?.[0].id;

  useEffect(() => {
    if (loading) return;
    if (serializedPairs == null) return;
    if (serializedPairFromStorage === undefined) return;
    if (defaultControllerId == null) return;

    const allPairs = JSON.parse(serializedPairs) as Pair[];
    const pairFromStorage = JSON.parse(serializedPairFromStorage) as
      | [string, string]
      | null;

    let match: Pair;

    try {
      if (pairFromStorage) {
        match = selectMatch({
          controllerId: pairFromStorage[0],
          locationId: pairFromStorage[1],
          pairs: allPairs,
        });
      } else {
        match = selectMatch({
          controllerId: defaultControllerId,
          pairs: allPairs,
        });
      }
    } catch {
      void removeFromAsyncStorage("selected_controller");
      match = selectMatch({
        controllerId: defaultControllerId,
        pairs: allPairs,
      });
    }

    // We don't want this useEffect block to _change_ a valid
    // selection, so we're only setting the pair when it's
    // uninitialized or if the current selection is no longer valid
    // (e.g. a location was removed)
    setPair((current) =>
      allPairs.some(
        (pair) =>
          pair.controllerId === current?.controllerId &&
          pair.locationId === current?.locationId
      )
        ? current
        : match
    );
  }, [
    defaultControllerId,
    loading,
    serializedPairFromStorage,
    serializedPairs,
  ]);

  if (loading) {
    return <SplashScreen />;
  }

  // The useEffect fingerprinting hook above will eventually unmount
  // this component if there are indeed no controllers. We don't
  // expect the app to stay on this <SplashScreen /> for long.
  if (!allPairs || !pair) {
    return <SplashScreen />;
  }

  return (
    <ControllerProviderLoaded
      allPairs={allPairs}
      controllerId={pair.controllerId}
      locationId={pair.locationId}
      refetch={refetch}
    >
      {props.children}
    </ControllerProviderLoaded>
  );
}

export function useController(): ControllerContext {
  const context = useContext(ControllerContext);

  if (context === undefined) {
    throw new Error("useController must be used within a ControllerProvider");
  }

  return context;
}

// This hook allows us to use the useController in the Connect flow
// and leverage the same components regardless if the user is going
// through initial onboarding or adding an additional device. Mostly,
// we want to be able to call the selectController (or setControllerId
// / setLocationId) methods when a new device has been added to the
// account. For a new user, these methods noop-ing is safe.
export function useControllerSafe(): ControllerContext {
  const context = useContext(ControllerContext);
  const safeContext = useMemo(
    (): ControllerContext => ({
      controllerCount: 0,
      controllerId: "",
      locationCount: 0,
      locationId: "",
      selectController: () => Promise.resolve(),
      setControllerId: () => Promise.resolve(),
      setLocationId: () => Promise.resolve(),
      reset: () => Promise.resolve(),
    }),
    []
  );

  return context ?? safeContext;
}
