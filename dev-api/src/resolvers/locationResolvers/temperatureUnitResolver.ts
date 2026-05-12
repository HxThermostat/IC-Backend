import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  TemperatureUnit,
  ChangeTemperatureUnitFeature,
} from "../../schema";
import { updateLocation } from "../../fixtures";

export const resolver: Resolvers = {
  FeatureMap: {
    changeTemperatureUnit: () => ChangeTemperatureUnitFeature.AppOnly,
  },
  Location: {
    temperatureUnit: ({ temperatureUnit }) =>
      temperatureUnit === "C" ? TemperatureUnit.C : TemperatureUnit.F,
  },
};

export const queryResolver: QueryResolvers = {};

export const mutationResolver: MutationResolvers = {
  changeTemperatureUnit: async (
    _root,
    { input: { id, temperatureUnit } },
    { loaders }
  ) => {
    const location = await loaders.location.load(id);

    if (!location) {
      return {
        __typename: "NotFound",
      };
    }

    const updated = await updateLocation(id, {
      temperatureUnit,
    });

    loaders.location.clear(id).prime(id, updated);
    loaders.locations.clearAll();
    return {
      __typename: "ChangeTemperatureUnitSuccess",
      location: updated,
    };
  },
};
