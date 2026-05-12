import {
  AylaDeviceWithMetadataAndProperties,
  isDeviceWithMetadataAndProperties,
} from "ayla-client";

import { HoldLength } from "../schema";
import { fToC as fToCRaw, toFixed, toHalf } from "../utils";

import template from "./email";

export { template };

type AylaDevice = AylaDeviceWithMetadataAndProperties<Metadata, Properties>;

// The Omit is a sanity check to make sure we're not typing over the
// default attributes of AylaDevice
type ApplicationAttributes = { temperatureUnit: TemperatureUnit };
export type Device = AylaDevice & Omit<ApplicationAttributes, keyof AylaDevice>;

export enum FanSpeed {
  Off = 0,
  Slow,
  Medium,
  Fast,
}

export enum Mode {
  Off = "OFF",
  Heat = "HEAT",
  Cool = "COOL",
  Auto = "AUTO",
  EmergencyHeat = "EHEAT",
  QuickHeat = "QUICKHEAT",
  QuickCool = "QUICKCOOL",
}

export type EffectiveModes = Extract<
  Mode,
  Mode.Off | Mode.Heat | Mode.Cool | Mode.Auto
>;

export type Metadata = Partial<{
  holdLength: string;
  temperatureUnit: TemperatureUnit;
}>;

export enum OverrideMode {
  Cancelled = 1,
  NextEvent = 2,
  Hours = 3,
}

export enum TemperatureUnit {
  C = "C",
  F = "F",
}

type RWProperties = {
  ClStpt1: number;
  ClStpt2: number;
  ClStpt3: number;
  ClStpt4: number;
  ClStpt5: number;
  ClStpt6: number;
  Con2ACS: number;
  HtStpt1: number;
  HtStpt2: number;
  HtStpt3: number;
  HtStpt4: number;
  HtStpt5: number;
  HtStpt6: number;
  QuickHtCl: number;
  TmpOvr1: number;
  TmpOvr2: number;
  TmpOvr3: number;
  TmpOvr4: number;
  TmpOvr5: number;
  TmpOvr6: number;
  UsrMd1: number;
  UsrMd2: number;
  UsrMd3: number;
  UsrMd4: number;
  UsrMd5: number;
  UsrMd6: number;
  VacOvr: string;
};

type ROProperties = {
  Hum1: number;
  Hum2: number;
  Hum3: number;
  Hum4: number;
  Hum5: number;
  Hum6: number;
  IDTmp1: number;
  IDTmp2: number;
  IDTmp3: number;
  IDTmp4: number;
  IDTmp5: number;
  IDTmp6: number;
  ODTmp: number;
  SysStg: number;
  TmpMode: number;
  ViewMd: number;
  ZAnyFlt: number;
  ZnNm1: string;
  ZnNm2: string;
  ZnNm3: string;
  ZnNm4: string;
  ZnNm5: string;
  ZnNm6: string;
  ZnStat1: number;
  ZnStat2: number;
  ZnStat3: number;
  ZnStat4: number;
  ZnStat5: number;
  ZnStat6: number;
};

export type Properties = RWProperties & ROProperties;

export type Zone = 0 | 1 | 2 | 3 | 4 | 5;

export const DefaultOverride = encodeTmpOvr({
  setpoint: 0,
  holdLength: { __typename: "HoldLengthNextEvent" },
});

export const [HEAT_MIN, HEAT_MAX] = [40, 90];
export const [COOL_MIN, COOL_MAX] = [54, 99];
export const MIN_INTERVAL = 2;

// 320-999 (degrees F * 10)
export function decodeIdTmp(idTmp: number): number {
  return idTmp / 10;
}

