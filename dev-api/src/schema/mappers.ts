import {
  ControllerRecord,
  LocationRecord,
  PushTokenRecord,
  UserRecord,
  ScheduleEventRecord,
  TemperaturePresetRecord,
} from "../fixtures";

export type ControllerMapper = ControllerRecord;
export type FileMapper = { data: Buffer; mime: string };
export type FeatureMapMapper = unknown;
export type LocationMapper = LocationRecord;
export type ModeMapper = ControllerRecord["mode"];

export type ScheduleDayMapper = ScheduleEventRecord[];
export type ScheduleEventMapper = ScheduleEventRecord;
export type ScheduleMapper = ScheduleEventRecord[];

export type TemperaturePresetMapper = TemperaturePresetRecord;
export type UserMapper = UserRecord;
export type PushTokenMapper = PushTokenRecord;
