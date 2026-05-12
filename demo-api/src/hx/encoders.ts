import type { Zone } from "./common";

import { TemperatureUnit } from "./common";
import { Mode, readBit, readBits, writeBit } from "./util";

// ---
// Property decoders / encoders
//
// These are more-or-less just a translation of the property map
// provided by JCI
// https://docs.google.com/spreadsheets/d/1xHIL7Lywl0WUHrTr9njSmeeK6_aH8DCFjwbCXc02HP4/edit#gid=1490129580
// ---

// Away or Home status with cool and heat setpoint
// "AWAY;62,85" = Away mode active, away mode heat setpoint = 62, away mode cool setpoint = 85;
// "HOME;62,85" = Away mode NOT active, away mode heat setpoint = 62, away mode cool setpoint = 85;
type Away = {
  active: boolean;
  cool: number;
  heat: number;
};

export function decodeAway(away: string): Away {
  const [mode, setpoints] = away.split(";");
  const active = mode === "AWAY";
  const [heat, cool] = (setpoints ?? "62,85")
    .split(",")
    .map((v) => parseInt(v, 10));

  return { active, cool, heat };
}

export function encodeAway({ active, cool, heat }: Away): string {
  return `${active ? "AWAY" : "HOME"};${heat},${cool}`;
}

// Upper 8 Bits:
// 0 = OFF
// 1 = AUTO
// 0xFF = disabled
// Lower 8 Bits:
// 35-65 for 35-65 % setting
export function decodeDhStg(dhStg: number): HumStg {
  return decodeHumidification(dhStg);
}

export function encodeDhStg(dhStg: HumStg): number {
  return encodeHumidification(dhStg);
}

// Bit 0 = Zone 1 Fan Override status (1 = Active)
// Bit 1 = Zone 2 Fan Override status (1 = Active)
// Bit 2 = Zone 3 Fan Override status (1 = Active)
// Bit 3 = Zone 4 Fan Override status (1 = Active)
// Bit 4 = Zone 5 Fan Override status (1 = Active)
// Bit 5 = Zone 6 Fan Override status (1 = Active)
// Bit 6 = Zone 7 Fan Override status (1 = Active)
// Bit 7 = Zone 8 Fan Override status (1 = Active)
type FanOvrSt = {
  [zone in Zone]: boolean;
};

export function decodeFanOvrSt(fanOvrSt: number): FanOvrSt {
  return {
    0: !!readBit(fanOvrSt, 0),
    1: !!readBit(fanOvrSt, 1),
    2: !!readBit(fanOvrSt, 2),
    3: !!readBit(fanOvrSt, 3),
    4: !!readBit(fanOvrSt, 4),
    5: !!readBit(fanOvrSt, 5),
    6: !!readBit(fanOvrSt, 6),
    7: !!readBit(fanOvrSt, 7),
  };
}

export function encodeFanOvrSt(fanOvrSt: FanOvrSt): number {
  return Object.entries(fanOvrSt).reduce(
    (acc, [zoneStr, enabled]) =>
      writeBit(acc, parseInt(zoneStr), enabled ? 1 : 0),
    0
  );
}

// Upper 8 Bits:
// 0 = OFF
// 1 = AUTO
// 0xFF = disabled
// Lower 8 Bits:
// % setting
type HumStg = {
  mode: "OFF" | "AUTO";
  target: number;
} | null;

function decodeHumidification(hum: number): HumStg {
  if (hum === 0xff) return null;

  const upper = hum >> 8;
  const lower = hum & 0xff;

  if (upper === 0xff) return null;

  return {
    mode: upper === 0 ? "OFF" : "AUTO",
    target: lower / 100,
  };
}

function encodeHumidification(hum: HumStg): number {
  if (hum === null) return 0xff;

  return ((hum.mode === "OFF" ? 0 : 1) << 8) | (hum.target * 100);
}

type OverrideHour = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export function isOverrideHour(hour: number): hour is OverrideHour {
  return hour >= 1 && hour <= 12;
}

// "Cancelled", "Next Event", or "# Hours - XX" where XX is the # of hours from 1-12
export type OverrideStg =
  | { type: "Cancelled" }
  | { type: "NextEvent" }
  | { type: "Hours"; hours: OverrideHour };

