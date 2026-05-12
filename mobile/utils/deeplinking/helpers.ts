import { getStateFromPath } from "@react-navigation/core";

import {
  AuthenticatedAppScreenNames,
  AuthenticatedAppScreenParams,
} from "~/navigators/types";

type ResultState = ReturnType<typeof getStateFromPath>;

export type AppRoute = {
  name: AuthenticatedAppScreenNames;
  params: AuthenticatedAppScreenParams;
};

export const insertSiblingRoute = (
  routeState: ResultState,
  routeToInsert: AppRoute
): ResultState => {
  // just a guard against undefined/TS pleaser really
  if (!routeState) return routeState;

  // If there are no more "state" nodes on the tree, we're at the end and can insert the sibling route
  let bottomOfNavigationTree = true;

  // recurse nested navigators looking for bottom of tree
  const routes = routeState.routes.map((route) => {
    if (route.state) {
      bottomOfNavigationTree = false;
      return {
        ...route,
        state: {
          ...route.state,
          ...insertSiblingRoute(route.state, routeToInsert),
        },
      };
    } else {
      return route;
    }
  });

  // routeState.index guard is mostly just a TS pleaser here I believe
  if (bottomOfNavigationTree && routeState.index) {
    // insert sibling route before final route
    routes.splice(routeState.index, 0, routeToInsert);
    // update index of tree to point to new end of stack
    routeState = {
      ...routeState,
      index: routeState.index + 1,
    };
  }

  return { ...routeState, routes };
};
