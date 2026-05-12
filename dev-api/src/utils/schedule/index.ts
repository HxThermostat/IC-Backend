import { Day as DayModel } from "../../data/models/ScheduleEvent";

import { Day } from "../../schema";

export const getSchemaDay = (day: DayModel): Day => {
  switch (day) {
    case "SUN":
      return Day.Sun;
    case "MON":
      return Day.Mon;
    case "TUE":
      return Day.Tue;
    case "WED":
      return Day.Wed;
    case "THU":
      return Day.Thu;
    case "FRI":
      return Day.Fri;
    case "SAT":
      return Day.Sat;
  }
};

export const fromSchemaDay = (day: Day): DayModel => {
  return day;
};

export const prevDay = (day: Day): Day => {
  switch (day) {
    case Day.Sun:
      return Day.Sat;
    case Day.Mon:
      return Day.Sun;
    case Day.Tue:
      return Day.Mon;
    case Day.Wed:
      return Day.Tue;
    case Day.Thu:
      return Day.Wed;
    case Day.Fri:
      return Day.Thu;
    case Day.Sat:
      return Day.Fri;
  }
};

export const nextDay = (day: Day): Day => {
  switch (day) {
    case Day.Sun:
      return Day.Mon;
    case Day.Mon:
      return Day.Tue;
    case Day.Tue:
      return Day.Wed;
    case Day.Wed:
      return Day.Thu;
    case Day.Thu:
      return Day.Fri;
    case Day.Fri:
      return Day.Sat;
    case Day.Sat:
      return Day.Sun;
  }
};