export function decodeOverrideStg(overrideStg: string): OverrideStg {
  switch (overrideStg) {
    case "# Hours - 01":
      return { type: "Hours", hours: 1 };
    case "# Hours - 02":
      return { type: "Hours", hours: 2 };
    case "# Hours - 03":
      return { type: "Hours", hours: 3 };
    case "# Hours - 04":
      return { type: "Hours", hours: 4 };
    case "# Hours - 05":
      return { type: "Hours", hours: 5 };
    case "# Hours - 06":
      return { type: "Hours", hours: 6 };
    case "# Hours - 07":
      return { type: "Hours", hours: 7 };
    case "# Hours - 08":
      return { type: "Hours", hours: 8 };
    case "# Hours - 09":
      return { type: "Hours", hours: 9 };
    case "# Hours - 10":
      return { type: "Hours", hours: 10 };
    case "# Hours - 11":
      return { type: "Hours", hours: 11 };
    case "# Hours - 12":
      return { type: "Hours", hours: 12 };
    case "Next Event":
      return { type: "NextEvent" };
    case "Cancelled":
    default:
      return { type: "Cancelled" };
  }
}

export function encodeOverrideStg(overrideStg: OverrideStg): string {
  switch (overrideStg.type) {
    case "Hours":
      return `# Hours - ${String(overrideStg.hours).padStart(2, "0")}`;
    case "NextEvent":
      return "Next Event";
    case "Cancelled":
    default:
      return "Cancelled";
  }
}

// Bit 0 = Fan speed % setting enabled
// Bit 1 = Heat enabled
// Bit 2 = Cool enabled
// Bit 3 = Eheat enabled
// ~Bits 4-6 = # Zones (1-8)~
// Bit 7 = Zoned or Unzoned System (1 = Zoned)
// Bit 8 = Temperature view mode (0 = Fahrenheit; 1 = Celsius)
// Bit 9 = Auto Mode allowed (1 = allowed)
// Bits 10-12 = # Heat stages allowed for this system
// Bits 13-15 = # Cool stages allowed for this system
// Bit 16 = Non-programmable mode enabled (0 = show program schedule and setpoint overrides on app; 1 = don't show program schedule or setpoint overrides on app) - writeable to change from app
// Bits 17-19 = # day parts used for schedule
// Bits 20-23 = # Zones (1-8)
type SysStg = {
  autoModeEnabled: boolean;
  coolEnabled: boolean;
  coolStages: number;
  dayParts: number;
  eheatEnabled: boolean;
  fanSpeedPercentEnabled: boolean;
  heatEnabled: boolean;
  heatStages: number;
  programmable: boolean;
  temperatureUnit: TemperatureUnit;
  zones: number;
  zoning: boolean;
};
export function decodeSysStg(sysStg: number): SysStg {
  return {
    fanSpeedPercentEnabled: !!readBit(sysStg, 0),
    heatEnabled: !!readBit(sysStg, 1),
    coolEnabled: !!readBit(sysStg, 2),
    eheatEnabled: !!readBit(sysStg, 3),
    zoning: !!readBit(sysStg, 7),
    temperatureUnit: readBit(sysStg, 8) ? TemperatureUnit.F : TemperatureUnit.C,
    autoModeEnabled: !!readBit(sysStg, 9),
    heatStages: readBits(sysStg, [10, 11, 12]),
    coolStages: readBits(sysStg, [13, 14, 15]),
    programmable: !!readBit(sysStg, 16),
    dayParts: readBits(sysStg, [17, 18, 19]),
    zones: readBits(sysStg, [20, 21, 22, 23]),
  };
}

type TmpOvr = {
  heat: number;
  cool: number;
};

// High byte = Heat setpoint (52-90)
// Low byte = Cool setpoint (50-88)

export function decodeTmpOvr(tmpOvr: number): TmpOvr {
  return {
    heat: tmpOvr >> 8,
    cool: tmpOvr & 0xff,
  };
}

export function encodeTmpOvr({ heat, cool }: TmpOvr): number {
  return (heat << 8) | (cool & 0xff);
}

// Bit 0 = Zone 1 Override status (1 = Active)
// Bit 1 = Zone 2 Override status (1 = Active)
// Bit 2 = Zone 3 Override status (1 = Active)
// Bit 3 = Zone 4 Override status (1 = Active)
// Bit 4 = Zone 5 Override status (1 = Active)
// Bit 5 = Zone 6 Override status (1 = Active)
// Bit 6 = Zone 7 Override status (1 = Active)
// Bit 7 = Zone 8 Override status (1 = Active)
type TmpOvrSt = {
  [zone in Zone]: boolean;
};

