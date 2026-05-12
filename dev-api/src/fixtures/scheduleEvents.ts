import { groupBy, sortBy } from "lodash";

import {
  Day,
  ScheduleEvent,
  ScheduleEventAttributes,
  ScheduleEventCreationAttributes,
} from "../data/models/ScheduleEvent";

import { toPOJO, WithoutModel } from "./util";

export type ScheduleEventRecord = WithoutModel<ScheduleEventAttributes>;

export interface ScheduleDayRecord {
  day: Day;
  events: ScheduleEventRecord[];
}

const daySortValue: Record<Day, number> = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};

function sortEvents<T extends ScheduleEventAttributes>(events: T[]): T[] {
  return Object.entries(groupBy(events, (event) => event.controllerId))
    .map(([, controllerEvents]) =>
      sortBy(controllerEvents, (event) => {
        const day = daySortValue[event.startDay];
        const hour = event.startHour.toString().padStart(2, "0");
        const minute = event.startMinute.toString().padStart(2, "0");

        return parseInt(`${day}${hour}${minute}`);
      })
    )
    .flat();
}

export const addScheduleEvent = async (
  scheduleEvent: ScheduleEventCreationAttributes
): Promise<ScheduleEventRecord> =>
  toPOJO(await ScheduleEvent.create(scheduleEvent));

export const loadScheduleEvents = async (
  scheduleEventIds: string[]
): Promise<ScheduleEventRecord[]> =>
  sortEvents(
    await ScheduleEvent.findAll({
      where: {
        id: scheduleEventIds,
      },
    })
  ).map(toPOJO);

export const loadScheduleEventsByUserId = async (
  userId: string
): Promise<ScheduleEventRecord[]> =>
  sortEvents(
    await ScheduleEvent.findAll({
      where: {
        userId,
      },
    })
  ).map(toPOJO);

export const updateScheduleEvent = async (
  id: string,
  change: Partial<ScheduleEventRecord>
): Promise<ScheduleEventRecord> => {
  const found = await ScheduleEvent.findByPk(id);

  if (!found) {
    throw new Error(`Unable to find ScheduleEvent with id: ${id}`);
  }

  return toPOJO(await found.update(change));
};

export const removeScheduleEvent = async (
  id: string
): Promise<ScheduleEventRecord | undefined> => {
  const found = await ScheduleEvent.findByPk(id);

  if (!found) {
    throw new Error(`Unable to find ScheduleEvent with id: ${id}`);
  }

  await found.destroy();

  return toPOJO(found);
};
