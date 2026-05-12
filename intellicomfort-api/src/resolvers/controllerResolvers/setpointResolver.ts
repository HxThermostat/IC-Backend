import { writeDatapoints } from "ayla-client";

import { AuthenticationError } from "apollo-server-express";

import {
  COOL_MAX as COOL_MAX_F,
  COOL_MIN as COOL_MIN_F,
  DefaultOverride,
  HEAT_MAX as HEAT_MAX_F,
  HEAT_MIN as HEAT_MIN_F,
  MIN_INTERVAL as MIN_INTERVAL_F,
  Mode,
  TemperatureUnit,
  decodeId,
  decodeSysStg,
  decodeTmpOvr,
  decodeVacOvr,
  encodeTmpOvr,
  isDevice,
  isProgrammable,
  setZoneProperty,
  zoneProperty,
  effectiveMode,
  decodeUsrMd,
  decodeIdTmp,
} from "../../intellicomfort";

import { NotFound, NotSupported } from "../../resolvers/errors";

import { MutationResolvers, QueryResolvers, Resolvers } from "../../schema";

import { DualSetpointMapper, SingleSetpointMapper } from "../../schema/mappers";

import {
  cToF,
  fToC,
  normalizeRangeValue,
  findHalf,
  toFixed,
} from "../../utils";

type TemperatureUnitMap<T = number> = { [key in TemperatureUnit]: T };

// The Fahrenheit values are canonical. We're tweaking the Celsius
// values in order to coerce the normalization logic in
// normalizeRangeValue to naturally hit the half-degree steps (i.e. we
// need to start + end the range on half-degree values)
const COOL_MAX: TemperatureUnitMap = {
  [TemperatureUnit.C]: findHalf(COOL_MAX_F, "max"),
  [TemperatureUnit.F]: COOL_MAX_F,
};

const COOL_MIN: TemperatureUnitMap = {
  [TemperatureUnit.C]: findHalf(COOL_MIN_F, "min"),
  [TemperatureUnit.F]: COOL_MIN_F,
};

const HEAT_MAX: TemperatureUnitMap = {
  [TemperatureUnit.C]: findHalf(HEAT_MAX_F, "max"),
  [TemperatureUnit.F]: HEAT_MAX_F,
};

const HEAT_MIN: TemperatureUnitMap = {
  [TemperatureUnit.C]: findHalf(HEAT_MIN_F, "min"),
  [TemperatureUnit.F]: HEAT_MIN_F,
};

const MIN_INTERVAL: TemperatureUnitMap = {
  [TemperatureUnit.C]: findHalf(MIN_INTERVAL_F, "max", false),
  [TemperatureUnit.F]: MIN_INTERVAL_F,
};

const STEP: TemperatureUnitMap = {
  [TemperatureUnit.C]: toFixed(cToF(0.5, false)),
  [TemperatureUnit.F]: 1,
};

function maxForSetpoint(
  setpoint: "heat" | "cool" | undefined,
  temperatureUnit: TemperatureUnit
): number {
  switch (setpoint) {
    case "heat":
      return HEAT_MAX[temperatureUnit];
    case "cool":
      return COOL_MAX[temperatureUnit];
    default:
      return Math.max(HEAT_MAX[temperatureUnit], COOL_MAX[temperatureUnit]);
  }
}

function minForSetpoint(
  setpoint: "heat" | "cool" | undefined,
  temperatureUnit: TemperatureUnit
): number {
  switch (setpoint) {
    case "heat":
      return HEAT_MIN[temperatureUnit];
    case "cool":
      return COOL_MIN[temperatureUnit];
    default:
      return Math.min(HEAT_MIN[temperatureUnit], COOL_MIN[temperatureUnit]);
  }
}

function buildFormatSetpoint<
  T extends {
    lowerValue?: number;
    upperValue?: number;
    singleValue?: number;
  }
>(
  temperatureUnit: TemperatureUnit
): (format: T) => SingleSetpointMapper | DualSetpointMapper {
  return ({ lowerValue, upperValue, singleValue }: T) => {
    // Coalesce matching lower + upper values into singleValue to
    // simplify the logic below
    if (lowerValue == upperValue) {
      singleValue = singleValue ?? lowerValue;
    }

    if (singleValue != null) {
      return { value: singleValue, temperatureUnit };
    } else if (lowerValue != null && upperValue != null) {
      return {
        lower: { key: "heat", value: lowerValue, temperatureUnit },
        upper: { key: "cool", value: upperValue, temperatureUnit },
        temperatureUnit,
      };
    } else if (lowerValue != null) {
      return { key: "heat", value: lowerValue, temperatureUnit };
    } else if (upperValue != null) {
      return { key: "cool", value: upperValue, temperatureUnit };
    }

    throw new Error("Could not find value for Setpoint");
  };
}