export function decodeTmpOvrSt(tmpOvrSt: number): TmpOvrSt {
  return {
    [0]: !!readBit(tmpOvrSt, 0),
    [1]: !!readBit(tmpOvrSt, 1),
    [2]: !!readBit(tmpOvrSt, 2),
    [3]: !!readBit(tmpOvrSt, 3),
    [4]: !!readBit(tmpOvrSt, 4),
    [5]: !!readBit(tmpOvrSt, 5),
    [6]: !!readBit(tmpOvrSt, 6),
    [7]: !!readBit(tmpOvrSt, 7),
  };
}

export function encodeTmpOvrSt(tmpOvrSt: TmpOvrSt): number {
  const encoded = 0;

  writeBit(encoded, 0, tmpOvrSt[0] ? 1 : 0);
  writeBit(encoded, 1, tmpOvrSt[1] ? 1 : 0);
  writeBit(encoded, 2, tmpOvrSt[2] ? 1 : 0);
  writeBit(encoded, 3, tmpOvrSt[3] ? 1 : 0);
  writeBit(encoded, 4, tmpOvrSt[4] ? 1 : 0);
  writeBit(encoded, 5, tmpOvrSt[5] ? 1 : 0);
  writeBit(encoded, 6, tmpOvrSt[6] ? 1 : 0);
  writeBit(encoded, 7, tmpOvrSt[7] ? 1 : 0);

  return encoded;
}

/*
  UsrMd1:
  0 = Off
  1 = Heat
  2 = Cool
  3 = Auto
  4 = Emergency Heat
  5 = Max Heat
  6 = Max Cool
*/
export function decodeUsrMd(userMd: number): Mode {
  switch (userMd) {
    case 1:
      return Mode.Heat;
    case 2:
      return Mode.Cool;
    case 3:
      return Mode.Auto;
    case 4:
      return Mode.EmergencyHeat;
    case 5:
      return Mode.MaxHeat;
    case 6:
      return Mode.MaxCool;
    default:
      return Mode.Off;
  }
}

export function encodeUsrMd(mode: Mode): number {
  switch (mode) {
    case Mode.Heat:
      return 1;
    case Mode.Cool:
      return 2;
    case Mode.Auto:
      return 3;
    case Mode.EmergencyHeat:
      return 4;
    case Mode.MaxHeat:
      return 5;
    case Mode.MaxCool:
      return 6;
    default:
      return 0;
  }
}

type Vacation = {
  active: boolean;
  heat: number;
  cool: number;
};

// Vacation status with cool and heat setpoint
// VACATION;62,85 = Vacation mode active, heat setpoint = 62, cool setpoint = 85;
// HOME;62,85 = Vacation mode NOT active, heat setpoint = 62, cool setpoint = 85;

export const decodeVacation = (vacation = "HOME;62,85"): Vacation => {
  const [mode, setpoints] = vacation.split(";");
  const active = mode === "VACATION";
  const [heat, cool] = setpoints.split(",").map((v) => parseInt(v, 10));

  return { active, heat, cool };
};

export const encodeVacation = ({ active, heat, cool }: Vacation): string =>
  `${active ? "VACATION" : "HOME"};${heat},${cool}`;

type ZnStat = {
  heatRunning: boolean;
  coolRunning: boolean;
  fanRunning: boolean;
  humidificationRunning: boolean;
  dehumidificationRunning: boolean;
  heatOrCoolRunning: boolean;
  offDelayActive: boolean;
  smartRecoveryActive: boolean;
};

// Bits 0-1 = Current Mode (0 = Off; 1 = Heat, 2 = Cool)
// - 0b00: Off
// - 0b01: Heat
// - 0b10: Cool
// Bit 2 = Fan running
// Bit 3 = Humidification running
// Bit 4 = Dehumidification running
// Bit 5 = Heat or Cool Running
// Bit 6 = Off Delay active
// Bit 7 = Smart Recovery active
export function decodeZnStat(znStat: number): ZnStat {
  // Decode the first two bits into currentMode
  const currentMode = readBits(znStat, [0, 1]);

  return {
    heatRunning: currentMode === 1,
    coolRunning: currentMode === 2,
    fanRunning: !!readBit(znStat, 2),
    humidificationRunning: !!readBit(znStat, 3),
    dehumidificationRunning: !!readBit(znStat, 4),
    heatOrCoolRunning: !!readBit(znStat, 5),
    offDelayActive: !!readBit(znStat, 6),
    smartRecoveryActive: !!readBit(znStat, 7),
  };
}
