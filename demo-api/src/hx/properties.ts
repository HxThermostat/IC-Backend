import type { Zone } from "./common";

import { hasOwnProperty } from "../utils";

export type RWProperties = {
  Away: string;
  AwayZn2: string;
  AwayZn3: string;
  AwayZn4: string;
  AwayZn5: string;
  AwayZn6: string;
  AwayZn7: string;
  AwayZn8: string;
  Banner: number;
  Brand: string;
  ClrFltLogs: number;
  Con2ACS: number;
  CstMsg2: string;
  CstMsg2P: string;
  CstMsg: string;
  CstMsgP: string;
  Curtail: number;
  DHStg1: number;
  DHStg2: number;
  DHStg3: number;
  DHStg4: number;
  DHStg5: number;
  DHStg6: number;
  DHStg7: number;
  DHStg8: number;
  FanOvrSt: number;
  FanStg1: number;
  FanStg2: number;
  FanStg3: number;
  FanStg4: number;
  FanStg5: number;
  FanStg6: number;
  FanStg7: number;
  FanStg8: number;
  FaultAck: string;
  ForcedAirflowTest: number;
  HumStg1: number;
  HumStg2: number;
  HumStg3: number;
  HumStg4: number;
  HumStg5: number;
  HumStg6: number;
  HumStg7: number;
  HumStg8: number;
  Lockout: number;
  OverrideStg: string;
  OverrideStgZn2: string;
  OverrideStgZn3: string;
  OverrideStgZn4: string;
  OverrideStgZn5: string;
  OverrideStgZn6: string;
  OverrideStgZn7: string;
  OverrideStgZn8: string;
  Reset: number;
  Sch1D1Cl?: string;
  Sch1D1Ht?: string;
  Sch1D1Tm1?: string;
  Sch1D1Tm2?: string;
  Sch1D2Cl?: string;
  Sch1D2Ht?: string;
  Sch1D2Tm1?: string;
  Sch1D2Tm2?: string;
  Sch1D3Cl?: string;
  Sch1D3Ht?: string;
  Sch1D3Tm1?: string;
  Sch1D3Tm2?: string;
  Sch1D4Cl?: string;
  Sch1D4Ht?: string;
  Sch1D4Tm1?: string;
  Sch1D4Tm2?: string;
  Sch1D5Cl?: string;
  Sch1D5Ht?: string;
  Sch1D5Tm1?: string;
  Sch1D5Tm2?: string;
  Sch1D6Cl?: string;
  Sch1D6Ht?: string;
  Sch1D6Tm1?: string;
  Sch1D6Tm2?: string;
  Sch1D7Cl?: string;
  Sch1D7Ht?: string;
  Sch1D7Tm1?: string;
  Sch1D7Tm2?: string;
  Sch1p1?: string;
  Sch1p2?: string;
  Sch2D1Cl?: string;
  Sch2D1Ht?: string;
  Sch2D1Tm1?: string;
  Sch2D1Tm2?: string;
  Sch2D2Cl?: string;
  Sch2D2Ht?: string;
  Sch2D2Tm1?: string;
  Sch2D2Tm2?: string;
  Sch2D3Cl?: string;
  Sch2D3Ht?: string;
  Sch2D3Tm1?: string;
  Sch2D3Tm2?: string;
  Sch2D4Cl?: string;
  Sch2D4Ht?: string;
  Sch2D4Tm1?: string;
  Sch2D4Tm2?: string;
  Sch2D5Cl?: string;
  Sch2D5Ht?: string;
  Sch2D5Tm1?: string;
  Sch2D5Tm2?: string;
  Sch2D6Cl?: string;
  Sch2D6Ht?: string;
  Sch2D6Tm1?: string;
  Sch2D6Tm2?: string;
  Sch2D7Cl?: string;
  Sch2D7Ht?: string;
  Sch2D7Tm1?: string;
  Sch2D7Tm2?: string;
  Sch2p1?: string;
  Sch2p2?: string;
  Sch3D1Cl?: string;
  Sch3D1Ht?: string;
  Sch3D1Tm1?: string;
  Sch3D1Tm2?: string;
  Sch3D2Cl?: string;
  Sch3D2Ht?: string;
  Sch3D2Tm1?: string;
  Sch3D2Tm2?: string;
  Sch3D3Cl?: string;
  Sch3D3Ht?: string;
  Sch3D3Tm1?: string;
  Sch3D3Tm2?: string;
  Sch3D4Cl?: string;
  Sch3D4Ht?: string;
  Sch3D4Tm1?: string;
  Sch3D4Tm2?: string;
  Sch3D5Cl?: string;
  Sch3D5Ht?: string;
  Sch3D5Tm1?: string;
  Sch3D5Tm2?: string;
  Sch3D6Cl?: string;
  Sch3D6Ht?: string;
  Sch3D6Tm1?: string;
  Sch3D6Tm2?: string;
  Sch3D7Cl?: string;
  Sch3D7Ht?: string;
  Sch3D7Tm1?: string;
  Sch3D7Tm2?: string;
  Sch3p1?: string;
  Sch3p2?: string;
  Sch4D1Cl?: string;
  Sch4D1Ht?: string;
  Sch4D1Tm1?: string;
  Sch4D1Tm2?: string;
  Sch4D2Cl?: string;
  Sch4D2Ht?: string;
  Sch4D2Tm1?: string;
  Sch4D2Tm2?: string;
  Sch4D3Cl?: string;
  Sch4D3Ht?: string;
  Sch4D3Tm1?: string;
  Sch4D3Tm2?: string;
  Sch4D4Cl?: string;
  Sch4D4Ht?: string;
  Sch4D4Tm1?: string;
  Sch4D4Tm2?: string;
  Sch4D5Cl?: string;
  Sch4D5Ht?: string;
  Sch4D5Tm1?: string;
  Sch4D5Tm2?: string;
  Sch4D6Cl?: string;
  Sch4D6Ht?: string;
  Sch4D6Tm1?: string;
  Sch4D6Tm2?: string;
  Sch4D7Cl?: string;
  Sch4D7Ht?: string;
  Sch4D7Tm1?: string;
  Sch4D7Tm2?: string;
  Sch4p1?: string;
  Sch4p2?: string;
  Sch5D1Cl?: string;
  Sch5D1Ht?: string;
  Sch5D1Tm1?: string;
  Sch5D1Tm2?: string;
  Sch5D2Cl?: string;
  Sch5D2Ht?: string;
  Sch5D2Tm1?: string;
  Sch5D2Tm2?: string;
  Sch5D3Cl?: string;
  Sch5D3Ht?: string;
  Sch5D3Tm1?: string;
  Sch5D3Tm2?: string;
  Sch5D4Cl?: string;
  Sch5D4Ht?: string;
  Sch5D4Tm1?: string;
  Sch5D4Tm2?: string;
  Sch5D5Cl?: string;
  Sch5D5Ht?: string;
  Sch5D5Tm1?: string;
  Sch5D5Tm2?: string;
  Sch5D6Cl?: string;
  Sch5D6Ht?: string;
  Sch5D6Tm1?: string;
  Sch5D6Tm2?: string;
  Sch5D7Cl?: string;
  Sch5D7Ht?: string;
  Sch5D7Tm1?: string;
  Sch5D7Tm2?: string;
  Sch5p1?: string;
  Sch5p2?: string;
  Sch6D1Cl?: string;
  Sch6D1Ht?: string;
  Sch6D1Tm1?: string;
  Sch6D1Tm2?: string;
  Sch6D2Cl?: string;
  Sch6D2Ht?: string;
  Sch6D2Tm1?: string;
  Sch6D2Tm2?: string;
  Sch6D3Cl?: string;
  Sch6D3Ht?: string;
  Sch6D3Tm1?: string;
  Sch6D3Tm2?: string;
  Sch6D4Cl?: string;
  Sch6D4Ht?: string;
  Sch6D4Tm1?: string;
  Sch6D4Tm2?: string;
  Sch6D5Cl?: string;
  Sch6D5Ht?: string;
  Sch6D5Tm1?: string;
  Sch6D5Tm2?: string;
  Sch6D6Cl?: string;
  Sch6D6Ht?: string;
  Sch6D6Tm1?: string;
  Sch6D6Tm2?: string;
  Sch6D7Cl?: string;
  Sch6D7Ht?: string;
  Sch6D7Tm1?: string;
  Sch6D7Tm2?: string;
  Sch6p1?: string;
  Sch6p2?: string;
  Sch7p1?: string;
  Sch7p2?: string;
  Sch8p1?: string;
  Sch8p2?: string;
  SchDayParts: string;
  SchDayPartsZn2: string;
  SchDayPartsZn3: string;
  SchDayPartsZn4: string;
  SchDayPartsZn5: string;
  SchDayPartsZn6: string;
  SchDayPartsZn7: string;
  SchDayPartsZn8: string;
  SchFan: string;
  SchFanZn2: string;
  SchFanZn3: string;
  SchFanZn4: string;
  SchFanZn5: string;
  SchFanZn6: string;
  SchFanZn7: string;
  SchFanZn8: string;
  ServiceDates: string;
  ServiceReminder: number;
  StatusID1: string;
  StatusID2: string;
  StatusID3: string;
  StatusIDEEV2: string;
  StatusIDEEV: string;
  StatusOD1: string;
  StatusOD2: string;
  StatusOD3: string;
  StatusOD4: string;
  StatusOD5: string;
  StatusOD6: string;
  StatusOD7: string;
  StatusOD8: string;
  StatusTstat: string;
  StatusZC2: string;
  StatusZC3: string;
  StatusZC4: string;
  StatusZC5: string;
  StatusZC6: string;
  StatusZC7: string;
  StatusZC8: string;
  SysEventAck: number;
  SysStg: number;
  TmpOvr1: number;
  TmpOvr2: number;
  TmpOvr3: number;
  TmpOvr4: number;
  TmpOvr5: number;
  TmpOvr6: number;
  TmpOvr7: number;
  TmpOvr8: number;
  TmpOvrSt: number;
  UpdateRate: number;
  UsrMd1: number;
  UsrMd1Prev: number;
  UsrMd2: number;
  UsrMd2Prev: number;
  UsrMd3: number;
  UsrMd3Prev: number;
  UsrMd4: number;
  UsrMd4Prev: number;
  UsrMd5: number;
  UsrMd5Prev: number;
  UsrMd6: number;
  UsrMd6Prev: number;
  UsrMd7: number;
  UsrMd7Prev: number;
  UsrMd8: number;
  UsrMd8Prev: number;
  Vacation?: string;
  ZnAirflow1: number;
  ZnAirflow2: number;
  ZnAirflow3: number;
  ZnAirflow4: number;
  ZnAirflow5: number;
  ZnAirflow6: number;
  ZnAirflow7: number;
  ZnAirflow8: number;
  ZoneName1?: string;
  ZoneName2?: string;
  ZoneName3?: string;
  ZoneName4?: string;
  ZoneName5?: string;
  ZoneName6?: string;
  ZoneName7?: string;
  ZoneName8?: string;
  dlrEmail: string;
  dlrName: string;
  dlrPhone: string;
  dlrWeb: string;
};

