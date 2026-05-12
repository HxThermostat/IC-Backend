import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  RenameFeature,
} from "../schema";
import { updateController, updateLocation } from "../fixtures";

const RenameFeatures = [RenameFeature.Location, RenameFeature.Controller];

export const resolver: Resolvers = {
  FeatureMap: {
    rename: () => RenameFeatures,
  },
};

export const queryResolver: QueryResolvers = {};

export const mutationResolver: MutationResolvers = {
  renameController: async (_root, { input: { id, name } }, { loaders }) => {
    if (!RenameFeatures.includes(RenameFeature.Controller))
      return { __typename: "NotSupported" };

    const controller = await loaders.controller.load(id);

    if (!controller) {
      return {
        __typename: "NotFound",
      };
    }

    const updated = await updateController(id, { name });
    loaders.controller.clear(id).prime(id, updated);
    loaders.controllers.clearAll();

    return {
      __typename: "RenameControllerSuccess",
      controller: updated,
    };
  },
  renameLocation: async (_root, { input: { id, name } }, { loaders }) => {
    if (!RenameFeatures.includes(RenameFeature.Location))
      return { __typename: "NotSupported" };

    const location = await loaders.location.load(id);

    if (!location) {
      return {
        __typename: "NotFound",
      };
    }

    const updated = await updateLocation(id, { name });
    loaders.location.clear(id).prime(id, updated);
    loaders.locations.clearAll();

    return {
      __typename: "RenameLocationSuccess",
      location: updated,
    };
  },
};
