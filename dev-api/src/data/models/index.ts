import { Sequelize } from "sequelize";

// Import models
import {
  User,
  init as initUser,
  initAssociations as initUserAssocations,
} from "./User";
import {
  PushToken,
  init as initPushToken,
  initAssociations as initPushTokenAssocations,
} from "./PushToken";
import {
  Location,
  init as initLocation,
  initAssociations as initLocationAssocations,
} from "./Location";
import {
  FaultLog,
  init as initFaultLog,
  initAssociations as initFaultLogAssocations,
} from "./FaultLog";
import {
  Controller,
  init as initController,
  initAssociations as initControllerAssocations,
} from "./Controller";
import {
  TemperaturePreset,
  init as initTemperaturePreset,
  initAssociations as initTemperaturePresetAssocations,
} from "./TemperaturePreset";
import {
  ScheduleEvent,
  init as initScheduleEvent,
  initAssociations as initScheduleEventAssocations,
} from "./ScheduleEvent";

// Re-export models
export {
  User,
  PushToken,
  Location,
  Controller,
  FaultLog,
  TemperaturePreset,
  ScheduleEvent,
};

const modelInits: Array<(sequelize: Sequelize) => void> = [
  initController,
  initFaultLog,
  initLocation,
  initPushToken,
  initUser,
  initTemperaturePreset,
  initScheduleEvent,
];

const modelAssocations: Array<() => void> = [
  initControllerAssocations,
  initFaultLogAssocations,
  initLocationAssocations,
  initPushTokenAssocations,
  initUserAssocations,
  initTemperaturePresetAssocations,
  initScheduleEventAssocations,
];

export async function initializeModels(sequelize: Sequelize): Promise<void> {
  modelInits.forEach((modelInit) => modelInit(sequelize));
  modelAssocations.forEach((modelAssocation) => modelAssocation());

  return Promise.resolve();
}
