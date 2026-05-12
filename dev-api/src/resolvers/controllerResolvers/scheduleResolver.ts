import { groupBy, omit } from "lodash";

import {
  updateController,
  addScheduleEvent,
  removeScheduleEvent,
  ScheduleEventRecord,
  updateScheduleEvent,
} from "../../fixtures";

import {
  Day,
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  ScheduleFeature,
} from "../../schema";

import { fromSchemaDay, getSchemaDay, nextDay } from "../../utils/schedule";

const MIN_EVENTS = 1;
const MAX_EVENTS = 4;
// https://github.com/react-native-datetimepicker/datetimepicker#minuteinterval-optional client lib has some restrictions, fyi
const MIN_EVENT_INTERVAL = 15;

export const enabled = ScheduleFeature.ScheduleTemperatureFan;

export const resolver: Resolvers = {
  FeatureMap: {
    schedule: () => enabled,
  },
  ScheduleEvent: {
    id: ({ id }) => id,
    day: ({ startDay }) => getSchemaDay(startDay),
    removable: async ({ controllerId, startDay }, __, { loaders, user }) => {
      if (!user) return false;
      const allEvents = await loaders.scheduleEvents.load(user.id);
      const controllerEvents = allEvents.filter(
        (e) => e.controllerId === controllerId
      );
      const dayEvents = controllerEvents.filter((e) => e.startDay === startDay);
      return dayEvents.length - 1 >= MIN_EVENTS;
    },
    start: ({ startDay, startHour, startMinute }) => ({
      day: getSchemaDay(startDay),
      hour: startHour,
      minute: startMinute,
    }),
    end: ({ endDay, endHour, endMinute }) => ({
      day: getSchemaDay(endDay),
      hour: endHour,
      minute: endMinute,
    }),
    nextEvent: async (scheduleEvent, _, { loaders, user }) => {
      if (!user) return scheduleEvent;

      const allEvents = await loaders.scheduleEvents.load(user.id);
      const controllerEvents = allEvents.filter(
        (e) => e.controllerId === scheduleEvent.controllerId
      );

      const index = controllerEvents.findIndex(
        (e) => e.id === scheduleEvent.id
      );

      return controllerEvents[index + 1] ?? controllerEvents[0];
    },
    prevEvent: async (scheduleEvent, _, { loaders, user }) => {
      if (!user) return scheduleEvent;

      const allEvents = await loaders.scheduleEvents.load(user.id);
      const controllerEvents = allEvents.filter(
        (e) => e.controllerId === scheduleEvent.controllerId
      );

      const index = controllerEvents.findIndex(
        (e) => e.id === scheduleEvent.id
      );

      return (
        controllerEvents[index - 1] ??
        controllerEvents[controllerEvents.length - 1]
      );
    },
  },
  ScheduleDay: {
    full: (events) => events.length >= MAX_EVENTS,
    day: ([event]) => getSchemaDay(event.startDay),
    events: (events) => events,
  },
  Schedule: {
    days: (events) => Object.values(groupBy(events, (event) => event.startDay)),
    sunday: (events) => events.filter((e) => e.startDay === Day.Sun),
    monday: (events) => events.filter((e) => e.startDay === Day.Mon),
    tuesday: (events) => events.filter((e) => e.startDay === Day.Tue),
    wednesday: (events) => events.filter((e) => e.startDay === Day.Wed),
    thursday: (events) => events.filter((e) => e.startDay === Day.Thu),
    friday: (events) => events.filter((e) => e.startDay === Day.Fri),
    saturday: (events) => events.filter((e) => e.startDay === Day.Sat),
    minEvents: () => MIN_EVENTS,
    maxEvents: () => MAX_EVENTS,
    minEventInterval: () => MIN_EVENT_INTERVAL,
  },
  Controller: {
    schedule: async (controller, _, { user, loaders }) => {
      if (!user) return [];

      return (await loaders.scheduleEvents.load(user.id)).filter(
        (event) => event.controllerId === controller.id
      );
    },
    activeHold: (controller) => {
      if (!controller.holdActive) return null;

      switch (controller.holdLengthType) {
        case "Indefinite":
          return {
            __typename: "HoldLengthIndefinite",
          };
        case "NextEvent":
          return {
            __typename: "HoldLengthNextEvent",
          };
        case "Hours":
          return {
            __typename: "HoldLengthHours",
            hours: controller.holdLengthHours,
          };
        case "Date":
          return {
            __typename: "HoldLengthDate",
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            date: controller.holdLengthDate!,
          };
        default:
          return null;
      }
    },
  },
};

export const queryResolver: QueryResolvers = {
  scheduleEvent: (_root, { id }, { loaders }) => loaders.scheduleEvent.load(id),

  scheduleEvents: (_root, _args, { user, loaders }) => {
    if (!user) return [];

    return loaders.scheduleEvents.load(user.id);
  },
};