// High byte is indoor control address:
// * Air Handler = 0x80
// * Mod Furnace = 0x81
// * Indoor Aux = 0x83
// * AHV = 0x84
// * 2 Stage Furnace = 0x85
// Low byte is the fault #
// Fault descriptions from WiFi Features List
export function decodeIdCtrlFlt(
  idCtrlFlt: number
): { label: string; description: string } {
  let label = "Indoor Control Fault";
  let description = `Internal code: ${(idCtrlFlt & 0xffff)
    .toString(16)
    .toUpperCase()}`;

  const controlAddress = (idCtrlFlt >> 8) & 0xff;
  const fault = idCtrlFlt & 0xff;

  switch (controlAddress) {
    case 0x80:
    case 0x84: {
      label = controlAddress === 0x80 ? "Air Handler Fault" : "AHV Fault";
      switch (fault) {
        case 0x01: {
          description = "LIMIT SWITCH OPEN";
          break;
        }
        case 0x02: {
          description = "MULTIPLE LIMIT OPEN W/O HEAT";
          break;
        }
        case 0x03: {
          description = "MULTIPLE LIMIT OPEN W/ HEAT";
          break;
        }
        case 0x04: {
          description = "LONG DURATION LIMIT OPEN";
          break;
        }
        case 0x05: {
          description = "MULT LNG DURATN LIMIT OPEN";
          break;
        }
        case 0x06: {
          description = "MULT LIMIT OPEN";
          break;
        }
        case 0x07: {
          description = "HEAT COOL CALLS AT SAME TIME";
          break;
        }
        case 0x08: {
          description = "NO MODEL ID PLUG INSERTED";
          break;
        }
        case 0x09: {
          description = "CONTROL FAILURE RECOVERY";
          break;
        }
        case 0x0a: {
          description = "CONTROL FAILURE";
          break;
        }
        case 0x0b: {
          description = "CONTROL IN TEST MODE";
          break;
        }
      }
      break;
    }
    case 0x81: {
      label = "Mod Furnace Fault";
      switch (fault) {
        case 0x01: {
          description = "FLAME PRESENT W/OUT POWER";
          break;
        }
        case 0x02: {
          description = "PRESSURE SWITCH CLOSED";
          break;
        }
        case 0x03: {
          description = "PRESSURE SWITCH OPEN";
          break;
        }
        case 0x04: {
          description = "HIGH LIMIT SWITCH OPEN";
          break;
        }
        case 0x05: {
          description = "ROLLOUT OR AUX SWITCH OPEN";
          break;
        }
        case 0x06: {
          description = "MOD GAS VALVE FAILURE";
          break;
        }
        case 0x07: {
          description = "UNSUCCESSFUL IGNITION";
          break;
        }
        case 0x08: {
          description = "MULTI FLAME DROPOUTS";
          break;
        }
        case 0x09: {
          description = "SUPPLY POWER REV POLARITY";
          break;
        }
        case 0x0a: {
          description = "GAS VALVE CIRCUIT SHORTED";
          break;
        }
        case 0x0b: {
          description = "BLOWER FAILURE";
          break;
        }
        case 0x0c: {
          description = "NO MODEL ID PLUG INSERTED";
          break;
        }
        case 0x0d: {
          description = "SOFT LIMIT WARNING";
          break;
        }
        case 0x0e: {
          description = "AIR BLOCKAGE WARNING";
          break;
        }
        case 0x0f: {
          description = "UNKNOWN FAILURE";
          break;
        }
        case 0x10: {
          description = "FLAME ROD AGE WARNING";
          break;
        }
        case 0x11: {
          description = "JUMPER ERROR";
          break;
        }
      }
      break;
    }
    case 0x83: {
      label = "Indoor Aux Fault";
      switch (fault) {
        case 0x01: {
          description = "CONTROL FAILURE";
          break;
        }
        case 0x05: {
          description = "LOW VOLTAGE (BELOW 19VAC)";
          break;
        }
        case 0x06: {
          description = "LOW VOLTAGE (BELOW 16VAC)";
          break;
        }
        case 0x07: {
          description = "X/L INPUT STATUS - FLASH 1";
          break;
        }
        case 0x08: {
          description = "X/L INPUT STATUS - FLASH 2";
          break;
        }
        case 0x09: {
          description = "X/L INPUT STATUS - FLASH 3";
          break;
        }
        case 0x0a: {
          description = "X/L INPUT STATUS - FLASH 4";
          break;
        }
        case 0x0b: {
          description = "X/L INPUT STATUS - FLASH 5";
          break;
        }
        case 0x0c: {
          description = "X/L INPUT STATUS - FLASH 6";
          break;
        }
        case 0x0d: {
          description = "X/L INPUT STATUS - FLASH 7";
          break;
        }
        case 0x0e: {
          description = "X/L INPUT STATUS - FLASH 8";
          break;
        }
        case 0x0f: {
          description = "X/L INPUT STATUS - FLASH 9";
          break;
        }
        case 0x10: {
          description = "X/L INPUT STATUS - CONSTANT";
          break;
        }
      }
      break;
    }
    case 0x85: {
      label = "2 Stage Furnace Fault";
      switch (fault) {
        case 0x01: {
          description = "FLAME PRESENT W/OUT POWER";
          break;
        }
        case 0x02: {
          description = "PRESSURE SWITCH CLOSED";
          break;
        }
        case 0x03: {
          description = "PRESSURE SWITCH OPEN";
          break;
        }
        case 0x04: {
          description = "LIMIT/ROLLOUT SWITCH OPEN";
          break;
        }
        case 0x05: {
          description = "LIMIT/ROLLOUT SWITCH OPEN > 15 MIN";
          break;
        }
        case 0x06: {
          description = "PRESSURE SWITCH LOCKOUT";
          break;
        }
        case 0x07: {
          description = "UNSUCCESSFUL IGNITION";
          break;
        }
        case 0x08: {
          description = "MULTI FLAME DROPOUTS";
          break;
        }
        case 0x09: {
          description = "SUPPLY POWER REV POLARITY";
          break;
        }
        case 0x0a: {
          description = "GAS VALVE CIRCUIT SHORTED";
          break;
        }
        case 0x0b: {
          description = "LIMIT/ROLLOUT SWITCH OPEN > 5 MIN";
          break;
        }
        case 0x0c: {
          description = "NO MODEL ID PLUG INSERTED";
          break;
        }
        case 0x0d: {
          description = "2S PRESSURE SWITCH OPEN";
          break;
        }
        case 0x0e: {
          description = "FLAME ROD AGE WARNING";
          break;
        }
        case 0x0f: {
          description = "CONTROL FAILURE";
          break;
        }
        case 0x10: {
          description = "Y W/O A G";
          break;
        }
      }
      break;
    }
  }

  return {
    label,
    description,
  };
}

