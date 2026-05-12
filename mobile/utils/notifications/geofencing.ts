export type GEOFENCE_LEAVE = {
  type: "GEOFENCE_LEAVE";
  locationId: string;
};

export type GEOFENCE_NOTIFICATIONS = GEOFENCE_LEAVE;

export function isGeofenceNotification(
  data: unknown
): data is GEOFENCE_NOTIFICATIONS {
  if (!data) return false;

  const d = data as GEOFENCE_NOTIFICATIONS;

  return ["GEOFENCE_LEAVE"].includes(d.type) && !!d.locationId;
}
