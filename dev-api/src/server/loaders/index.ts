import DataLoader from "dataloader";

import {
  ControllerMapper,
  LocationMapper,
  TemperaturePresetMapper,
  ScheduleEventMapper,
} from "../../schema/mappers";

import { controllerLoader, controllersLoader } from "./controller";
import { locationLoader, locationsLoader } from "./location";
import { scheduleEventLoader, scheduleEventsLoader } from "./scheduleEvents";

import {
  temperaturePresetLoader,
  temperaturePresetsLoader,
  VirtualPresetId,
} from "./temperaturePresets";

type Maybe<T> = T | null;

export interface Loaders {
  controller: DataLoader<string, Maybe<ControllerMapper>>;
  controllers: DataLoader<string, ControllerMapper[]>;
  location: DataLoader<string, Maybe<LocationMapper>>;
  locations: DataLoader<string, LocationMapper[]>;
  temperaturePreset: DataLoader<
    string | VirtualPresetId,
    Maybe<TemperaturePresetMapper>
  >;
  temperaturePresets: DataLoader<string, TemperaturePresetMapper[]>;
  scheduleEvent: DataLoader<string, Maybe<ScheduleEventMapper>>;
  scheduleEvents: DataLoader<string, ScheduleEventMapper[]>;
}

export default function loaders(userId?: string): Loaders {
  const temperaturePreset = temperaturePresetLoader(userId).clearAll();

  return {
    temperaturePreset,
    controller: controllerLoader(userId).clearAll(),
    controllers: controllersLoader.clearAll(),
    location: locationLoader(userId).clearAll(),
    locations: locationsLoader.clearAll(),
    temperaturePresets: temperaturePresetsLoader(temperaturePreset).clearAll(),
    scheduleEvent: scheduleEventLoader(userId).clearAll(),
    scheduleEvents: scheduleEventsLoader.clearAll(),
  };
}
