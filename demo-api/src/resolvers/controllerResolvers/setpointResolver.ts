import { AuthenticationError } from "apollo-server-express";
import { last } from "lodash";

import {
  Event,
  TemperatureUnit,
  decodeId,
  isDevice,
  decodeAway,
  zoneProperty,
  decodeVacation,
  decodeTmpOvrSt,
  decodeSysStg,
  decodeTmpOvr,
} from "../../hx";

import {
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  ControllerMapper,
} from "../../schema";

import {
  cToF,
  fToC,
  normalizeRangeValue,
  findHalf as _findHalf,
  toFixed,
  hasOwnProperty,
} from "../../utils";

import { NotFound } from "../errors";

type TemperatureUnitMap<T = number> = { [key in TemperatureUnit]: T };

// The Fahrenheit values are canonical. We're tweaking the Celsius
// values in order to coerce the normalization logic in
// normalizeRangeValue to naturally hit the half-degree steps (i.e. we
// need to start + end the range on half-degree values)
const findHalf = ({
  absolute = true,
  bound,
  temperatureUnit,
  value,
}: {
  absolute?: boolean;
  bound: "min" | "max";
  temperatureUnit: TemperatureUnit;
  value: number;
}): number =>
  ({
    [TemperatureUnit.C]: _findHalf(value, bound, absolute),
    [TemperatureUnit.F]: value,
  }[temperatureUnit]);

const STEP: TemperatureUnitMap = {
  [TemperatureUnit.C]: toFixed(cToF(0.5, false)),
  [TemperatureUnit.F]: 1,
};

const currentSetpoints = ({
  zone,
  properties,
  scheduleEvents,
  temperaturePresets,
}: ControllerMapper): [number, number] => {
  let heat: number | undefined;
  let cool: number | undefined;

  const { active: awayActive } = decodeAway(
    zoneProperty(properties, "Away", zone)
  );
  const { active: vacationActive } = decodeVacation(properties.Vacation);

  const { programmable } = decodeSysStg(properties.SysStg);

  if (vacationActive) {
    ({ heat, cool } = decodeVacation(properties.Vacation));
  } else if (awayActive) {
    ({ heat, cool } = decodeAway(zoneProperty(properties, "Away", zone)));
  } else if (programmable && !decodeTmpOvrSt(properties.TmpOvrSt)[zone]) {
    const now = ((now: Date): number =>
      parseInt([now.getDay(), now.getHours(), now.getMinutes()].join("")))(
      new Date()
    );

    const event =
      scheduleEvents[zone].reduce<Event | undefined>((closest, event) => {
        // We're in the middle of the event
        if (event.startScalar >= now && now <= event.endScalar) {
          return event;
        }
        // We found the event that ended most recently before now
        else if (closest == null && event.endScalar <= now) {
          return event;
        }

        return closest;
      }, undefined) ?? last(scheduleEvents[zone]);

    // This can only happen when there are no events for the zone, which _should_ be never
    if (!event) throw new Error("Could not find schedule event");

    const preset = temperaturePresets.find(
      (preset) => preset.id === event.temperaturePresetId
    );

    if (!preset)
      throw new Error(`Could not find preset for schedule event: ${event.id}`);

    ({ lower: heat, upper: cool } = preset.setpoint);
  } else if (zoneProperty(properties, "TmpOvr1", zone)) {
    ({ heat, cool } = decodeTmpOvr(zoneProperty(properties, "TmpOvr1", zone)));
  }

  if (heat == null || cool == null) {
    heat = zoneProperty(properties, "HtStpt1", zone);
    cool = zoneProperty(properties, "ClStpt1", zone);
  }

  return [heat, cool];
};

export const resolver: Resolvers = {
  Controller: {
    setpoint: (controller) => {
      const [heat, cool] = currentSetpoints(controller);

      return {
        ...controller,
        lower: {
          key: "heat",
          value: heat,
        },
        upper: {
          key: "cool",
          value: cool,
        },
      };
    },
    setpointRange: ({
      properties: { HtStptMin, ClStptMin, ClStptMax, HtStptMax, SysStg },
      temperatureUnit,
    }) => {
      const { heatEnabled, coolEnabled } = decodeSysStg(SysStg);
      let setpointMax: number;
      let setpointMin: number;

      switch (true) {
        case heatEnabled && coolEnabled:
          setpointMin = Math.min(ClStptMin, HtStptMin);
          setpointMax = Math.max(ClStptMax, HtStptMax);
          break;
        case heatEnabled:
          setpointMin = HtStptMin;
          setpointMax = HtStptMax;
          break;
        case coolEnabled:
          setpointMin = ClStptMin;
          setpointMax = ClStptMax;
          break;
        default:
          setpointMin = Math.min(ClStptMin, HtStptMin);
          setpointMax = Math.max(ClStptMax, HtStptMax);
          break;
      }

      return {
        min: toFixed(
          fToC(
            findHalf({
              bound: "min",
              value: setpointMin,
              temperatureUnit,
            })
          )
        ),
        max: toFixed(
          fToC(
            findHalf({
              bound: "max",
              value: setpointMax,
              temperatureUnit,
            })
          )
        ),
      };
    },
  },
  Setpoint: {
    __resolveType: (setpoint) =>
      hasOwnProperty(setpoint, "lower") ? "DualSetpoint" : "SingleSetpoint",
  },
  SingleSetpoint: {
    max: ({
      properties: { ClStptMax, HtStptMax },
      setpoint: { key },
      temperatureUnit,
    }) =>
      toFixed(
        fToC(
          findHalf({
            bound: "max",
            value: { cool: ClStptMax, heat: HtStptMax }[key],
            temperatureUnit,
          })
        )
      ),
    min: ({
      properties: { ClStptMin, HtStptMin },
      setpoint: { key },
      temperatureUnit,
    }) =>
      toFixed(
        fToC(
          findHalf({
            bound: "min",
            value: { cool: ClStptMin, heat: HtStptMin }[key],
            temperatureUnit,
          })
        )
      ),
    step: ({ temperatureUnit }) => toFixed(fToC(STEP[temperatureUnit], false)),
    // This will ensure that the values returned by the Graph are
    // normalized to the constraints of the RangeValue
    // (e.g. if step = 0.5, value = 1.4 => 1.5)
    value: ({
      properties: { ClStptMax, ClStptMin, HtStptMax, HtStptMin },
      setpoint: { key, value },
      temperatureUnit,
    }) =>
      toFixed(
        fToC(
          normalizeRangeValue({
            max: findHalf({
              bound: "max",
              value: { cool: ClStptMax, heat: HtStptMax }[key],
              temperatureUnit,
            }),
            min: findHalf({
              bound: "min",
              value: { cool: ClStptMin, heat: HtStptMin }[key],
              temperatureUnit,
            }),
            step: STEP[temperatureUnit],
            value,
          }).value
        )
      ),
  },
  DualSetpoint: {
    lower: (setpoint) => ({ ...setpoint, setpoint: setpoint.lower }),
    upper: (setpoint) => ({ ...setpoint, setpoint: setpoint.upper }),
    minInterval: ({ properties: { Deadband }, temperatureUnit }) =>
      toFixed(
        fToC(
          findHalf({
            absolute: false,
            bound: "max",
            value: Deadband,
            temperatureUnit,
          })
        )
      ),
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

    throw new Error("NotImplemented");
  },
};

export const queryResolver: QueryResolvers = {};