export const mutationResolver: MutationResolvers = {
  addScheduleEvent: async (
    _,
    { input: { id, start, end, temperaturePresetId } },
    { loaders, user }
  ) => {
    if (!user) return { __typename: "NotFound" };

    const controller = await loaders.controller.load(id);
    if (!controller) return { __typename: "NotFound" };

    const { day: startDay, hour: startHour, minute: startMinute } = start;
    const { day: endDay, hour: endHour, minute: endMinute } = end;

    const eventsForDay = (await loaders.scheduleEvents.load(user.id)).filter(
      (event) => {
        return event.controllerId === id && event.startDay === startDay;
      }
    ).length;

    if (eventsForDay === MAX_EVENTS) return { __typename: "ScheduleFull" };

    const newEvent = {
      controllerId: id,
      userId: user.id,
      startDay,
      startHour,
      startMinute,
      endDay,
      endHour,
      endMinute,
      temperaturePresetId: temperaturePresetId ?? undefined,
    };

    const added = await addScheduleEvent(newEvent);

    loaders.scheduleEvents.clearAll();

    return {
      __typename: "AddScheduleEventSuccess",
      controller: controller,
      scheduleEvent: added,
    };
  },
  changeScheduleEventTime: async (
    _,
    { input: { id, start, end } },
    { loaders }
  ) => {
    const scheduleEvent = await loaders.scheduleEvent.load(id);
    if (!scheduleEvent) return { __typename: "NotFound" };

    const controller = await loaders.controller.load(
      scheduleEvent.controllerId
    );
    if (!controller) return { __typename: "NotFound" };

    const { day: startDay, hour: startHour, minute: startMinute } = start;
    const { day: endDay, hour: endHour, minute: endMinute } = end;

    const updated = await updateScheduleEvent(id, {
      startDay,
      startHour,
      startMinute,
      endDay,
      endHour,
      endMinute,
    });

    loaders.scheduleEvent.clear(id);

    return {
      __typename: "ChangeScheduleEventTimeSuccess",
      scheduleEvent: updated,
    };
  },
  changeScheduleEventTemperaturePreset: async (
    _,
    { input: { id, temperaturePresetId } },
    { loaders }
  ) => {
    if (!temperaturePresetId) return { __typename: "NotFound" };

    const scheduleEvent = await loaders.scheduleEvent.load(id);
    if (!scheduleEvent) return { __typename: "NotFound" };

    const controller = await loaders.controller.load(
      scheduleEvent.controllerId
    );
    if (!controller) return { __typename: "NotFound" };

    const isVirtualPreset = !scheduleEvent.temperaturePresetId;

    let change: Partial<ScheduleEventRecord> = {
      temperaturePresetId: isVirtualPreset ? null : temperaturePresetId,
    };

    // if the current event has a virtual preset, but the incoming one is not
    // remove virtual-preset attributes
    if (isVirtualPreset && !temperaturePresetId?.includes("virtual")) {
      change = {
        temperaturePresetId,
        setpointLower: null,
        fanMode: null,
        setpointType: null,
        setpointUpper: null,
        setpointTarget: null,
      };
    }

    const updated = await updateScheduleEvent(scheduleEvent.id, change);

    loaders.scheduleEvent.clear(id);

    return {
      __typename: "ChangeScheduleEventTemperaturePresetSuccess",
      scheduleEvent: updated,
    };
  },
  copySchedule: async (
    _,
    { input: { id, source, destination: destinations } },
    { loaders, user }
  ) => {
    if (!user) return { __typename: "NotFound" };

    const controller = await loaders.controller.load(id);
    if (!controller) return { __typename: "NotFound" };

    const events = await loaders.scheduleEvents.load(user.id);
    const controllerEvents = events.filter(
      (event) => event.controllerId === controller.id
    );

    const sourceRecords = controllerEvents.filter(
      (s) => getSchemaDay(s.startDay) === source
    );

    const toRemove = controllerEvents
      .filter((e) => destinations.includes(getSchemaDay(e.startDay)))
      .map((e) => e.id);

    await Promise.all(
      sourceRecords
        .map((source) =>
          destinations.map((destination) =>
            addScheduleEvent({
              ...omit(source, "id"),
              startDay: fromSchemaDay(destination),
              endDay:
                source.startDay === source.endDay
                  ? fromSchemaDay(destination)
                  : fromSchemaDay(nextDay(destination)),
            })
          )
        )
        .flat()
    );

    await Promise.all(toRemove.map((id) => removeScheduleEvent(id)));

    loaders.scheduleEvents.clearAll();

    return {
      __typename: "CopyScheduleSuccess",
      controller: controller,
    };
  },
  removeScheduleEvent: async (
    _,
    { input: { id, scheduleEventId } },
    { loaders }
  ) => {
    const controller = await loaders.controller.load(id);
    if (!controller) return { __typename: "NotFound" };

    await removeScheduleEvent(scheduleEventId);

    loaders.scheduleEvents.clearAll();

    return {
      __typename: "RemoveScheduleEventSuccess",
      controller: controller,
    };
  },
  cancelHold: async (_, { input: { id } }, { loaders }) => {
    const controller = await loaders.controller.load(id);

    if (!controller) return { __typename: "NotFound" };

    const updated = await updateController(controller.id, {
      holdActive: false,
    });

    return {
      __typename: "CancelHoldSuccess",
      controller: updated,
    };
  },
};
