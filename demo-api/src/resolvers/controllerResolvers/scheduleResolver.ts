import { AuthenticationError } from "apollo-server-errors";

import { isAuthenticationError, writeMetadata } from "ayla-client";
import { groupBy } from "lodash";

import {
  decodeSysStg,
  decodeOverrideStg,
  decodeTmpOvrSt,
  zoneProperty,
  setMetadata,
  enhanceAylaDevice,
  decodeEventId,
  decodeId,
  Event,
  encodeEvents,
  ZoneEvents,
  appendEvent,
  Device,
  Zone,
  isDevice,
  mapZones,
} from "../../hx";

import {
  Day,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  ScheduleFeature,
  ScheduleEventMapper,
} from "../../schema";

import { Loaders } from "../../server/loaders";

import { next, prev, propagateErrors } from "../../utils";

import { NotFound, ResolverNotImplemented } from "../errors";

async function writeSchedule({
  device,
  zone,
  add,
  update,
  remove,
  accessToken,
  loaders,
}: {
  device: Device;
  zone: Zone;
  add?: Pick<Event, "start" | "end" | "temperaturePresetId">;
  update?: Partial<Event> & Pick<Event, "id">;
  remove?: Event["id"];
  accessToken: string;
  loaders: Loaders;
}): Promise<ScheduleEventMapper | undefined> {
  let scheduleEvent: Event | undefined = undefined;
  let events: ZoneEvents | undefined = undefined;

  if (add) {
    const zoneEvents = appendEvent(
      { dsn: device.dsn, zone, ...add },
      device.scheduleEvents[zone]
    );

    scheduleEvent = zoneEvents[zoneEvents.length - 1];

    events = {
      ...device.scheduleEvents,
      [zone]: zoneEvents,
    };
  } else if (remove) {
    events = {
      ...device.scheduleEvents,
      [zone]: device.scheduleEvents[zone].filter(
        (event) => event.id === remove
      ),
    };
  } else if (update) {
    events = {
      ...device.scheduleEvents,
      [zone]: device.scheduleEvents[zone].map((event) => {
        if (event.id === update.id) {
          scheduleEvent = { ...event, ...update };
          return scheduleEvent;
        }
        return event;
      }),
    };
  }

  if (!events) return;

  await writeMetadata({
    dsn: device.dsn,
    ...setMetadata(device.metadata, "ScheduleEvents", encodeEvents(events)),
    accessToken,
  });

  loaders.device.clear(device.dsn).prime(device.dsn, enhanceAylaDevice(device));

  // We need to find the "same" event from device.scheduleEvents
  // because next() and prev() use object equality tests
  scheduleEvent = device.scheduleEvents[zone].find(
    (event) => event.id === scheduleEvent?.id
  );

  if (!scheduleEvent) return;

  return [scheduleEvent, device.scheduleEvents[zone]];
}

export const resolver: Resolvers = {
  FeatureMap: {
    schedule: () => ScheduleFeature.ScheduleTemperature,
  },
  Controller: {
    activeHold: ({ properties, zone }) => {
      if (!decodeSysStg(properties.SysStg).programmable) return null;

      if (decodeTmpOvrSt(properties.TmpOvrSt)[zone]) {
        const overrideSetting = decodeOverrideStg(
          zoneProperty(properties, "OverrideStg", zone)
        );
        switch (overrideSetting.type) {
          case "Hours":
            return {
              __typename: "HoldLengthHours",
              hours: overrideSetting.hours,
            };
          case "NextEvent":
            return {
              __typename: "HoldLengthNextEvent",
            };
          case "Cancelled":
            return {
              __typename: "HoldLengthIndefinite",
            };
          default:
            return null;
        }
      }

      return null;
    },
    schedule: ({ zone, scheduleEvents }) => scheduleEvents[zone],
  },
  Schedule: {
    days: (events) =>
      Object.values(groupBy(events, (event) => event.start.day)),
    sunday: (events) => events.filter((e) => e.start.day === Day.Sun),
    monday: (events) => events.filter((e) => e.start.day === Day.Mon),
    tuesday: (events) => events.filter((e) => e.start.day === Day.Tue),
    wednesday: (events) => events.filter((e) => e.start.day === Day.Wed),
    thursday: (events) => events.filter((e) => e.start.day === Day.Thu),
    friday: (events) => events.filter((e) => e.start.day === Day.Fri),
    saturday: (events) => events.filter((e) => e.start.day === Day.Sat),
    minEvents: () => 0,
    maxEvents: () => 4,
    minEventInterval: () => 15,
  },
  ScheduleDay: {
    day: ([event]) => event.day,
    events: (events) => events.map((event) => [event, events]),
    full: (events) => events.length === 4,
  },
  ScheduleEvent: {
    id: ([{ id }]) => id,
    day: ([{ day }]) => day,
    removable: () => false,
    start: ([{ start }]) => start,
    end: ([{ end }]) => end,
    nextEvent: ([event, events]) => [next(events, event), events],
    prevEvent: ([event, events]) => [prev(events, event), events],
    temperaturePreset: async ([{ temperaturePresetId }], _, { loaders }) => {
      const preset = await loaders.temperaturePreset.load(temperaturePresetId);

      if (!preset)
        throw new Error(`Could not load preset: ${temperaturePresetId}`);

      return preset;
    },
  },
};

