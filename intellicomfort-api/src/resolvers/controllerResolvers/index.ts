import { merge } from "lodash";

import { MutationResolvers, QueryResolvers, Resolvers } from "../../schema";

import {
  resolver as fanResolver,
  queryResolver as fanQueryResolver,
  mutationResolver as fanMutationResolver,
} from "./fanResolver";

import {
  resolver as modeResolver,
  queryResolver as modeQueryResolver,
  mutationResolver as modeMutationResolver,
} from "./modeResolver";

import {
  resolver as nameResolver,
  queryResolver as nameQueryResolver,
  mutationResolver as nameMutationResolver,
} from "./nameResolver";

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

export const resolver: Resolvers = {};
[
  fanResolver,
  modeResolver,
  nameResolver,
  scheduleResolver,
  setpointResolver,
].map((r) => merge(resolver, r));

export const queryResolver: QueryResolvers = {};
[
  fanQueryResolver,
  modeQueryResolver,
  nameQueryResolver,
  scheduleQueryResolver,
  setpointQueryResolver,
].map((r) => merge(queryResolver, r));

export const mutationResolver: MutationResolvers = {};
[
  fanMutationResolver,
  modeMutationResolver,
  nameMutationResolver,
  scheduleMutationResolver,
  setpointMutationResolver,
].map((r) => merge(mutationResolver, r));
