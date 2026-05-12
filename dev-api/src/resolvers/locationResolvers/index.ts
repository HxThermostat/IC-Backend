import { merge } from "lodash";

import { MutationResolvers, QueryResolvers, Resolvers } from "../../schema";

import {
  resolver as connectResolver,
  queryResolver as connectQueryResolver,
  mutationResolver as connectMutationResolver,
} from "./connectResolver";

import {
  resolver as temperatureUnitResolver,
  queryResolver as temperatureUnitQueryResolver,
  mutationResolver as temperatureUnitMutationResolver,
} from "./temperatureUnitResolver";

export const resolver: Resolvers = {};
[connectResolver, temperatureUnitResolver].map((r) => merge(resolver, r));

export const queryResolver: QueryResolvers = {};
[connectQueryResolver, temperatureUnitQueryResolver].map((r) =>
  merge(queryResolver, r)
);

export const mutationResolver: MutationResolvers = {};
[connectMutationResolver, temperatureUnitMutationResolver].map((r) =>
  merge(mutationResolver, r)
);