// 0 = Disabled
// 1 = Quick Heat Enabled
// 2 = Quick Cool Enabled
// * Quick Heat and Quick Cool are only available in programmable mode
// * Quick Heat can only be set if heat mode or auto mode are enabled
// * Quick Cool can only be set if cool mode or auto mode are enabled
export function decodeQuickHtCl(quickHtCl: number): Mode | undefined {
  switch (quickHtCl) {
    case 1:
      return Mode.QuickHeat;
    case 2:
      return Mode.QuickCool;
  }
}

export function encodeQuickHtCl(mode: Mode): number {
  switch (mode) {
    case Mode.QuickHeat:
      return 1;
    case Mode.QuickCool:
      return 2;
    default:
      return 0;
  }
}

// High byte is outdoor control address:
// * YGVI = 0xA0
// * Outdoor Aux = 0xA1
// Low byte is the fault #
// Fault descriptions from WiFi Features List
export function decodeOdCtrlFlt(
  odCtrlFlt: number
): { label: string; description: string } {
  let label = "Outdoor Control Fault";
  let description = `Internal code: ${(odCtrlFlt & 0xffff)
    .toString(16)
    .toUpperCase()}`;

  const controlAddress = (odCtrlFlt >> 8) & 0xff;
  const fault = odCtrlFlt & 0xff;

  switch (controlAddress) {
    case 0xa0: {
      label = "YGVI Fault";
      switch (fault) {
        case 0x0b: {
          description = "HPS OPEN";
          break;
        }
        case 0x0c: {
          description = "HPS LOCKOUT - HP";
          break;
        }
        case 0x0d: {
          description = "HPS LOCKOUT - DEFROST";
          break;
        }
        case 0x0e: {
          description = "CONTROL FAILURE";
          break;
        }
        case 0x0f: {
          description = "LPS LOCKOUT";
          break;
        }
        case 0x10: {
          description = "LOW VOLTAGE (BELOW 19VAC)";
          break;
        }
        case 0x11: {
          description = "LOW VOLTAGE (BELOW 16VAC)";
          break;
        }
        case 0x12: {
          description = "PIPE FREEZE TIMER EXPIRED";
          break;
        }
        case 0x13: {
          description = "AMBIENT SENSOR SHORTED";
          break;
        }
        case 0x14: {
          description = "AMBIENT SENSOR OPEN";
          break;
        }
        case 0x15: {
          description = "LIQUID LINE SENSOR SHORTED";
          break;
        }
        case 0x16: {
          description = "LIQUID LINE SENSOR OPEN";
          break;
        }
        case 0x17: {
          description = "HIGH DISCHARGE TEMP";
          break;
        }
        case 0x18: {
          description = "LOW DISCHARGE TEMP";
          break;
        }
        case 0x19: {
          description = "DISCHARGE LINE SENSOR SHORTED";
          break;
        }
        case 0x1a: {
          description = "BONNET SENSOR SHORTED";
          break;
        }
        case 0x1b: {
          description = "FOSSIL FUEL CONFIG ERROR";
          break;
        }
        case 0x1c: {
          description = "COMPRESSOR MISWIRE ERROR";
          break;
        }
        case 0x1d: {
          description = "Y2 W/O Y1- SOFT LOCKOUT";
          break;
        }
        case 0x1e: {
          description = "HPS OPEN W/O COMPRESSOR";
          break;
        }
        case 0x1f: {
          description = "O TSTAT INPUT - AC MODE";
          break;
        }
        case 0x20: {
          description = "W TSTAT INPUT - AC MODE";
          break;
        }
        case 0x21: {
          description = "W & O INPUTS - AC MODE";
          break;
        }
        case 0x22: {
          description = "W & O INPUTS - HP MODE";
          break;
        }
        case 0x23: {
          description = "NO DEFROST CURVE SELECTED";
          break;
        }
      }
      break;
    }
    case 0xa1: {
      label = "Outdoor Aux Fault";
      switch (fault) {
        case 0x0b: {
          description = "HPS OPEN";
          break;
        }
        case 0x0c: {
          description = "HPS LOCKOUT";
          break;
        }
        case 0x0e: {
          description = "CONTROL FAILURE";
          break;
        }
        case 0x0f: {
          description = "LPS LOCKOUT";
          break;
        }
        case 0x10: {
          description = "LOW VOLTAGE (BELOW 19VAC)";
          break;
        }
        case 0x11: {
          description = "LOW VOLTAGE (BELOW 16VAC)";
          break;
        }
        case 0x13: {
          description = "AMBIENT SENSOR SHORTED";
          break;
        }
        case 0x14: {
          description = "AMBIENT SENSOR OPEN";
          break;
        }
        case 0x1c: {
          description = "COMPRESSOR MISWIRE ERROR";
          break;
        }
        case 0x1d: {
          description = "Y2 W/O Y1- SOFT LOCKOUT";
          break;
        }
        case 0x1e: {
          description = "HPS OPEN W/O COMPRESSOR";
          break;
        }
      }
      break;
    }
  }

  return {
    label,
    description,
  };
}

