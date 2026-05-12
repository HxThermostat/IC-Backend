import { merge } from "lodash";

import { MutationResolvers, QueryResolvers, Resolvers } from "../../schema";

import {
  resolver as connectResolver,
  queryResolver as connectQueryResolver,
  mutationResolver as connectMutationResolver,
} from "./connectResolver";

import {
  resolver as nameResolver,
  queryResolver as nameQueryResolver,
  mutationResolver as nameMutationResolver,
} from "./nameResolver";

import {
  resolver as notificationResolver,
  queryResolver as notificationQueryResolver,
  mutationResolver as notificationMutationResolver,
} from "./notificationResolver";

import {
  resolver as temperatureUnitResolver,
  queryResolver as temperatureUnitQueryResolver,
  mutationResolver as temperatureUnitMutationResolver,
} from "./temperatureUnitResolver";

export const resolver: Resolvers = {};
[
  connectResolver,
  nameResolver,
  notificationResolver,
  temperatureUnitResolver,
].map((r) => merge(resolver, r));

export const queryResolver: QueryResolvers = {};
[
  connectQueryResolver,
  nameQueryResolver,
  notificationQueryResolver,
  temperatureUnitQueryResolver,
].map((r) => merge(queryResolver, r));

export const mutationResolver: MutationResolvers = {};
[
  connectMutationResolver,
  nameMutationResolver,
  notificationMutationResolver,
  temperatureUnitMutationResolver,
].map((r) => merge(mutationResolver, r));
