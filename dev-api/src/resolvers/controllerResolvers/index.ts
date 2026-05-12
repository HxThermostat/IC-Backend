import { merge } from "lodash";

import { MutationResolvers, QueryResolvers, Resolvers } from "../../schema";

import {
  resolver as modeResolver,
  queryResolver as modeQueryResolver,
  mutationResolver as modeMutationResolver,
} from "./modeResolver";

import {
  resolver as scheduleResolver,
  queryResolver as scheduleQueryResolver,
  mutationResolver as scheduleMutationResolver,
} from "./scheduleResolver";

import {
  resolver as setpointResolver,
  queryResolver as setpointQueryResolver,
  mutationResolver as setpointMutationResolver,
} from "./setpointResolver";

import {
  resolver as rangeValueResolver,
  queryResolver as rangeValueQueryResolver,
  mutationResolver as rangeValueMutationResolver,
} from "./rangeValueResolver";

import {
  resolver as fanResolver,
  queryResolver as fanQueryResolver,
  mutationResolver as fanMutationResolver,
} from "./fanResolver";

export const resolver: Resolvers = {};
[
  modeResolver,
  scheduleResolver,
  setpointResolver,
  rangeValueResolver,
  fanResolver,
].map((r) => merge(resolver, r));

export const queryResolver: QueryResolvers = {};
[
  modeQueryResolver,
  scheduleQueryResolver,
  setpointQueryResolver,
  rangeValueQueryResolver,
  fanQueryResolver,
].map((r) => merge(queryResolver, r));

export const mutationResolver: MutationResolvers = {};
[
  modeMutationResolver,
  scheduleMutationResolver,
  setpointMutationResolver,
  rangeValueMutationResolver,
  fanMutationResolver,
].map((r) => merge(mutationResolver, r));