// 0 = Fahrenheit
// 1 = Celsius
export function decodeTmpMode(tmpMode: number): TemperatureUnit {
  return tmpMode === 1 ? TemperatureUnit.C : TemperatureUnit.F;
}

export function encodeTmpMode(unit: TemperatureUnit): number {
  return unit === TemperatureUnit.C ? 1 : 0;
}

// Most Byte = 0 (unused)
// Upper Byte = Override Mode
//     0 = OFF
//     1 = Until Cancelled
//     2 = Until Next Event
//     3 = Hour duration
// High Byte = Setpoint (54-90)
// Low Byte = # hours (1-24 hours for Hour duration)
// * For temperature overrides with a specific end time that are created from the thermostat, the override value will be a hour duration type with a setpoint, but the # hours will be zero"
export function decodeTmpOvr(
  tmpOvr: number
): { holdLength?: HoldLength; setpoint: number } | undefined {
  const duration = tmpOvr & 0xff;
  const setpoint = (tmpOvr >> 8) & 0xff;
  const overrideMode = (tmpOvr >> 16) & 0xff;

  let holdLength: HoldLength;
  switch (overrideMode) {
    case 3:
      holdLength = { __typename: "HoldLengthHours", hours: duration ?? 1 };
      break;
    case 2:
      holdLength = { __typename: "HoldLengthNextEvent" };
      break;
    case 1:
      holdLength = { __typename: "HoldLengthIndefinite" };
      break;
    default:
      return undefined;
  }

  return {
    holdLength,
    setpoint,
  };
}

export function encodeTmpOvr({
  holdLength,
  setpoint,
}: {
  holdLength?: HoldLength;
  setpoint: number;
}): number {
  let duration: number | undefined;
  let overrideMode: number;

  switch (holdLength?.__typename) {
    case "HoldLengthHours":
      overrideMode = 3;
      duration = holdLength.hours;
      break;
    case "HoldLengthNextEvent":
      overrideMode = 2;
      break;
    case "HoldLengthIndefinite":
      overrideMode = 1;
      break;
    default:
      overrideMode = 0;
      break;
  }

  return (duration ?? 0) | (setpoint << 8) | (overrideMode << 16);
}

