import {
  User,
  Location as LocationModel,
  Controller,
  FaultLog,
  TemperaturePreset,
  ScheduleEvent,
} from "./models";
import { Day, ScheduleEventCreationAttributes } from "./models/ScheduleEvent";

import { getSchemaDay, nextDay } from "../utils/schedule";

const [DEFAULT_MIN_TEMPERATURE, DEFAULT_MAX_TEMPERATURE] = [15.5, 30.5];
const [DEFAULT_MIN_HUMIDITY, DEFAULT_MAX_HUMIDITY] = [15, 65];

// Data seeding
export async function seedModels(): Promise<void> {
  // Users
  await Promise.all([
    // klimate@kraftful user seed
    User.create({
      id: "ed75d94a-dde6-48b8-83a3-e2aae86237f5",
      email: "klimate@kraftful.com",
      token: "abcd1234",
    }),
  ]).catch((err) => {
    throw err;
  });

  // Locations
  await Promise.all([
    LocationModel.create({
      id: "9c98e454-531c-4042-b494-3a8f8bba1273",
      name: "Home",
      userId: "ed75d94a-dde6-48b8-83a3-e2aae86237f5",
      temperatureUnit: "F",
      zoning: true,
      lat: 49.2827,
      lng: -123.1207,
      temperatureOutdoor: 18.3333,
      connectionStatus: "ONLINE",
      faultNotification: false,
    }),
  ]).catch((err) => {
    throw err;
  });

  // Controllers
  await Promise.all([
    Controller.create({
      id: "b06d8593-997a-44a1-ad23-2cf19e5ad071",
      locationId: "9c98e454-531c-4042-b494-3a8f8bba1273",
      name: "Living Room",
      mode: "AUTO",
      userId: "ed75d94a-dde6-48b8-83a3-e2aae86237f5",
      setpointType: "DualSetpoint",
      setpointTarget: 18,
      setpointLower: 15,
      setpointUpper: 26,
      awayActive: false,
      supportsAway: true,
      awaySetpointTarget: 12,
      awaySetpointLower: 10,
      awaySetpointUpper: 21,
      holdLengthType: "Hours",
      holdLengthHours: 4,
      humidityAmbient: 39,
      temperatureNotificationEnabled: false,
      temperatureNotificationMin: DEFAULT_MIN_TEMPERATURE,
      temperatureNotificationMax: DEFAULT_MAX_TEMPERATURE,
      humidityNotificationEnabled: false,
      humidityNotificationMin: DEFAULT_MIN_HUMIDITY,
      humidityNotificationMax: DEFAULT_MAX_HUMIDITY,
      holdActive: false,
    }),
    Controller.create({
      id: "492cc711-4c86-42f5-bb2b-c61187825ffb",
      locationId: "9c98e454-531c-4042-b494-3a8f8bba1273",
      name: "Hallway",
      mode: "HEAT",
      userId: "ed75d94a-dde6-48b8-83a3-e2aae86237f5",
      setpointType: "SingleSetpoint",
      setpointTarget: 18,
      setpointLower: 15,
      setpointUpper: 26,
      awayActive: false,
      supportsAway: true,
      awaySetpointTarget: 17,
      awaySetpointLower: 10,
      awaySetpointUpper: 21,
      holdLengthType: "Indefinite",
      temperatureNotificationEnabled: false,
      temperatureNotificationMin: DEFAULT_MIN_TEMPERATURE,
      temperatureNotificationMax: DEFAULT_MAX_TEMPERATURE,
      humidityNotificationEnabled: false,
      humidityNotificationMin: DEFAULT_MIN_HUMIDITY,
      humidityNotificationMax: DEFAULT_MAX_HUMIDITY,
      holdActive: false,
    }),
  ]).catch((err) => {
    throw err;
  });

  // FaultLogs
  await Promise.all([
    FaultLog.create({
      locationId: "9c98e454-531c-4042-b494-3a8f8bba1273",
      label: "COM ERROR ERV/HRV",
      date: "2021-03-13T11:05:00.000Z",
      description: "This is a description",
    }),
    FaultLog.create({
      locationId: "9c98e454-531c-4042-b494-3a8f8bba1273",
      label: "COM ERROR ERV/HRV",
      date: "2021-03-14T18:20:00.000Z",
      description:
        "This is a long description. A very very very long description",
    }),
    FaultLog.create({
      locationId: "9c98e454-531c-4042-b494-3a8f8bba1273",
      label: "COM ERROR ERV/HRV",
      date: "2021-03-14T13:01:00.000Z",
    }),
    FaultLog.create({
      locationId: "9c98e454-531c-4042-b494-3a8f8bba1273",
      label: "COM ERROR ERV/HRV",
      date: "2021-03-16T09:50:00.000Z",
    }),
  ]);

  // TemperaturePresets
  await Promise.all([
    TemperaturePreset.create({
      id: "d3f63842-1444-4ff6-92c8-6fd05dbd4728",
      locationId: "9c98e454-531c-4042-b494-3a8f8bba1273",
      userId: "ed75d94a-dde6-48b8-83a3-e2aae86237f5",
      name: "Home",
      slot: "HOME",
      setpointType: "DualSetpoint",
      setpointLower: 15,
      setpointUpper: 26,
      fanMode: "AUTO",
    }),
    TemperaturePreset.create({
      id: "2bbb7b71-01fb-4268-b2c5-152c839b6750",
      locationId: "9c98e454-531c-4042-b494-3a8f8bba1273",
      userId: "ed75d94a-dde6-48b8-83a3-e2aae86237f5",
      name: "Sleep",
      slot: "SLEEP",
      setpointType: "DualSetpoint",
      setpointLower: 14,
      setpointUpper: 22,
      fanMode: "AUTO",
    }),
    TemperaturePreset.create({
      id: "93d8bca6-98f1-4471-b27e-cd628c824f68",
      locationId: "9c98e454-531c-4042-b494-3a8f8bba1273",
      userId: "ed75d94a-dde6-48b8-83a3-e2aae86237f5",
      name: "Away",
      slot: "AWAY",
      setpointType: "DualSetpoint",
      setpointLower: 15,
      setpointUpper: 21,
      fanMode: "AUTO",
    }),
    TemperaturePreset.create({
      id: "1b240d75-a61c-4a1a-9128-7fc11fb709a5",
      locationId: "9c98e454-531c-4042-b494-3a8f8bba1273",
      userId: "ed75d94a-dde6-48b8-83a3-e2aae86237f5",
      name: "Custom",
      slot: "CUSTOM",
      setpointType: "DualSetpoint",
      setpointLower: 13,
      setpointUpper: 19,
      fanMode: "AUTO",
    }),
  ]);

  const DAYS: Day[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const HomePreset = await TemperaturePreset.findOne({
    where: { userId: "ed75d94a-dde6-48b8-83a3-e2aae86237f5", slot: "HOME" },
  });
  const SleepPreset = await TemperaturePreset.findOne({
    where: { userId: "ed75d94a-dde6-48b8-83a3-e2aae86237f5", slot: "SLEEP" },
  });
  const AwayPreset = await TemperaturePreset.findOne({
    where: { userId: "ed75d94a-dde6-48b8-83a3-e2aae86237f5", slot: "AWAY" },
  });
  const CustomPreset = await TemperaturePreset.findOne({
    where: { userId: "ed75d94a-dde6-48b8-83a3-e2aae86237f5", slot: "CUSTOM" },
  });

  const EVEN_DAY_EVENTS: ScheduleEventCreationAttributes[] = [
    {
      startHour: 8,
      startMinute: 0,
      temperaturePresetId: HomePreset?.id,
      endHour: 15,
      endMinute: 45,
    },
    {
      startHour: 15,
      startMinute: 45,
      temperaturePresetId: CustomPreset?.id,
      endHour: 18,
      endMinute: 30,
    },
    {
      startHour: 18,
      startMinute: 30,
      endHour: 8,
      endMinute: 0,
      setpointType: "DualSetpoint",
      setpointLower: 11,
      setpointUpper: 22,
      fanMode: "AUTO",
    },
  ];
  const ODD_DAY_EVENTS: ScheduleEventCreationAttributes[] = [
    {
      startHour: 8,
      startMinute: 0,
      temperaturePresetId: HomePreset?.id,
      endHour: 12,
      endMinute: 45,
    },
    {
      startHour: 12,
      startMinute: 45,
      temperaturePresetId: AwayPreset?.id,
      endHour: 22,
      endMinute: 30,
    },
    {
      startHour: 22,
      startMinute: 30,
      temperaturePresetId: SleepPreset?.id,
      endHour: 8,
      endMinute: 0,
    },
  ];

  const controllerIds = [
    "b06d8593-997a-44a1-ad23-2cf19e5ad071",
    "492cc711-4c86-42f5-bb2b-c61187825ffb",
  ];

  // ScheduleEvents
  for (const controllerId of controllerIds) {
    for (const day of DAYS) {
      if (DAYS.indexOf(day) % 2) {
        for (const [index, partial] of EVEN_DAY_EVENTS.entries()) {
          const lastEventOfDay = index === EVEN_DAY_EVENTS.length - 1;
          const event: ScheduleEventCreationAttributes = {
            ...partial,
            userId: "ed75d94a-dde6-48b8-83a3-e2aae86237f5",
            controllerId,
            startDay: day,
            endDay: lastEventOfDay ? nextDay(getSchemaDay(day)) : day,
            id: `${controllerId}--${day}--${index}`,
          };
          await Promise.all([ScheduleEvent.create(event)]);
        }
      } else {
        for (const [index, partial] of ODD_DAY_EVENTS.entries()) {
          const lastEventOfDay = index === ODD_DAY_EVENTS.length - 1;
          const event: ScheduleEventCreationAttributes = {
            ...partial,
            userId: "ed75d94a-dde6-48b8-83a3-e2aae86237f5",
            controllerId,
            startDay: day,
            endDay: lastEventOfDay ? nextDay(getSchemaDay(day)) : day,
            id: `${controllerId}--${day}--${index}`,
          };
          await Promise.all([ScheduleEvent.create(event)]);
        }
      }
    }
  }
}
