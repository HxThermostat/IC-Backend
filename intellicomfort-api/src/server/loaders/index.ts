import { AylaDatapoint, AylaRule } from "ayla-client";

import DataLoader from "dataloader";

import { Device } from "../../intellicomfort";
import { Endpoint, Subscription } from "../../sns";

import { datapointsLoader } from "./datapoints";
import { deviceLoader, devicesLoader } from "./devices";
import { ruleLoader, rulesLoader } from "./rules";
import { snsEndpointLoader, snsSubscriptionsLoader } from "./sns";

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
  snsEndpoint: DataLoader<string, Maybe<Endpoint>>;
  snsSubscriptions: DataLoader<string, Subscription[]>;
}

export default function loaders(accessToken?: string): Loaders {
  const rules = rulesLoader().clearAll();

  return {
    datapoints: datapointsLoader(accessToken).clearAll(),
    device: deviceLoader(accessToken).clearAll(),
    devices: devicesLoader().clearAll(),
    rule: ruleLoader(rules, accessToken).clearAll(),
    rules,
    snsEndpoint: snsEndpointLoader().clearAll(),
    snsSubscriptions: snsSubscriptionsLoader().clearAll(),
  };
}
