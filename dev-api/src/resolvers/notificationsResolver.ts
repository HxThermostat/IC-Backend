import { AuthenticationError } from "apollo-server-errors";
import {
  addPushToken,
  removePushToken,
  updateController,
  updateLocation,
  loadPushTokens,
} from "../fixtures";
import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  PushTokenStatus,
  NotificationsFeature,
} from "../schema";

import { buildSetpointConstraints } from "./controllerResolvers/setpointResolver";

const HUMIDITY_MIN_INTERVAL = 5;
const HUMIDITY_RANGE_MIN = 15;
const HUMIDITY_RANGE_MAX = 65;
const HUMIDITY_STEP = 1;

export const resolver: Resolvers = {
  Controller: {
    temperatureNotification: async (
      {
        locationId,
        temperatureNotificationEnabled,
        temperatureNotificationMin,
        temperatureNotificationMax,
      },
      _,
      { loaders }
    ) => {
      const location = await loaders.location.load(locationId);
      if (!location) throw new Error();

      const { temperatureUnit } = location;
      const { max, min, minInterval, step } = buildSetpointConstraints()[
        temperatureUnit
      ];

      return {
        __typename: "TemperatureNotification",
        enabled: temperatureNotificationEnabled,
        minInterval: minInterval,
        lower: {
          step: step,
          max: max - minInterval,
          min: min,
          value: temperatureNotificationMin,
        },
        upper: {
          step: step,
          max: max,
          min: min + minInterval,
          value: temperatureNotificationMax,
        },
      };
    },
    humidityNotification: ({
      humidityNotificationEnabled,
      humidityNotificationMin,
      humidityNotificationMax,
    }) => {
      return {
        __typename: "HumidityNotification",
        enabled: humidityNotificationEnabled,
        minInterval: HUMIDITY_MIN_INTERVAL,
        lower: {
          step: HUMIDITY_STEP,
          max: HUMIDITY_RANGE_MAX - HUMIDITY_MIN_INTERVAL,
          min: HUMIDITY_RANGE_MIN,
          value: humidityNotificationMin,
        },
        upper: {
          step: HUMIDITY_STEP,
          max: HUMIDITY_RANGE_MAX,
          min: HUMIDITY_RANGE_MIN + HUMIDITY_MIN_INTERVAL,
          value: humidityNotificationMax,
        },
      };
    },
  },
  FeatureMap: {
    notifications: () => [
      NotificationsFeature.LocationFaults,
      NotificationsFeature.LocationTemperature,
      NotificationsFeature.ControllerTemperature,
      NotificationsFeature.LocationHumidity,
      NotificationsFeature.ControllerHumidity,
    ],
  },
  Location: {
    temperatureNotification: async (
      { temperatureUnit, controllerIds },
      _,
      { loaders, user }
    ) => {
      if (!user) {
        return null;
      }

      const controllers = await loaders.controllers.load(user.id);

      const locationControllers = controllers.filter((c) =>
        controllerIds.includes(c.id)
      );

      const notificationControllers = locationControllers.filter(
        (c) => typeof c.temperatureNotificationEnabled === "boolean"
      );

      if (!notificationControllers.length) {
        return null;
      }

      const controller = notificationControllers[0];

      const { max, min, minInterval, step } = buildSetpointConstraints()[
        temperatureUnit
      ];

      return {
        __typename: "TemperatureNotification",
        enabled: controller.temperatureNotificationEnabled,
        minInterval: minInterval,
        lower: {
          step: step,
          max: max - minInterval,
          min: min,
          value: controller.temperatureNotificationMin,
        },
        upper: {
          step: step,
          max: max,
          min: min + minInterval,
          value: controller.temperatureNotificationMax,
        },
      };
    },
    humidityNotification: async ({ controllerIds }, _, { loaders, user }) => {
      if (!user) {
        return null;
      }

      const controllers = await loaders.controllers.load(user.id);

      const locationControllers = controllers.filter((c) =>
        controllerIds.includes(c.id)
      );

      const notificationControllers = locationControllers.filter(
        (c) => typeof c.humidityNotificationEnabled === "boolean"
      );

      if (!notificationControllers.length) {
        return null;
      }

      const controller = notificationControllers[0];

      return {
        __typename: "HumidityNotification",
        enabled: controller.humidityNotificationEnabled,
        minInterval: HUMIDITY_MIN_INTERVAL,
        lower: {
          step: HUMIDITY_STEP,
          max: HUMIDITY_RANGE_MAX - HUMIDITY_MIN_INTERVAL,
          min: HUMIDITY_RANGE_MIN,
          value: controller.humidityNotificationMin,
        },
        upper: {
          step: HUMIDITY_STEP,
          max: HUMIDITY_RANGE_MAX,
          min: HUMIDITY_RANGE_MIN + HUMIDITY_MIN_INTERVAL,
          value: controller.humidityNotificationMax,
        },
      };
    },
    faultNotification: ({ faultNotification }) => {
      if (typeof faultNotification === "boolean") {
        return {
          __typename: "BasicNotification",
          enabled: faultNotification,
        };
      }
      return null;
    },
  },

  User: {
    pushTokens: ({ id: userId }) => loadPushTokens(userId),
  },
};

