import { Alert } from "react-native";

import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

import {
  BackgroundAwayActiveStatusDocument,
  BackgroundAwayActiveStatusQuery,
  BackgroundAwayActiveStatusQueryVariables,
  ToggleLocationAwayDocument,
  ToggleLocationAwayMutation,
  ToggleLocationAwayMutationVariables,
  client,
} from "~/graph";

import i18n from "~/i18n";

import {
  loadFromAsyncStorage,
  saveToAsyncStorage,
  buildGeofenceStorageKey,
} from "~/utils/storage";
import { GEOFENCE_LEAVE } from "~/utils/notifications";
import { trackSegmentEvent } from "~/utils/kohort";

const GEOFENCE_EVENT_DEBOUNCE = 15 * 1000;

const scope = "Notifications.geofence";

export interface GeofenceTaskResult {
  data: {
    eventType?: Location.GeofencingEventType;
    region?: Location.LocationRegion;
  };
  error: TaskManager.TaskManagerError | null;
}

export const GEOFENCE_TASK = "GEOFENCE";

type Region = {
  identifier: string;
  latitude: number;
  longitude: number;
  radius: number;
};

// Keep an in-memory representation of recent geofence events to do
// some very limited deboucning. We want to keep this in-memory (as
// opposed to using AsyncStorage) because we purposefully don't want
// to have foreground handling interfere with background handling (and
// vise-versa)
const locationUpdates = new Map<
  { locationId: string; eventType: Location.GeofencingEventType },
  Date
>();

// Starts the geofence, or adds this location to the existing geofences.
export async function addRegion(region: Region): Promise<void> {
  // load potential existing geofences
  const geofenceTaskOptions = await TaskManager.getTaskOptionsAsync<{
    regions: Location.LocationRegion[] | null;
  } | null>(GEOFENCE_TASK);

  const regionMap = new Map<string, Location.LocationRegion>();

  regionMap.set(region.identifier, {
    ...region,
    notifyOnEnter: true,
    notifyOnExit: true,
  });

  (geofenceTaskOptions?.regions ?? []).forEach((r) => {
    // Filter out invalid regions
    if (!r.identifier) return;
    if (regionMap.has(r.identifier)) return;

    regionMap.set(r.identifier, r);
  });

  // (re)start the geofencing task with the new region
  await Location.startGeofencingAsync(
    GEOFENCE_TASK,
    Array.from(regionMap.values())
  );
}

// Stops the geofence entirely, or restarts the geofence without this location.
export async function removeRegion(identifier: string): Promise<void> {
  const registered = await TaskManager.isTaskRegisteredAsync(GEOFENCE_TASK);
  if (!registered) return;

  // load potential existing geofences
  const geofenceTaskOptions = await TaskManager.getTaskOptionsAsync<{
    regions: Location.LocationRegion[] | null;
  } | null>(GEOFENCE_TASK);

  const regions =
    geofenceTaskOptions?.regions?.filter(
      (region) => region.identifier !== identifier
    ) ?? [];

  regions.forEach((r) => {
    if (!r.identifier) return;
  });

  if (regions.length) {
    // continue geofencing other regions by restarting task with new options
    await Location.startGeofencingAsync(GEOFENCE_TASK, regions);
  } else {
    // stop the geofence task altogether
    await Location.stopGeofencingAsync(GEOFENCE_TASK);
  }
}

const changeAway = async (
  locationId: string,
  active: boolean
): Promise<void> => {
  await client.mutate<
    ToggleLocationAwayMutation,
    ToggleLocationAwayMutationVariables
  >({
    mutation: ToggleLocationAwayDocument,
    variables: { input: { id: locationId, active } },
  });
};

const isAway = async (locationId: string): Promise<boolean> => {
  const { data } = await client.query<
    BackgroundAwayActiveStatusQuery,
    BackgroundAwayActiveStatusQueryVariables
  >({
    variables: {
      locationId,
    },
    query: BackgroundAwayActiveStatusDocument,
    fetchPolicy: "network-only",
  });

  return Boolean(data?.location?.awayActive);
};