export const mutationResolver: MutationResolvers = {
  cancelHold: ResolverNotImplemented(),
  addScheduleEvent: async (
    _,
    { input: { id: controllerId, start, end, temperaturePresetId } },
    { loaders, user }
  ) => {
    if (!user) throw new AuthenticationError("Must be signed in");
    const { dsn, zone } = decodeId(controllerId);
    const device = await loaders.device.load(dsn);

    if (!device) return NotFound();

    if (!temperaturePresetId) return NotFound();

    const scheduleEvent = await writeSchedule({
      device,
      zone,
      add: { start, end, temperaturePresetId },
      accessToken: user.accessToken,
      loaders,
    });

    if (!scheduleEvent) return NotFound();

    return {
      __typename: "AddScheduleEventSuccess",
      controller: { ...device, zone },
      scheduleEvent,
    };
  },
  removeScheduleEvent: async (
    _,
    { input: { scheduleEventId: id } },
    { loaders, user }
  ) => {
    if (!user) throw new AuthenticationError("Must be signed in");
    const { dsn, zone } = decodeEventId(id);
    const device = await loaders.device.load(dsn);

    if (!device) return NotFound();

    await writeSchedule({
      device,
      zone,
      remove: id,
      accessToken: user.accessToken,
      loaders,
    });

    return {
      __typename: "RemoveScheduleEventSuccess",
      controller: { ...device, zone },
    };
  },
  changeScheduleEventTime: async (
    _,
    { input: { id, start, end } },
    { loaders, user }
  ) => {
    if (!user) throw new AuthenticationError("Must be signed in");
    const { dsn, zone } = decodeEventId(id);
    const device = await loaders.device.load(dsn);

    if (!device) return NotFound();

    const scheduleEvent = await writeSchedule({
      device,
      zone,
      update: { id, start, end },
      accessToken: user.accessToken,
      loaders,
    });

    if (!scheduleEvent) return NotFound();

    return {
      __typename: "ChangeScheduleEventTimeSuccess",
      scheduleEvent,
    };
  },
  changeScheduleEventTemperaturePreset: async (
    _,
    { input: { id, temperaturePresetId } },
    { loaders, user }
  ) => {
    if (!user) throw new AuthenticationError("Must be signed in");

    const { dsn, zone } = decodeEventId(id);
    const device = await loaders.device.load(dsn);

    if (!device) return NotFound();

    const preset = device.temperaturePresets.find(
      (preset) => preset.id === temperaturePresetId
    );

    if (!preset) return NotFound();

    const scheduleEvent = await writeSchedule({
      device,
      zone,
      update: { id, temperaturePresetId },
      accessToken: user.accessToken,
      loaders,
    });

    if (!scheduleEvent) return NotFound();

    return {
      __typename: "ChangeScheduleEventTemperaturePresetSuccess",
      scheduleEvent,
    };
  },
};

export const queryResolver: QueryResolvers = {
  scheduleEvent: async (_, { id }, { loaders }) => {
    // This is a bit of a hack because we shouldn't need to know the
    // structure of the event ID
    const [controllerId] = id.split("-");

    const scheduleEvents = await loaders.scheduleEvents.load(controllerId);
    const event = scheduleEvents.find((event) => event.id === id);

    if (!event) return null;

    return [event, scheduleEvents];
  },
  scheduleEvents: async (_, __, { loaders, user }) => {
    if (!user) return [];
    const dsns = await loaders.devices.load(user.id);

    const scheduleEvents: ScheduleEventMapper[] = [];

    const devices = propagateErrors(
      await loaders.device.loadMany(dsns),
      isAuthenticationError
    );

    devices.forEach((device) => {
      if (isDevice(device)) {
        mapZones((zone) =>
          device.scheduleEvents[zone].forEach((event, _, events) => {
            scheduleEvents.push([event, events]);
          })
        );
      }
    });

    return scheduleEvents;
  },
};