export const resolver: Resolvers = {
  Controller: {
    setpointRange: ({ temperatureUnit, properties }) => {
      const { heatEnabled, coolEnabled } = decodeSysStg(properties.SysStg);
      let setpoint: "heat" | "cool" | undefined;

      switch (true) {
        case heatEnabled && coolEnabled:
          setpoint = undefined;
          break;
        case heatEnabled:
          setpoint = "heat";
          break;
        case coolEnabled:
          setpoint = "cool";
          break;
        default:
          break;
      }
      return {
        min: toFixed(fToC(minForSetpoint(setpoint, temperatureUnit))),
        max: toFixed(fToC(maxForSetpoint(setpoint, temperatureUnit))),
      };
    },

    setpoint: ({ properties, temperatureUnit, zone }) => {
      const formatSetpoint = buildFormatSetpoint(temperatureUnit);

      const { SysStg, VacOvr, ViewMd } = properties;

      const {
        coolEnabled: coolSupported,
        heatEnabled: heatSupported,
      } = decodeSysStg(SysStg);

      const mode = decodeUsrMd(zoneProperty(properties, "UsrMd1", zone));

      const {
        enabled: awayEnabled,
        coolSetpoint: awayCool,
        heatSetpoint: awayHeat,
      } = decodeVacOvr(VacOvr);

      const tmpOvr = decodeTmpOvr(zoneProperty(properties, "TmpOvr1", zone));

      const tmpOvrSetpoint = tmpOvr?.setpoint;

      const indoorTemperature = decodeIdTmp(
        zoneProperty(properties, "IDTmp1", zone)
      );

      const coolSetpoint = coolSupported
        ? zoneProperty(properties, "ClStpt1", zone)
        : undefined;
      const heatSetpoint = heatSupported
        ? zoneProperty(properties, "HtStpt1", zone)
        : undefined;

      // Away: Dual setpoint when the system has both modes enabled,
      // otherwise single
      if (awayEnabled) {
        return formatSetpoint({
          lowerValue: heatSupported ? awayHeat : undefined,
          upperValue: coolSupported ? awayCool : undefined,
        });
      } else if (isProgrammable(ViewMd)) {
        // Temperature override: Single setpoint that represents heat and/or cool
        if (tmpOvrSetpoint != null) {
          switch (effectiveMode(mode)) {
            case Mode.Heat:
              return formatSetpoint({ lowerValue: tmpOvrSetpoint });
            case Mode.Cool:
              return formatSetpoint({ upperValue: tmpOvrSetpoint });
            case Mode.Auto:
            case Mode.Off:
              return formatSetpoint({ singleValue: tmpOvrSetpoint });
          }
        } else {
          // Scheduled setpoints: Single setpoint, except for when in
          // an Off mode (in that case it doesn't really matter what
          // the setpoints are, we're just providing a value for
          // typesafety)
          switch (effectiveMode(mode)) {
            case Mode.Heat:
              return formatSetpoint({ lowerValue: heatSetpoint });
            case Mode.Cool:
              return formatSetpoint({ upperValue: coolSetpoint });
            case Mode.Auto: {
              // We expect heatSetpoint and coolSetpoint to be defined
              // here, this is just a sanity check to avoid a runtime
              // error
              const heatValue =
                heatSetpoint ?? minForSetpoint("heat", temperatureUnit);
              const coolValue =
                coolSetpoint ?? maxForSetpoint("cool", temperatureUnit);

              // 1. The indoor temperature is outside tha range of the
              //    scheduled setpoints

              // The system needs to heat to reach the heat setpoint
              if (indoorTemperature < heatValue) {
                return formatSetpoint({ singleValue: heatValue });
              }
              // The system needs to cool to reach the cool setpoint
              else if (indoorTemperature > coolValue) {
                return formatSetpoint({ singleValue: coolValue });
              }

              // 2. The indoor temperature is between the scheduled
              //    setpoints

              return formatSetpoint({ singleValue: indoorTemperature });
            }
            case Mode.Off:
              return formatSetpoint({
                lowerValue: heatSetpoint,
                upperValue: coolSetpoint,
              });
          }
        }
      } else {
        // Non-programmable: The setpoint is determined by the current
        // mode
        switch (effectiveMode(mode)) {
          case Mode.Heat:
            return formatSetpoint({ lowerValue: heatSetpoint });
          case Mode.Cool:
            return formatSetpoint({ upperValue: coolSetpoint });
          case Mode.Auto:
          case Mode.Off:
            return formatSetpoint({
              lowerValue: heatSetpoint,
              upperValue: coolSetpoint,
            });
        }
      }
    },
  },
  Setpoint: {
    __resolveType: (setpoint) =>
      typeof (setpoint as DualSetpointMapper).lower === "object"
        ? "DualSetpoint"
        : "SingleSetpoint",
  },
  SingleSetpoint: {
    max: ({ key, temperatureUnit }) =>
      toFixed(fToC(maxForSetpoint(key, temperatureUnit))),
    min: ({ key, temperatureUnit }) =>
      toFixed(fToC(minForSetpoint(key, temperatureUnit))),
    step: ({ temperatureUnit }) => toFixed(fToC(STEP[temperatureUnit], false)),
    // This will ensure that the values returned by the Graph are
    // normalized to the constraints of the RangeValue
    // (e.g. if step = 0.5, value = 1.4 => 1.5)
    value: ({ key, value, temperatureUnit }) =>
      toFixed(
        fToC(
          normalizeRangeValue({
            max: maxForSetpoint(key, temperatureUnit),
            min: minForSetpoint(key, temperatureUnit),
            step: STEP[temperatureUnit],
            value,
          }).value
        )
      ),
  },
  DualSetpoint: {
    minInterval: ({ temperatureUnit }) =>
      fToC(MIN_INTERVAL[temperatureUnit], false),
  },
};

