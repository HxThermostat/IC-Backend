import {
  resolver as appResolver,
  queryResolver as appQueryResolver,
  mutationResolver as appMutationResolver,
} from "./appResolver";

import {
  resolver as authResolver,
  queryResolver as authQueryResolver,
  mutationResolver as authMutationResolver,
} from "./authResolver";

import {
  resolver as awayResolver,
  queryResolver as awayQueryResolver,
  mutationResolver as awayMutationResolver,
} from "./awayResolver";

import {
  resolver as controllerResolver,
  queryResolver as controllerQueryResolver,
  mutationResolver as controllerMutationResolver,
} from "./controllerResolver";

import {
  resolver as controllerResolvers,
  queryResolver as controllerQueryResolvers,
  mutationResolver as controllerMutationResolvers,
} from "./controllerResolvers";

import {
  resolver as faultLogResolver,
  queryResolver as faultLogQueryResolver,
  mutationResolver as faultLogMutationResolver,
} from "./faultLogResolver";

import {
  resolver as featureResolver,
  queryResolver as featureQueryResolver,
  mutationResolver as featureMutationResolver,
} from "./featureResolver";

import {
  resolver as holdLengthResolver,
  queryResolver as holdLengthQueryResolver,
  mutationResolver as holdLengthMutationResolver,
} from "./defaultHoldLengthResolver";

import {
  resolver as locationResolver,
  queryResolver as locationQueryResolver,
  mutationResolver as locationMutationResolver,
} from "./locationResolver";

import {
  resolver as locationResolvers,
  queryResolver as locationQueryResolvers,
  mutationResolver as locationMutationResolvers,
} from "./locationResolvers";

import {
  resolver as renameResolver,
  queryResolver as renameQueryResolver,
  mutationResolver as renameMutationResolver,
} from "./renameResolver";

import {
  resolver as userResolver,
  queryResolver as userQueryResolver,
  mutationResolver as userMutationResolver,
} from "./userResolver";

export const typeResolvers = [
  appResolver,
  authResolver,
  awayResolver,
  controllerResolver,
  controllerResolvers,
  faultLogResolver,
  featureResolver,
  holdLengthResolver,
  locationResolver,
  locationResolvers,
  renameResolver,
  userResolver,
];
export const queryResolvers = [
  appQueryResolver,
  authQueryResolver,
  awayQueryResolver,
  controllerQueryResolver,
  controllerQueryResolvers,
  faultLogQueryResolver,
  featureQueryResolver,
  holdLengthQueryResolver,
  locationQueryResolver,
  locationQueryResolvers,
  renameQueryResolver,
  userQueryResolver,
];
export const mutationResolvers = [
  appMutationResolver,
  authMutationResolver,
  awayMutationResolver,
  controllerMutationResolver,
  controllerMutationResolvers,
  faultLogMutationResolver,
  featureMutationResolver,
  holdLengthMutationResolver,
  locationMutationResolver,
  locationMutationResolvers,
  renameMutationResolver,
  userMutationResolver,
];