export type ROProperties = {
  ActiveSystemAirflow: number;
  ClStpt1: number;
  ClStpt2: number;
  ClStpt3: number;
  ClStpt4: number;
  ClStpt5: number;
  ClStpt6: number;
  ClStpt7: number;
  ClStpt8: number;
  ClStptMax: number;
  ClStptMin: number;
  Deadband: number;
  EquipOut: number;
  Fault: string;
  HtStpt1: number;
  HtStpt2: number;
  HtStpt3: number;
  HtStpt4: number;
  HtStpt5: number;
  HtStpt6: number;
  HtStpt7: number;
  HtStpt8: number;
  HtStptMax: number;
  HtStptMin: number;
  Hum1: number;
  Hum2: number;
  Hum3: number;
  Hum4: number;
  Hum5: number;
  Hum6: number;
  Hum7: number;
  Hum8: number;
  IDTmp1: number;
  IDTmp2: number;
  IDTmp3: number;
  IDTmp4: number;
  IDTmp5: number;
  IDTmp6: number;
  IDTmp7: number;
  IDTmp8: number;
  MaxAirflow: number;
  MinAirflow: number;
  ODTmp: number;
  SchStpts1: number;
  SchStpts2: number;
  SchStpts3: number;
  SchStpts4: number;
  SchStpts5: number;
  SchStpts6: number;
  SchStpts7: number;
  SchStpts8: number;
  SysEvent: string;
  ZnSensor1: number;
  ZnSensor2: number;
  ZnSensor3: number;
  ZnSensor4: number;
  ZnSensor5: number;
  ZnSensor6: number;
  ZnSensor7: number;
  ZnSensor8: number;
  ZnStat1: number;
  ZnStat2: number;
  ZnStat3: number;
  ZnStat4: number;
  ZnStat5: number;
  ZnStat6: number;
  ZnStat7: number;
  ZnStat8: number;
  version: number;
  versionBt: number;
  versionOD: number;
  versionZC1: number;
  versionZC2: number;
  versionZn2: number;
  versionZn3: number;
  versionZn4: number;
  versionZn5: number;
  versionZn6: number;
  versionZn7: number;
  versionZn8: number;
};