// Fault descriptions from WiFi Features List
export function decodeTstatFlt(
  tstatFlt: number
): { label: string; description: string } {
  const label = "Thermostat Fault";
  let description = `Internal code: ${(tstatFlt & 0xff)
    .toString(16)
    .toUpperCase()}`;

  switch (tstatFlt) {
    case 0x03: {
      description = "COMM ERROR - INDOOR UNIT";
      break;
    }
    case 0x13: {
      description = "LOW VOLTAGE (BELOW 19VAC)";
      break;
    }
    case 0x14: {
      description = "LOW VOLTAGE (BELOW 16VAC)";
      break;
    }
    case 0x16: {
      description = "COMM ERROR - OUTDOOR";
      break;
    }
    case 0x17: {
      description = "COMM ERROR - ERV/HRV";
      break;
    }
    case 0x01: {
      description = "MISSING OUTDOOR UNIT";
      break;
    }
    case 0x15: {
      description = "MISSING ERV/HRV";
      break;
    }
    case 0x02: {
      description = "MISSING REQUIRED DEVICE";
      break;
    }
    case 0x04: {
      description = "CONTROL FAILURE";
      break;
    }
    case 0x05: {
      description = "PARAMETER OUT OF RANGE";
      break;
    }
    case 0x06: {
      description = "DIFF BTWN TEMP READINGS (PRIM/2ND)";
      break;
    }
    case 0x07: {
      description = " DIFF BTWN TEMP READINGS (PRIM/HUM MOD)";
      break;
    }
    case 0x08: {
      description = "PRIM TEMP SENSOR SHORTED";
      break;
    }
    case 0x09: {
      description = "PRIM TEMP SENSOR OPEN";
      break;
    }
    case 0x0a: {
      description = "2ND TEMP SENSOR SHORTED";
      break;
    }
    case 0x0b: {
      description = "2ND TEMP SENSOR OPEN";
      break;
    }
    case 0x0c: {
      description = "HUM MOD TEMP SENSOR SHORTED";
      break;
    }
    case 0x0d: {
      description = "HUM MOD TEMP SENSOR OPEN";
      break;
    }
    case 0x0e: {
      description = "TEMPERATURE READING TOO HIGH";
      break;
    }
    case 0x0f: {
      description = "TEMPERATURE READING TOO LOW";
      break;
    }
    case 0x10: {
      description = "HUMIDITY SENSOR FAILURE";
      break;
    }
    case 0x11: {
      description = "HUMIDITY READING TOO HIGH";
      break;
    }
    case 0x12: {
      description = "HUMIDITY READING TOO LOW";
      break;
    }
    case 0x61: {
      description = "COMM ERROR - ZONE PANEL";
      break;
    }
    case 0x62: {
      description = "COMM ERROR - ZONE 2 SENSOR";
      break;
    }
    case 0x63: {
      description = "COMM ERROR - ZONE 3 SENSOR";
      break;
    }
    case 0x64: {
      description = "COMM ERROR - ZONE 4 SENSOR";
      break;
    }
    case 0x65: {
      description = "COMM ERROR - ZONE 5 SENSOR";
      break;
    }
    case 0x66: {
      description = "COMM ERROR - ZONE 6 SENSOR";
      break;
    }
    case 0x18: {
      description = "FLOAT SWITCH ACTIVATED";
      break;
    }
  }

  return {
    label,
    description,
  };
}

// 0 = Off
// 1 = Heat
// 2 = Cool
// 3 = Auto
// 4 = Emergency Heat
// 5 = Quick Heat
// 6 = Quick Cool
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
      return Mode.QuickHeat;
    case 6:
      return Mode.QuickCool;
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
    case Mode.QuickHeat:
      return 5;
    case Mode.QuickCool:
      return 6;
    default:
      return 0;
  }
}

// chars 0-1 = Heat setpoint:
//     40-90 (degrees F)
//     * Keep 2 degrees F below cool
// 2-3 = Cool setpoint:
//     54-99 (degrees F)
//     * Keep 2 degrees F above heat
// 4-5 = Leave hour (0-23 for 12am-11pm)
// 6-7 = Leave day (1-31)
// 8-9 = Leave month (1-12)
// 10-11 = Leave year:
//     13-99 = vacation
//     0 = vacation/away disabled
//    ""FF"" = away mode
// 12-13 = Return hour (0-23 for 12am-11pm)
// 14-15 = Return day (1-31)
// 16-17 = Return month (1-12)
// 18-19 = Return Year (13+)
export function decodeVacOvr(
  vacOvr: string
): { heatSetpoint: number; coolSetpoint: number; enabled: boolean } {
  return {
    heatSetpoint: parseInt(vacOvr.slice(0, 2)),
    coolSetpoint: parseInt(vacOvr.slice(2, 4)),
    enabled: vacOvr.slice(10, 12) !== "00",
  };
}

