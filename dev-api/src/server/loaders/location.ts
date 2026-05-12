import DataLoader from "dataloader";

import { Loaders } from "./";

import { loadLocationsByUserId, LocationRecord } from "../../fixtures";

export const locationLoader = (userId?: string): Loaders["location"] =>
  new DataLoader(async (ids: readonly string[]) => {
    const userLocations = userId ? await loadLocationsByUserId(userId) : [];
    const userLocationsById = new Map<string, LocationRecord>();
    userLocations.forEach((userLocation) =>
      userLocationsById.set(userLocation.id, userLocation)
    );

    return ids.map((id) => userLocationsById.get(id) ?? null);
  });

export const locationsLoader: Loaders["locations"] = new DataLoader(
  async (userIds: readonly string[]) => {
    const [userId] = userIds;
    const locations = await loadLocationsByUserId(userId);

    return [locations];
  },
  { batch: false }
);
