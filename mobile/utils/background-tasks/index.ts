import { defineTask } from "expo-task-manager";
import { GEOFENCE_TASK, handleGeofenceEvent } from "./geofencing";

export * from "./geofencing";

export const startBackgroundTasks = (): void => {
  // defineTask isn't happy if our callback is asynchronous, but I think this is just a typings issue, and not an actual problem.
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  defineTask(GEOFENCE_TASK, handleGeofenceEvent);
};