export const mutationResolver: MutationResolvers = {
  changeSetpoint: async (
    _,
    { input: { id, single, dual } },
    { loaders, user }
  ) => {
    if (!user) throw new AuthenticationError("Authentication required");

    const { dsn, zone } = decodeId(id);

    const controller = await loaders.device.load(dsn);

    if (!isDevice(controller)) return NotFound();

    const { enabled: awayEnabled } = decodeVacOvr(controller.properties.VacOvr);

    if (awayEnabled) return { __typename: "AwayActive" };

    const programmable = isProgrammable(controller.properties.ViewMd);

    const mode = decodeUsrMd(
      zoneProperty(controller.properties, "UsrMd1", zone)
    );

    if (single) {
      if (programmable) {
        // In the programmable state, there is only one setpoint to
        // override
        await writeDatapoints({
          datapoints: {
            dsn,
            ...setZoneProperty(
              controller.properties,
              "TmpOvr1",
              zone,
              encodeTmpOvr({
                ...decodeTmpOvr(
                  parseInt(
                    controller.metadata.holdLength ??
                      ((DefaultOverride as unknown) as string)
                  )
                ),
                setpoint: Math.round(cToF(single.target)),
              })
            ),
          },

          accessToken: user.accessToken,
        });
      } else {
        // In the non-programmable state, the current mode determines
        // which property to update with the new setpoint value
        switch (mode) {
          case Mode.Cool:
            // Non-programmable cool
            await writeDatapoints({
              datapoints: {
                dsn,
                ...setZoneProperty(
                  controller.properties,
                  "ClStpt1",
                  zone,
                  Math.round(cToF(single.target))
                ),
              },

              accessToken: user.accessToken,
            });
            break;
          case Mode.EmergencyHeat:
          case Mode.Heat:
            // Non-programmable heat
            await writeDatapoints({
              datapoints: {
                dsn,
                ...setZoneProperty(
                  controller.properties,
                  "HtStpt1",
                  zone,
                  Math.round(cToF(single.target))
                ),
              },
              accessToken: user.accessToken,
            });
            break;
          case Mode.Auto:
          case Mode.Off:
          case Mode.QuickCool:
          case Mode.QuickHeat:
          default:
            return NotSupported();
        }
      }
    } else if (dual) {
      if (programmable) {
        // There's no semantic way to handle a dual setpoint in the
        // programmable state
        return NotSupported();
      } else {
        // In the non-programmable state, we directly override the
        // Heat and Cool setpoints
        await writeDatapoints({
          datapoints: [
            {
              dsn,
              ...setZoneProperty(
                controller.properties,
                "HtStpt1",
                zone,
                Math.round(cToF(dual.lower))
              ),
            },
            {
              dsn,
              ...setZoneProperty(
                controller.properties,
                "ClStpt1",
                zone,
                Math.round(cToF(dual.upper))
              ),
            },
          ],
          accessToken: user.accessToken,
        });
      }
    }

    loaders.device.clear(id).prime(id, controller);

    return {
      __typename: "ChangeSetpointSuccess",
      controller: { ...controller, zone },
    };
  },
};

export const queryResolver: QueryResolvers = {};