export function encodeVacOvr({
  heatSetpoint,
  coolSetpoint,
  enabled,
  base = Array(20).fill("0").join(""),
}: {
  heatSetpoint: number;
  coolSetpoint: number;
  enabled: boolean;
  base?: string;
}): string {
  const vacOvr = base.split("");

  coolSetpoint = norm(coolSetpoint, COOL_MIN, COOL_MAX);
  heatSetpoint = Math.min(
    norm(heatSetpoint, HEAT_MIN, HEAT_MAX),
    coolSetpoint - MIN_INTERVAL
  );

  vacOvr.splice(0, 2, ...Array.from(String(heatSetpoint)));
  vacOvr.splice(2, 2, ...Array.from(String(coolSetpoint)));
  vacOvr.splice(10, 2, ...Array.from(enabled ? "FF" : "00"));

  return vacOvr.join("");
}

// 0 = non-programmable
// 1 = programmable
// 2 = advanced programmable
export function decodeViewMd(viewMd: number): boolean {
  return viewMd !== 0;
}

// Fault descriptions from WiFi Features List
export function decodeZnPnlFlt(
  znPnlFlt: number
): { label: string; description: string } {
  const label = "Zone Panel Fault";
  let description = `Internal code: ${(znPnlFlt & 0xff)
    .toString(16)
    .toUpperCase()}`;

  switch (znPnlFlt) {
    case 0x01: {
      description = "MISSING DAMPER POWER";
      break;
    }
    case 0x02: {
      description = "CONTROL FAILURE";
      break;
    }
    case 0x03: {
      description = "LOW VOLTAGE (BELOW 19VAC)";
      break;
    }
    case 0x04: {
      description = "LOW VOLTAGE (BELOW 16VAC)";
      break;
    }
    case 0x05: {
      description = "LAS SHORTED";
      break;
    }
    case 0x06: {
      description = "MISSING LAS";
      break;
    }
  }

  return {
    label,
    description,
  };
}

// Fault descriptions from WiFi Features List
export function decodeZnSnsrFlt({
  zone,
  znSnsrFlt,
}: {
  zone: number;
  znSnsrFlt: number;
}): { label: string; description: string } {
  const label = `Zone Sensor Fault (Zone ${zone})`;
  let description = `Internal code: ${(znSnsrFlt & 0xff)
    .toString(16)
    .toUpperCase()}`;

  switch (znSnsrFlt) {
    case 0x04: {
      description = "CONTROL FAILURE";
      break;
    }
    case 0x06: {
      description = "DIFF BTWN TEMP READINGS (PRIM/2ND)";
      break;
    }
    case 0x08: {
      description = "PRIM TEMP SENSOR SHORTED";
      break;
    }
    case 0x09: {
      description = "PRIM TEMP SENSOR OPEN";
      break;
    }
    case 0x0a: {
      description = "2ND TEMP SENSOR SHORTED";
      break;
    }
    case 0x0b: {
      description = "2ND TEMP SENSOR OPEN";
      break;
    }
    case 0x0e: {
      description = " 0x10	TEMPERATURE READING TOO HIGH";
      break;
    }
    case 0x0f: {
      description = " 0x11	TEMPERATURE READING TOO LOW";
      break;
    }
    case 0x13: {
      description = "LOW VOLTAGE (BELOW 19VAC)";
      break;
    }
    case 0x14: {
      description = "LOW VOLTAGE (BELOW 16VAC)";
      break;
    }
  }

  return {
    label,
    description,
  };
}

// Bit1 = Heat running
// Bit2 = Cool running
// Bit3 = Fan Animation Speed
// Bit4 = Fan Animation Speed
// (Fan speeds are 0 = off, 1 = slow, 2 = med, 3 = fast for bits 3 & 4)
// Bit5 = Humidification running
// Bit6 = Dehumidification running
// Bit7 = Sun/Moon Icon (0 = Sun; 1 = Moon)
export function decodeZnStat(
  znStat: number
): {
  heatRunning: boolean;
  coolRunning: boolean;
  fanSpeed: FanSpeed;
  humidificationRunning: boolean;
  dehumidificationRunning: boolean;
} {
  let fanSpeed: FanSpeed;

  switch (writeBit(writeBit(0, 0, readBit(znStat, 3)), 1, readBit(znStat, 4))) {
    case 1:
      fanSpeed = FanSpeed.Slow;
      break;
    case 2:
      fanSpeed = FanSpeed.Medium;
      break;
    case 3:
      fanSpeed = FanSpeed.Fast;
      break;
    default:
      fanSpeed = FanSpeed.Off;
      break;
  }

  return {
    heatRunning: !!readBit(znStat, 1),
    coolRunning: !!readBit(znStat, 2),
    fanSpeed: fanSpeed,
    humidificationRunning: !!readBit(znStat, 5),
    dehumidificationRunning: !!readBit(znStat, 6),
  };
}

