import DataLoader from "dataloader";

import { Loaders } from "./";

import {
  loadScheduleEventsByUserId,
  ScheduleEventRecord,
} from "../../fixtures";

export const scheduleEventLoader = (
  userId?: string
): Loaders["scheduleEvent"] =>
  new DataLoader(async (ids: readonly string[]) => {
    const events = userId ? await loadScheduleEventsByUserId(userId) : [];

    const eventsMap = new Map<string, ScheduleEventRecord>(
      events.map((e) => [e.id, e])
    );

    return ids.map((id) => eventsMap.get(id) ?? null);
  });

export const scheduleEventsLoader: Loaders["scheduleEvents"] = new DataLoader(
  async (userIds: readonly string[]) => {
    const [userId] = userIds;

    if (!userId) return [];

    const events = await loadScheduleEventsByUserId(userId);

    return [events];
  },
  { batch: false }
);
