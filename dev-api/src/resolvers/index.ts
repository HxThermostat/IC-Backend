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
  resolver as defaultHoldLengthResolver,
  queryResolver as defaultHoldLengthQueryResolver,
  mutationResolver as defaultHoldLengthMutationResolver,
} from "./defaultHoldLengthResolver";

import {
  resolver as faultLogsResolvers,
  queryResolver as faultLogsQueryResolvers,
  mutationResolver as faultLogsMutationResolvers,
} from "./faultLogsResolver";

import {
  resolver as featureResolver,
  queryResolver as featureQueryResolver,
  mutationResolver as featureMutationResolver,
} from "./featureResolver";

import {
  resolver as fileResolver,
  queryResolver as fileQueryResolver,
  mutationResolver as fileMutationResolver,
} from "./fileResolver";

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
  resolver as manufacturerResolver,
  queryResolver as manufacturerQueryResolver,
  mutationResolver as manufacturerMutationResolver,
} from "./manufacturerResolver";

import {
  resolver as notficationsResolver,
  queryResolver as notficationsQueryResolver,
  mutationResolver as notficationsMutationResolver,
} from "./notificationsResolver";

import {
  resolver as renameResolver,
  queryResolver as renameQueryResolver,
  mutationResolver as renameMutationResolver,
} from "./renameResolver";

import {
  resolver as temperaturePresetsResolver,
  queryResolver as temperaturePresetsQueryResolver,
  mutationResolver as temperaturePresetsMutationResolver,
} from "./temperaturePresetsResolver";

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
  defaultHoldLengthResolver,
  faultLogsResolvers,
  featureResolver,
  fileResolver,
  locationResolver,
  locationResolvers,
  manufacturerResolver,
  notficationsResolver,
  renameResolver,
  temperaturePresetsResolver,
  userResolver,
];
export const queryResolvers = [
  appQueryResolver,
  authQueryResolver,
  awayQueryResolver,
  controllerQueryResolver,
  controllerQueryResolvers,
  defaultHoldLengthQueryResolver,
  faultLogsQueryResolvers,
  featureQueryResolver,
  fileQueryResolver,
  locationQueryResolver,
  locationQueryResolvers,
  manufacturerQueryResolver,
  notficationsQueryResolver,
  renameQueryResolver,
  temperaturePresetsQueryResolver,
  userQueryResolver,
];
export const mutationResolvers = [
  appMutationResolver,
  authMutationResolver,
  awayMutationResolver,
  controllerMutationResolver,
  controllerMutationResolvers,
  defaultHoldLengthMutationResolver,
  faultLogsMutationResolvers,
  featureMutationResolver,
  fileMutationResolver,
  locationMutationResolver,
  locationMutationResolvers,
  manufacturerMutationResolver,
  notficationsMutationResolver,
  renameMutationResolver,
  temperaturePresetsMutationResolver,
  userMutationResolver,
];