export function isProgrammable(
  ...args: Parameters<typeof decodeViewMd>
): ReturnType<typeof decodeViewMd> {
  return decodeViewMd(...args);
}

export function isAylaDevice(device: unknown): device is AylaDevice {
  return isDeviceWithMetadataAndProperties<Metadata, Properties>(
    device,
    (metadata) => {
      // Make sure the metadata exists
      if (typeof metadata !== "object") {
        return false;
      }

      // Make sure that the temperature unit is set to a reasonable
      // value if defined
      if (
        metadata.temperatureUnit != null &&
        metadata.temperatureUnit !== TemperatureUnit.C &&
        metadata.temperatureUnit !== TemperatureUnit.F
      ) {
        return false;
      }

      return true;
    },
    (properties) => {
      return (
        typeof properties.SysStg === "number" &&
        canHeatOrCool(properties.SysStg)
      );
    }
  );
}

export function isDevice(device: unknown): device is Device {
  if (!isAylaDevice(device)) return false;

  switch ((device as Device).temperatureUnit) {
    case TemperatureUnit.F:
    case TemperatureUnit.C:
      break;
    default:
      return false;
  }

  return true;
}

export function isZone(zone: number): zone is Zone {
  return zone >= 0 && zone <= 5;
}

export function setMetadata<
  P extends Record<string, unknown>,
  K extends keyof P
>(metadata: P, key: K, value: P[K]): { key: string; value: P[K] } {
  metadata[key] = value;

  return {
    key: key as string,
    value,
  };
}

export function zoneProperty<
  P extends Record<string, unknown> & Record<string, unknown>,
  K extends keyof P
>(properties: P, key: K, zone: Zone): P[K] {
  const searchKey = (key as string).replace(/[0-9]+/, String(zone + 1));

  if (!Object.prototype.hasOwnProperty.call(properties, searchKey)) {
    throw new Error(`Unable to find zoneProperty ${searchKey}`);
  }

  return properties[searchKey] as P[K];
}

export function setZoneProperty<K extends keyof RWProperties>(
  properties: RWProperties,
  key: K,
  zone: Zone,
  value: RWProperties[K]
): { propertyName: string; value: RWProperties[K] } {
  const propertyName = (key as string).replace(/[0-9]+/, String(zone + 1)) as K;

  if (!Object.prototype.hasOwnProperty.call(properties, propertyName)) {
    throw new Error(`Unable to find zoneProperty ${propertyName}`);
  }

  properties[propertyName] = value;

  return { propertyName, value };
}

export function setProperty<
  P extends RWProperties & Record<string, unknown>,
  K extends keyof P
>(
  properties: P,
  propertyName: K,
  value: P[K]
): { propertyName: string; value: P[K] } {
  properties[propertyName] = value;

  return {
    propertyName: propertyName as string,
    value,
  };
}

// Bit 0 = Heat enabled
// Bit 1 = Cool enabled
// Bits 2-4 = # Zones (1-6)
// * if zoning is disabled due to a zoning sensor or zone panel fault, #zones will be set to 1 to indicate that the system is running as 1 main zone
// Bit 5 = 'View Details of Events in Log?' checked
export function decodeSysStg(
  sysStg: number
): { heatEnabled: boolean; coolEnabled: boolean; zones: number } {
  const heatEnabled = !!readBit(sysStg, 0);
  const coolEnabled = !!readBit(sysStg, 1);

  let zones = 0;
  zones = writeBit(zones, 0, readBit(sysStg, 2));
  zones = writeBit(zones, 1, readBit(sysStg, 3));
  zones = writeBit(zones, 2, readBit(sysStg, 4));

  return { heatEnabled, coolEnabled, zones };
}

export function toDSN(id: string): string {
  return id.replace(/^[NZ]/, "").replace(/-[0-9]$/, "");
}

export function zoneNum(id: string): Zone {
  const zone = Math.abs(parseInt(id.split("-")[1], 10));

  if (!isZone(zone)) throw new Error(`Invalid zone: ${zone}`);

  return zone;
}

export function decodeId(id: string): { dsn: string; zone: Zone } {
  const dsn = toDSN(id);
  const zone = zoneNum(id);

  return { dsn, zone };
}

export function encodeId({
  dsn,
  properties: { SysStg },
  zone,
}: {
  dsn: string;
  properties: { SysStg: number };
  zone: Zone;
}): string {
  const { zones } = decodeSysStg(SysStg);
  return `${zones === 0 ? "N" : "Z"}${dsn}-${zone}`;
}

