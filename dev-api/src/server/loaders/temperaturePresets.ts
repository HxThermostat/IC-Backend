import DataLoader from "dataloader";
import { Brand } from "utility-types";

import {
  loadControllersByUserId,
  loadScheduleEventsByUserId,
  loadTemperaturePresetsByUserId,
  TemperaturePresetRecord,
} from "../../fixtures";

import { Loaders } from "./";

// "Branding" a string allows us to use isEncodedVirtualPresetId and
// decodeVirtualPresetId in a typesafe way, e.g.
//
// if (isVirtualPresetId(id)) {
//   const {controllerId} = decodeVirtualPresetId(id)
// }
//
// Without the brand, any string type would be valid. While this
// wouldn't statically break the code as-written, it would introduce
// some pretty unsafe behavior, e.g.
//
// decodeVirtualPresetId("abc123")
//
// will compile, but it will unfortunately throw a runtime error
type EncodedVirtualPresetId = Brand<string, "VirtualPresetId">;

function isEncodedVirtualPresetId(id: unknown): id is EncodedVirtualPresetId {
  if (typeof id !== "string") return false;

  const parts = id.split("--");

  return (
    parts.length === 3 &&
    parts[0].length > 0 &&
    parts[1].length > 0 &&
    parts[2] === "virtual"
  );
}

type VirtualPresetComponents = {
  controllerId: string;
  eventId: string;
};

function isVirtualPresetComponents(id: unknown): id is VirtualPresetComponents {
  if (typeof id === "object" && id != null) {
    return (
      (id as VirtualPresetComponents).controllerId != null &&
      (id as VirtualPresetComponents).eventId != null
    );
  }

  return false;
}

export type VirtualPresetId = VirtualPresetComponents | EncodedVirtualPresetId;

function isVirtualPresetId(id: unknown): id is VirtualPresetId {
  return isVirtualPresetComponents(id) || isEncodedVirtualPresetId(id);
}

function decodeVirtualPresetId(id: VirtualPresetId): VirtualPresetComponents {
  if (isVirtualPresetComponents(id)) return id;

  const [controllerId, eventId] = id.split("--");

  return {
    controllerId,
    eventId,
  };
}

function encodeVirtualPresetId(id: VirtualPresetId): string {
  if (isVirtualPresetComponents(id)) {
    return `${id.controllerId}--${id.eventId}--virtual`;
  }
  return id;
}

function isTemperaturePresetRecord(
  record: unknown
): record is TemperaturePresetRecord {
  if (typeof record === "object" && record != null) {
    return !!(record as TemperaturePresetRecord).id;
  }
  return false;
}

const toMap = async <T extends { id: string }>(
  records: Promise<T[]>
): Promise<Map<string, T>> =>
  new Map<string, T>((await records).map((p) => [p.id, p]));

export const temperaturePresetLoader = (
  userId?: string
): Loaders["temperaturePreset"] =>
  new DataLoader(async (ids: readonly (string | VirtualPresetId)[]) => {
    // NOTE(nleach): If we move away from the Fixture abstraction and
    // interact with the underlying Sequelize models in the loaders,
    // this code could be dramatically simplified

    if (!userId) return [];

    const hasVirtualPresetIds = ids.some(
      (id) => isVirtualPresetId(id) || isEncodedVirtualPresetId(id)
    );

    // If this batch of IDs contains any virtual presets, we also need
    // to load up the relevant Controller and ScheduleEvent records
    const [temperaturePresets, controllers, events] = await Promise.all(
      hasVirtualPresetIds
        ? [
            toMap(loadTemperaturePresetsByUserId(userId)),
            toMap(loadControllersByUserId(userId)),
            toMap(loadScheduleEventsByUserId(userId)),
          ]
        : [
            toMap(loadTemperaturePresetsByUserId(userId)),
            toMap(Promise.resolve([])),
            toMap(Promise.resolve([])),
          ]
    );

    return ids.map((id) => {
      if (isVirtualPresetId(id)) {
        const { controllerId, eventId } = decodeVirtualPresetId(id);

        const controller = controllers.get(controllerId);
        const event = events.get(eventId);

        return controller && event && event.setpointType
          ? {
              id: isVirtualPresetId(id) ? encodeVirtualPresetId(id) : id,
              locationId: controller.locationId,
              name: "Thermostat",
              userId: event.userId,
              setpointLower: event.setpointLower,
              setpointUpper: event.setpointUpper,
              setpointTarget: event.setpointTarget,
              setpointType: event.setpointType,
              fanMode: event.fanMode,
              slot: null,
            }
          : null;
      } else {
        return temperaturePresets.get(id) ?? null;
      }
    });
  });

export const temperaturePresetsLoader = (
  temperaturePresetLoader: Loaders["temperaturePreset"]
): Loaders["temperaturePresets"] =>
  new DataLoader(
    async (userIds: readonly string[]) => {
      const [userId] = userIds;
      const [scheduleEvents, temperaturePresets] = await Promise.all([
        loadScheduleEventsByUserId(userId),
        loadTemperaturePresetsByUserId(userId),
      ]);

      const temperaturePresetIds = temperaturePresets.map(({ id }) => id);
      const virtualPresetIds = scheduleEvents
        .filter(({ temperaturePresetId }) => temperaturePresetId == null)
        .map(({ controllerId, id: eventId }) => ({
          controllerId,
          eventId,
        }));

      const allPresets: TemperaturePresetRecord[] = [];

      // Defer to the individual temperaturePresetLoader because it
      // already has the logic to build the virtual presets
      (
        await temperaturePresetLoader.loadMany([
          ...temperaturePresetIds,
          ...virtualPresetIds,
        ])
      ).map((preset) => {
        if (isTemperaturePresetRecord(preset)) {
          allPresets.push(preset);
        }
      });

      return [allPresets];
    },
    { batch: false }
  );
