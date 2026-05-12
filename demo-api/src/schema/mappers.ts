import { AylaDatapoint } from "ayla-client";

import { Device, Event, Mode, Preset, Zone } from "../hx";

import { User } from "../server/context";

export type LocationMapper = Device;
export type ControllerMapper = LocationMapper & {
  zone: Zone;
};

type Setpoint = {
  key: "heat" | "cool";
  value: number;
};
export type DualSetpointMapper = Device & {
  lower: Setpoint;
  upper: Setpoint;
};
export type SingleSetpointMapper = Device & { setpoint: Setpoint };

export type FaultLogLabelMapper = AylaDatapoint;
export type FaultLogLabelAndDescriptionMapper = unknown;

export type FeatureMapMapper = unknown;

export type ModeMapper = [Mode, Device];

export type UserMapper = User;

export type PushTokenMapper = {
  endpointArn: string;
  subscriptionArn: string;
  topicArn: string;
};

export type ScheduleDayMapper = Event[];
export type ScheduleEventMapper = [Event, Event[]];
export type ScheduleMapper = Event[];

export type TemperaturePresetMapper = Preset;
