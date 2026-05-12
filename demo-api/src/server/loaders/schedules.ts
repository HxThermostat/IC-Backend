import DataLoader from "dataloader";

import type { Loaders } from ".";

import { decodeId } from "../../hx";

export function scheduleEventLoader(
  deviceLoader: Loaders["device"]
): Loaders["scheduleEvent"] {
  return new DataLoader(
    async (eventIds: readonly string[]) => {
      const [eventId] = eventIds;
      const [controllerId] = eventId.split("-");

      const { dsn, zone } = decodeId(controllerId);
      const device = await deviceLoader.load(dsn);

      const event = device?.scheduleEvents[zone].find(
        (event) => event.id === eventId
      );

      return event && device ? [[event, device, zone]] : [];
    },
    { batch: false }
  );
}

export function scheduleEventsLoader(
  deviceLoader: Loaders["device"]
): Loaders["scheduleEvents"] {
  return new DataLoader(
    async (controllerIds: readonly string[]) => {
      const [controllerId] = controllerIds;

      const { dsn, zone } = decodeId(controllerId);

      const device = await deviceLoader.load(dsn);

      if (!device) return [];

      return [device.scheduleEvents[zone]];
    },
    { batch: false }
  );
}
