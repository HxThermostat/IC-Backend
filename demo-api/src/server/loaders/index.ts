import { AylaDatapoint, AylaRule } from "ayla-client";

import DataLoader from "dataloader";

import { Device, Event, Preset, Zone } from "../../hx";
import { Endpoint, Subscription } from "../../sns";

import { datapointsLoader } from "./datapoints";
import { deviceLoader, devicesLoader } from "./devices";
import { ruleLoader, rulesLoader } from "./rules";
import { scheduleEventLoader, scheduleEventsLoader } from "./schedules";
import { snsEndpointLoader, snsSubscriptionsLoader } from "./sns";
import {
  temperaturePresetLoader,
  temperaturePresetsLoader,
} from "./temperaturePresets";

type Maybe<T> = T | null;

export interface Loaders {
  datapoints: DataLoader<
    { dsn: string; propertyName: string },
    AylaDatapoint[]
  >;
  device: DataLoader<string, Maybe<Device>>;
  devices: DataLoader<string, string[]>;
  rule: DataLoader<string, Maybe<AylaRule>>;
  rules: DataLoader<string, AylaRule[]>;
  scheduleEvent: DataLoader<string, Maybe<[Event, Device, Zone]>>;
  scheduleEvents: DataLoader<string, Event[]>;
  snsEndpoint: DataLoader<string, Maybe<Endpoint>>;
  snsSubscriptions: DataLoader<string, Subscription[]>;
  temperaturePreset: DataLoader<string, Maybe<Preset>>;
  temperaturePresets: DataLoader<string, Preset[]>;
}

export default function loaders(accessToken?: string): Loaders {
  const device = deviceLoader(accessToken).clearAll();
  const rules = rulesLoader().clearAll();

  return {
    datapoints: datapointsLoader(accessToken).clearAll(),
    device,
    devices: devicesLoader().clearAll(),
    rule: ruleLoader(rules, accessToken).clearAll(),
    rules,
    scheduleEvent: scheduleEventLoader(device).clearAll(),
    scheduleEvents: scheduleEventsLoader(device).clearAll(),
    snsEndpoint: snsEndpointLoader().clearAll(),
    snsSubscriptions: snsSubscriptionsLoader().clearAll(),
    temperaturePreset: temperaturePresetLoader(device).clearAll(),
    temperaturePresets: temperaturePresetsLoader(device).clearAll(),
  };
}
