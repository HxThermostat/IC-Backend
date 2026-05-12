export type ALERT_CONTROLLER_TEMPERATURE = {
  type: "CONTROLLER_TEMPERATURE_NOTIFICATION";
  controllerId: string;
  locationId: string;
};

export type ALERT_CONTROLLER_HUMIDITY = {
  type: "CONTROLLER_HUMIDITY_NOTIFICATION";
  controllerId: string;
  locationId: string;
};

export type ALERT_LOCATION_FAULT = {
  type: "LOCATION_FAULT_NOTIFICATION";
  locationId: string;
};

export type ALERT_LOCATION_TEMPERATURE = {
  type: "LOCATION_TEMPERATURE_NOTIFICATION";
  controllerId: string;
  locationId: string;
};

export type ALERT_LOCATION_HUMIDITY = {
  type: "LOCATION_HUMIDITY_NOTIFICATION";
  controllerId: string;
  locationId: string;
};

export type ALERT_NOTIFICATIONS =
  | ALERT_CONTROLLER_TEMPERATURE
  | ALERT_CONTROLLER_HUMIDITY
  | ALERT_LOCATION_FAULT
  | ALERT_LOCATION_TEMPERATURE
  | ALERT_LOCATION_HUMIDITY;

export function isAlertNotification(
  data: unknown
): data is ALERT_NOTIFICATIONS {
  if (!data) return false;

  const d = data as ALERT_NOTIFICATIONS;

  return (
    [
      "CONTROLLER_TEMPERATURE_NOTIFICATION",
      "CONTROLLER_HUMIDITY_NOTIFICATION",
      "LOCATION_FAULT_NOTIFICATION",
      "LOCATION_TEMPERATURE_NOTIFICATION",
      "LOCATION_HUMIDITY_NOTIFICATION",
    ].includes(d.type) && !!d.locationId
  );
}