export const handleGeofenceEvent = async (
  { data: { eventType, region }, error }: GeofenceTaskResult,
  mode: "background" | "foreground" = "background"
): Promise<void> => {
  if (error) return;
  if (!region?.identifier) return;
  if (!eventType) return;

  const locationId = region.identifier;
  const storageKey = buildGeofenceStorageKey(locationId);

  const lastEvent = await loadFromAsyncStorage(storageKey);

  const debounceKey = { locationId, eventType };
  const lastUpdate = locationUpdates.get(debounceKey);
  const thisUpdate = new Date();
  if (
    lastUpdate &&
    thisUpdate.valueOf() - lastUpdate.valueOf() < GEOFENCE_EVENT_DEBOUNCE
  ) {
    return;
  }
  locationUpdates.set(debounceKey, thisUpdate);

  void saveToAsyncStorage(storageKey, eventType);

  switch (eventType) {
    case Location.GeofencingEventType.Enter:
      trackSegmentEvent("GeofenceEnterTriggered", { mode });

      // We only want to disable away mode if the user was previously away
      if (lastEvent === Location.GeofencingEventType.Exit) {
        await changeAway(locationId, false);
      }
      break;
    case Location.GeofencingEventType.Exit: {
      trackSegmentEvent("GeofenceExitTriggered", { mode });
      if (await isAway(locationId)) return;

      // If this check was triggered by foreground user behavior, we
      // should show an Alert instead of a notification
      if (mode === "foreground") {
        Alert.alert(
          i18n.t("leave.alert.title", { scope }),
          i18n.t("leave.alert.message", { scope }),
          [
            {
              style: "cancel",
              text: i18n.t("leave.alert.cancelButton", { scope }),
            },
            {
              style: "default",
              text: i18n.t("leave.alert.enableButton", { scope }),
              onPress: () => changeAway(locationId, true),
            },
          ]
        );
      } else {
        const data: GEOFENCE_LEAVE = {
          type: "GEOFENCE_LEAVE",
          locationId: region?.identifier,
        };

        void Notifications.scheduleNotificationAsync({
          content: {
            title: i18n.t("leave.title", { scope }),
            body: i18n.t("leave.body", { scope }),
            data,
          },
          trigger: null,
        });
      }
      break;
    }
    default:
      break;
  }
};

type Coordinate = {
  latitude: number;
  longitude: number;
};

// https://stackoverflow.com/a/24680708
const isPointWithinRadius = (
  point: Coordinate,
  center: Coordinate,
  radius: number
): boolean => {
  const ky = (40000 * 1000) / 360;
  const kx = Math.cos((Math.PI * center.latitude) / 180.0) * ky;
  const dx = Math.abs(center.longitude - point.longitude) * kx;
  const dy = Math.abs(center.latitude - point.latitude) * ky;
  return Math.sqrt(dx * dx + dy * dy) <= radius;
};

export async function checkGeofence(locationId: string): Promise<void> {
  // Ensure we have (some) Location permission
  const { granted } = await Location.getPermissionsAsync();

  if (!granted) return;

  const geofenceTaskOptions = await TaskManager.getTaskOptionsAsync<{
    regions: Location.LocationRegion[] | null;
  } | null>(GEOFENCE_TASK);

  const region = (geofenceTaskOptions?.regions ?? []).find(
    (region) => region.identifier === locationId
  );

  if (!region) return;

  let currentLocation = await Location.getLastKnownPositionAsync({
    maxAge: 5 * 60 * 1000,
    requiredAccuracy: region.radius / 4,
  });

  if (!currentLocation) {
    currentLocation = await Location.getCurrentPositionAsync();
  }

  if (!currentLocation) return;

  const eventType = isPointWithinRadius(
    currentLocation.coords,
    region,
    region.radius
  )
    ? Location.GeofencingEventType.Enter
    : Location.GeofencingEventType.Exit;

  await handleGeofenceEvent(
    { data: { eventType, region }, error: null },
    "foreground"
  );
}

export const currentGeofence = async (
  locationId: string
): Promise<Location.LocationRegion | null> => {
  const registered = await TaskManager.isTaskRegisteredAsync(GEOFENCE_TASK);

  if (!registered) return null;

  const options = await TaskManager.getTaskOptionsAsync<{
    regions: Location.LocationRegion[];
  } | null>(GEOFENCE_TASK);

  return options?.regions.find((r) => r.identifier === locationId) ?? null;
};
