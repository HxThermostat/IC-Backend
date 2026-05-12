import { User } from "../server/context";
import { Device, Mode, TemperatureUnit, Zone } from "../intellicomfort";

export type ControllerMapper = LocationMapper & {
  zone: Zone;
};
export type DualSetpointMapper = {
  lower: SingleSetpointMapper;
  upper: SingleSetpointMapper;
  temperatureUnit: TemperatureUnit;
};
export type FanMapper = ControllerMapper;
export type FeatureMapMapper = unknown;
export type LocationMapper = Device;
export type ModeMapper = [Mode, Device];
export type UserMapper = User;
export type PushTokenMapper = {
  endpointArn: string;
  subscriptionArn: string;
  topicArn: string;
};
export type SingleSetpointMapper = {
  key?: "heat" | "cool";
  value: number;
  temperatureUnit: TemperatureUnit;
};