export function effectiveMode(mode: Mode): EffectiveModes {
  switch (mode) {
    case Mode.Heat:
    case Mode.QuickHeat:
    case Mode.EmergencyHeat:
      return Mode.Heat;
    case Mode.Cool:
    case Mode.QuickCool:
      return Mode.Cool;
    case Mode.Auto:
      return Mode.Auto;
    default:
      return Mode.Off;
  }
}

export function enhanceAylaDevice(device: AylaDevice): Device {
  return {
    ...device,
    properties: {
      ...device.properties,
      // When a new device comes online, some of the properties aren't
      // set immediately. This is a bit of a hacky workaround to set
      // these values to some kind of reasonable default so we can
      // supply the app with data for the device when it's registered
      ClStpt1:
        zoneProperty(device.properties, "ClStpt1", 0) ??
        Math.trunc((zoneProperty(device.properties, "IDTmp1", 0) ?? 0) / 10),
      ClStpt2:
        zoneProperty(device.properties, "ClStpt1", 1) ??
        Math.trunc((zoneProperty(device.properties, "IDTmp1", 1) ?? 0) / 10),
      ClStpt3:
        zoneProperty(device.properties, "ClStpt1", 2) ??
        Math.trunc((zoneProperty(device.properties, "IDTmp1", 2) ?? 0) / 10),
      ClStpt4:
        zoneProperty(device.properties, "ClStpt1", 3) ??
        Math.trunc((zoneProperty(device.properties, "IDTmp1", 3) ?? 0) / 10),
      ClStpt5:
        zoneProperty(device.properties, "ClStpt1", 4) ??
        Math.trunc((zoneProperty(device.properties, "IDTmp1", 4) ?? 0) / 10),
      ClStpt6:
        zoneProperty(device.properties, "ClStpt1", 5) ??
        Math.trunc((zoneProperty(device.properties, "IDTmp1", 5) ?? 0) / 10),
      HtStpt1:
        zoneProperty(device.properties, "HtStpt1", 0) ??
        Math.trunc((zoneProperty(device.properties, "IDTmp1", 0) ?? 0) / 10),
      HtStpt2:
        zoneProperty(device.properties, "HtStpt1", 1) ??
        Math.trunc((zoneProperty(device.properties, "IDTmp1", 1) ?? 0) / 10),
      HtStpt3:
        zoneProperty(device.properties, "HtStpt1", 2) ??
        Math.trunc((zoneProperty(device.properties, "IDTmp1", 2) ?? 0) / 10),
      HtStpt4:
        zoneProperty(device.properties, "HtStpt1", 3) ??
        Math.trunc((zoneProperty(device.properties, "IDTmp1", 3) ?? 0) / 10),
      HtStpt5:
        zoneProperty(device.properties, "HtStpt1", 4) ??
        Math.trunc((zoneProperty(device.properties, "IDTmp1", 4) ?? 0) / 10),
      HtStpt6:
        zoneProperty(device.properties, "HtStpt1", 5) ??
        Math.trunc((zoneProperty(device.properties, "IDTmp1", 5) ?? 0) / 10),
    },
    temperatureUnit: device.metadata.temperatureUnit
      ? device.metadata.temperatureUnit
      : decodeTmpMode(device.properties.TmpMode),
  };
}

export function fToC(
  f: number,
  temperatureUnit: TemperatureUnit,
  absolute = true
): number {
  let c: number;

  switch (temperatureUnit) {
    case TemperatureUnit.C:
      c = toHalf(fToCRaw(f, absolute));
      break;
    case TemperatureUnit.F:
      c = fToCRaw(Math.floor(f), absolute);
      break;
  }

  return toFixed(c);
}

// Internal helpers

function norm(value: number, min: number, max: number): number {
  return Math.max(Math.min(max, value), min);
}

function readBit(src: number, bit: number): 0 | 1 {
  const mask = 0b1 << bit;
  return +((src & mask) === mask) as 0 | 1;
}

function writeBit(src: number, bit: number, value: 0 | 1): number {
  if (value === 0) {
    return src & ~(1 << bit);
  } else {
    return src | (value << bit);
  }
}

/**
 * Checks if a device can heat or cool.
 *
 * Some devices are missing both: heat and cool flags (faulty device/firmware?).
 * We can't really do anything with those so we just treat them as not supported.
 * Letting them through breaks the device registration flow on mobile.
 * There is probably a better way to handle this
 * but we've found just a few devices in this state so this seems like a good compromise for now.
 */
function canHeatOrCool(sysStg: number): boolean {
  const { heatEnabled, coolEnabled } = decodeSysStg(sysStg);
  return heatEnabled || coolEnabled;
}
