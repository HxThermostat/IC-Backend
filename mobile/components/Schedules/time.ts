import moment from "moment";

import { Day, ScheduleTime } from "~/graph";
import { DateFormatter } from "~/utils/display";

type DayLong =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export const DaysLongName: Record<Day, DayLong> = {
  SUN: "sunday",
  MON: "monday",
  TUE: "tuesday",
  WED: "wednesday",
  THU: "thursday",
  FRI: "friday",
  SAT: "saturday",
};

export const Days = moment
  .localeData("en")
  .weekdaysShort()
  .map((day) => day.toUpperCase() as Day);

export const getDayEnum = (day: number): Day => Days[day];

export const toDate = (time: ScheduleTime): Date => {
  const d = new Date();
  d.setHours(time.hour, time.minute, 0, 0);

  let offset: number;
  switch (time.day) {
    case "SUN":
      offset = -d.getDay();
      break;
    case "MON":
      offset = 1 - d.getDay();
      break;
    case "TUE":
      offset = 2 - d.getDay();
      break;
    case "WED":
      offset = 3 - d.getDay();
      break;
    case "THU":
      offset = 4 - d.getDay();
      break;
    case "FRI":
      offset = 5 - d.getDay();
      break;
    case "SAT":
      offset = 6 - d.getDay();
      break;
    default:
      throw new Error("Unexpected day");
  }

  d.setDate(d.getDate() + offset);

  return d;
};

export const nextDay = (day: Day): Day => {
  switch (day) {
    case "SUN":
      return "MON";
    case "MON":
      return "TUE";
    case "TUE":
      return "WED";
    case "WED":
      return "THU";
    case "THU":
      return "FRI";
    case "FRI":
      return "SAT";
    case "SAT":
      return "SUN";
    default:
      throw new Error("Unexpected day");
  }
};

const formatDate = DateFormatter("h:mm A");

export const formatScheduleTime = (date: ScheduleTime): string => {
  return formatDate(toDate(date));
};
