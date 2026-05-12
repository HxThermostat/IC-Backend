import { last, sortBy } from "lodash";
import { Brand } from "utility-types";

import { AylaDevice, Zone } from "../../hx";
import { Day, ScheduleEvent, ScheduleTime } from "../../schema";
import { next } from "../../utils";

export type SerializedEvents = Brand<string, "ScheduleEvents">;

export type Event = Omit<
  ScheduleEvent,
  "__typename" | "nextEvent" | "prevEvent" | "temperaturePreset" | "removable"
> & { endScalar: number; startScalar: number; temperaturePresetId: string };

export type ZoneEvents = { [zone in Zone]: Event[] };

export function defaultEvents(device: AylaDevice): ZoneEvents {
  return {
    0: defaultEventsForZone({ device, zone: 0 }),
    1: defaultEventsForZone({ device, zone: 1 }),
    2: defaultEventsForZone({ device, zone: 2 }),
    3: defaultEventsForZone({ device, zone: 3 }),
    4: defaultEventsForZone({ device, zone: 4 }),
    5: defaultEventsForZone({ device, zone: 5 }),
    6: defaultEventsForZone({ device, zone: 6 }),
    7: defaultEventsForZone({ device, zone: 7 }),
  };
}

function defaultEventsForZone({
  device: { dsn },
  zone,
}: {
  device: AylaDevice;
  zone: Zone;
}): Event[] {
  const days = Object.values(Day);

  const weekdays = [Day.Mon, Day.Tue, Day.Wed, Day.Thu, Day.Fri].map((day) => [
    {
      start: {
        day,
        hour: 6,
        minute: 0,
      },
      end: {
        day,
        hour: 8,
        minute: 0,
      },
      temperaturePresetId: `${dsn}-HOME`,
    },
    {
      start: {
        day,
        hour: 8,
        minute: 0,
      },
      end: {
        day,
        hour: 18,
        minute: 0,
      },
      temperaturePresetId: `${dsn}-AWAY`,
    },
    {
      start: {
        day,
        hour: 18,
        minute: 0,
      },
      end: {
        day,
        hour: 22,
        minute: 0,
      },
      temperaturePresetId: `${dsn}-HOME`,
    },
    {
      start: {
        day,
        hour: 22,
        minute: 0,
      },
      end: {
        day: next(days, day),
        hour: 6,
        minute: 0,
      },
      temperaturePresetId: `${dsn}-SLEEP`,
    },
  ]);

  const weekends = [Day.Sat, Day.Sun].map((day) => [
    {
      start: {
        day,
        hour: 6,
        minute: 0,
      },
      end: {
        day,
        hour: 22,
        minute: 0,
      },
      temperaturePresetId: `${dsn}-HOME`,
    },
    {
      start: {
        day,
        hour: 22,
        minute: 0,
      },
      end: {
        day: next(days, day),
        hour: 6,
        minute: 0,
      },
      temperaturePresetId: `${dsn}-SLEEP`,
    },
  ]);

  return [...weekdays, ...weekends]
    .map((events) =>
      events.reduce<Event[]>(
        (existing, { start, end, temperaturePresetId }) =>
          appendEvent({ dsn, zone, start, end, temperaturePresetId }, existing),
        []
      )
    )
    .flat();
}

function toScalar(day: ScheduleTime): number {
  let dayNum: number;
  switch (day.day) {
    case Day.Sun:
      dayNum = 0;
      break;
    case Day.Mon:
      dayNum = 1;
      break;
    case Day.Tue:
      dayNum = 2;
      break;
    case Day.Wed:
      dayNum = 3;
      break;
    case Day.Thu:
      dayNum = 4;
      break;
    case Day.Fri:
      dayNum = 5;
      break;
    case Day.Sat:
      dayNum = 6;
      break;
  }
  return parseInt([dayNum, day.hour, day.minute].join(""));
}

export function appendEvent(
  {
    dsn,
    zone,
    start,
    end,
    temperaturePresetId,
  }: {
    dsn: string;
    zone: Zone;
    start: ScheduleTime;
    end: ScheduleTime;
    temperaturePresetId: string;
  },
  events: Event[]
): Event[] {
  const day = start.day;
  const lastEvent = last(events);

  const { index: lastIndex } = lastEvent
    ? decodeEventId(lastEvent.id)
    : { index: -1 };

  const event: Event = {
    id: encodeEventId({ dsn, zone, day, index: lastIndex + 1 }),
    start,
    startScalar: toScalar(start),
    end,
    endScalar: toScalar(end),
    day,
    temperaturePresetId,
  };

  return [...events, event];
}

export function decodeEvents(
  events?: SerializedEvents
): ZoneEvents | undefined {
  if (!events) return;

  const decoded = JSON.parse(events) as ZoneEvents;

  const sort = (zoneEvents: Event[]): Event[] =>
    sortBy(zoneEvents, "endScalar");

  return {
    0: sort(decoded[0]),
    1: sort(decoded[1]),
    2: sort(decoded[2]),
    3: sort(decoded[3]),
    4: sort(decoded[4]),
    5: sort(decoded[5]),
    6: sort(decoded[6]),
    7: sort(decoded[7]),
  };
}

export function encodeEvents(events: ZoneEvents): SerializedEvents {
  return JSON.stringify(events) as SerializedEvents;
}

type ScheduleEventId = {
  dsn: string;
  zone: Zone;
  day: Day;
  index: number;
};

function encodeEventId({ dsn, zone, day, index }: ScheduleEventId): string {
  return [dsn, zone, day, index].join("/");
}

export function decodeEventId(id: string): ScheduleEventId {
  const [dsn, zone, day, index] = id.split("/");

  return {
    dsn,
    zone: parseInt(zone) as Zone,
    day: day as Day,
    index: parseInt(index),
  };
}