export type Properties = RWProperties & ROProperties;

// This is kind of a silly helper -- it's just here for property /
// zoneProperty parity
export function property<P extends Properties, K extends keyof P>(
  properties: P,
  key: K
): P[K] {
  return properties[key];
}

export function setProperty<
  P extends RWProperties,
  K extends keyof P,
  V extends P[K]
>(
  properties: P,
  propertyName: K,
  value: V
): { propertyName: string; value: V } {
  properties[propertyName] = value;

  return {
    propertyName: propertyName as string,
    value,
  };
}

export function setZoneProperty<
  K extends keyof RWProperties,
  V extends RWProperties[K]
>(
  properties: RWProperties,
  key: K,
  zone: Zone,
  value: V
): { propertyName: string; value: V } {
  const propertyName = normalizeZonePropertyName(properties, key, zone);

  properties[propertyName] = value;

  return { propertyName, value };
}

export function zoneProperty<P extends Properties, K extends keyof P>(
  properties: P,
  key: K,
  zone: Zone
): P[K] {
  const propertyName = normalizeZonePropertyName(properties, key, zone);

  return properties[propertyName];
}

// Internal helpers

function normalizeZonePropertyName<
  P extends ROProperties | RWProperties | Properties,
  K extends keyof P
>(properties: P, _key: K, _zone: Zone): K {
  const key = _key as string;
  const zone = _zone as number;

  let propertyName: string;

  switch (true) {
    case /Away(Zn[1-8])?/.test(key):
      if (zone === 0) {
        propertyName = "Away";
      } else {
        propertyName = `AwayZn${zone + 1}`;
      }
      break;
    case /OverrideStg(Zn[1-8])?/.test(key):
      if (zone === 0) {
        propertyName = "OverrideStg";
      } else {
        propertyName = `OverrideStgZn${zone + 1}`;
      }
      break;
    case /SchDayParts(Zn[1-8])?/.test(key):
      if (zone === 0) {
        propertyName = "SchDayParts";
      } else {
        propertyName = `SchDayPartsZn${zone + 1}`;
      }
      break;
    case /SchFan(Zn[1-8])?/.test(key):
      if (zone === 0) {
        propertyName = "SchFan";
      } else {
        propertyName = `SchFanZn${zone + 1}`;
      }
      break;
    default:
      propertyName = key.replace(/[0-9]+$/, String(zone + 1));
      break;
  }

  if (
    !hasOwnProperty(properties, propertyName) &&
    !propertyIsOptional(propertyName)
  ) {
    throw new Error(`Unable to find zoneProperty ${propertyName.toString()}`);
  }

  return propertyName as K;
}

// To avoid throwing the above runtime error in cases when it's
// semantically valid for a property to be missing, we need to have a
// manual mechanism to identify those property names. We'll need to
// make sure this helper remains up-to-date with the definition of the
// Properties type
function propertyIsOptional(key: string): boolean {
  switch (true) {
    case /^Sch[1-8]/.test(key):
    case /^Vacation$/.test(key):
    case /^ZoneName[1-8]$/.test(key):
      return true;
  }

  return false;
}