export const queryResolver: QueryResolvers = {};
export const mutationResolver: MutationResolvers = {
  subscribeToNotifications: async (
    _root,
    { input: { token, platform } },
    { user }
  ) => {
    if (!user) throw new AuthenticationError("Authentication required");

    const pushToken = await addPushToken({
      userId: user.id,
      token,
      platform,
      status: PushTokenStatus.Enabled,
    });

    return {
      __typename: "SubscribeToNotificationsSuccess",
      pushToken,
    };
  },
  unsubscribeFromNotifications: async (_, { input: { id } }) => {
    await removePushToken(id);
    return {
      __typename: "UnsubscribeFromNotificationsSuccess",
    };
  },
  toggleControllerTemperatureNotification: async (
    _root,
    { input: { id, enabled } },
    { loaders }
  ) => {
    const controller = await loaders.controller.load(id);
    if (!controller) {
      return {
        __typename: "NotFound",
      };
    }
    const change = {
      temperatureNotificationEnabled: enabled,
    };
    const updated = await updateController(id, change);
    loaders.controller.clear(id).prime(id, updated);
    loaders.controllers.clearAll();

    return {
      __typename: "ToggleControllerTemperatureNotificationSuccess",
      controller: updated,
    };
  },
  adjustControllerTemperatureNotificationThreshold: async (
    _root,
    { input: { id, lower, upper } },
    { loaders }
  ) => {
    const controller = await loaders.controller.load(id);
    if (!controller) {
      return {
        __typename: "NotFound",
      };
    }
    const change = {
      temperatureNotificationMin: lower,
      temperatureNotificationMax: upper,
    };
    const updated = await updateController(id, change);
    loaders.controller.clear(id).prime(id, updated);
    loaders.controllers.clearAll();

    return {
      __typename: "AdjustControllerTemperatureNotificationThresholdSuccess",
      controller: updated,
    };
  },
  toggleControllerHumidityNotification: async (
    _root,
    { input: { id, enabled } },
    { loaders }
  ) => {
    const controller = await loaders.controller.load(id);
    if (!controller) {
      return {
        __typename: "NotFound",
      };
    }
    const change = {
      humidityNotificationEnabled: enabled,
    };
    const updated = await updateController(id, change);
    loaders.controller.clear(id).prime(id, updated);
    loaders.controllers.clearAll();

    return {
      __typename: "ToggleControllerHumidityNotificationSuccess",
      controller: updated,
    };
  },
  adjustControllerHumidityNotificationThreshold: async (
    _root,
    { input: { id, lower, upper } },
    { loaders }
  ) => {
    const controller = await loaders.controller.load(id);
    if (!controller) {
      return {
        __typename: "NotFound",
      };
    }
    const change = {
      humidityNotificationMin: lower,
      humidityNotificationMax: upper,
    };
    const updated = await updateController(id, change);
    loaders.controller.clear(id).prime(id, updated);
    loaders.controllers.clearAll();

    return {
      __typename: "AdjustControllerHumidityNotificationThresholdSuccess",
      controller: updated,
    };
  },
  toggleLocationFaultNotification: async (
    _root,
    { input: { id, enabled } },
    { loaders }
  ) => {
    const location = await loaders.location.load(id);
    if (!location) {
      return {
        __typename: "NotFound",
      };
    }
    const change = {
      faultNotification: enabled,
    };
    const updated = await updateLocation(id, change);
    loaders.location.clear(id).prime(id, updated);
    loaders.locations.clearAll();

    return {
      __typename: "ToggleLocationFaultNotificationSuccess",
      location: updated,
    };
  },
  toggleLocationTemperatureNotification: async (
    _root,
    { input: { id, enabled } },
    { loaders, user }
  ) => {
    const location = await loaders.location.load(id);
    if (!location || !user) {
      return {
        __typename: "NotFound",
      };
    }

    await Promise.all(
      location.controllerIds.map(async (controllerId) => {
        const updated = await updateController(controllerId, {
          temperatureNotificationEnabled: enabled,
        });
        loaders.controller.clear(controllerId).prime(controllerId, updated);
      })
    );

    loaders.controllers.clear(user.id);

    return {
      __typename: "ToggleLocationTemperatureNotificationSuccess",
      location,
    };
  },
  toggleLocationHumidityNotification: async (
    _root,
    { input: { id, enabled } },
    { loaders, user }
  ) => {
    const location = await loaders.location.load(id);
    if (!location || !user) {
      return {
        __typename: "NotFound",
      };
    }

    await Promise.all(
      location.controllerIds.map(async (controllerId) => {
        const updated = await updateController(controllerId, {
          humidityNotificationEnabled: enabled,
        });
        loaders.controller.clear(controllerId).prime(controllerId, updated);
      })
    );

    loaders.controllers.clear(user.id);

    return {
      __typename: "ToggleLocationHumidityNotificationSuccess",
      location,
    };
  },
  adjustLocationTemperatureNotificationThreshold: async (
    _root,
    { input: { id, lower, upper } },
    { loaders, user }
  ) => {
    const location = await loaders.location.load(id);
    if (!location || !user) {
      return {
        __typename: "NotFound",
      };
    }

    await Promise.all(
      location.controllerIds.map(async (controllerId) => {
        const updated = await updateController(controllerId, {
          temperatureNotificationMin: lower,
          temperatureNotificationMax: upper,
        });
        loaders.controller.clear(controllerId).prime(controllerId, updated);
      })
    );

    loaders.controllers.clear(user.id);

    return {
      __typename: "AdjustLocationTemperatureNotificationThresholdSuccess",
      location,
    };
  },
  adjustLocationHumidityNotificationThreshold: async (
    _root,
    { input: { id, lower, upper } },
    { loaders, user }
  ) => {
    const location = await loaders.location.load(id);
    if (!location || !user) {
      return {
        __typename: "NotFound",
      };
    }

    await Promise.all(
      location.controllerIds.map(async (controllerId) => {
        const updated = await updateController(controllerId, {
          humidityNotificationMin: lower,
          humidityNotificationMax: upper,
        });
        loaders.controller.clear(controllerId).prime(controllerId, updated);
      })
    );

    loaders.controllers.clear(user.id);

    return {
      __typename: "AdjustLocationHumidityNotificationThresholdSuccess",
      location,
    };
  },
};
