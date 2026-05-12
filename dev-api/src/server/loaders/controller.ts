import DataLoader from "dataloader";

import { Loaders } from "./";

import { ControllerRecord, loadControllersByUserId } from "../../fixtures";

export const controllerLoader = (userId?: string): Loaders["controller"] =>
  new DataLoader(async (ids: readonly string[]) => {
    const controllers = userId ? await loadControllersByUserId(userId) : [];
    const controllerMap = new Map<string, ControllerRecord>(
      controllers.map((c) => [c.id, c])
    );

    return ids.map((id) => controllerMap.get(id) ?? null);
  });

export const controllersLoader: Loaders["controllers"] = new DataLoader(
  async (userIds: readonly string[]) => {
    const [userId] = userIds;
    const controllers = await loadControllersByUserId(userId);

    return [controllers];
  },
  { batch: false }
);
