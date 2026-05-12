export { isAuthenticationError } from "./core/client";

import { AylaConnectionStatus } from "./types";

export function parseConnectionStatus(
  connectionStatus?: string
): AylaConnectionStatus | undefined {
  if (connectionStatus == null) return;

  switch (connectionStatus) {
    case "Initializing":
      return AylaConnectionStatus.Initializing;
    case "Online":
      return AylaConnectionStatus.Online;
    default:
      return AylaConnectionStatus.Offline;
  }
}

export function parseDate(date?: Date | string): Date | undefined {
  if (date == null) return;
  if (typeof date === "string") {
    date = new Date(date);
  }

  return isNaN(date.getTime()) ? undefined : date;
}

export function parseNumber(number?: number | string): number | undefined {
  if (number == null) return;
  if (typeof number === "string") {
    number = parseFloat(number);
  }

  return isNaN(number) ? undefined : number;
}
