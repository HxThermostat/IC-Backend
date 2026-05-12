import { AuthenticationError } from "apollo-server-errors";

import {
  AylaRuleOperator,
  AylaRuleTemplate,
  AylaRuleTypes,
  buildChangedExpression,
  buildCompoundExpression,
  buildRangeExpression,
  buildRuleName,
  extractRangeExpression,
  findOrCreateAction,
  upsertRule,
} from "ayla-client";

import { AYLA_RULES_SERVICE_WEBHOOK_URL } from "../../config";

import { decodeSysStg } from "../../intellicomfort";

import { NotFound } from "../../resolvers/errors";

import {
  MutationResolvers,
  NotificationsFeature,
  PushTokenStatus,
  QueryResolvers,
  Resolvers,
} from "../../schema";

import {
  createSubscription,
  endpointPlatform,
  isClientError,
  isEndpoint,
  subscriptionArn,
  subscriptionId,
  unsubscribe,
} from "../../sns";

import { cToF, dualRange, fitInDualRange } from "../../utils";

const faultRule = (dsn: string): AylaRuleTemplate => ({
  actionIds: [],
  enabled: true,
  expression: buildChangedExpression({
    dsn,
    propertyName: "ZAnyFlt",
  }),
  name: buildRuleName({
    dsn,
    ruleType: AylaRuleTypes.CHANGE,
    propertyName: "ZAnyFlt",
  }),
});

const HUM_MAX = 65;
const HUM_MIN = 15;
const HUM_INTERVAL = 5;

const humidityRule = (dsn: string, zones = 1): AylaRuleTemplate => ({
  actionIds: [],
  enabled: true,
  expression: buildCompoundExpression(
    new Array(zones).fill(null).map((_, zone) =>
      buildRangeExpression({
        dsn,
        maximum: HUM_MAX,
        minimum: HUM_MIN,
        propertyName: `Hum${zone + 1}`,
      })
    ),
    AylaRuleOperator.OR
  ),
  name: buildRuleName({
    dsn,
    ruleType: AylaRuleTypes.RANGE,
    propertyName: "Hum",
  }),
});

const TEMP_MAX = 90;
const TEMP_MIN = 40;
const TEMP_INTERVAL = 5;

const temperatureRule = (dsn: string, zones = 1): AylaRuleTemplate => ({
  actionIds: [],
  enabled: true,
  expression: buildCompoundExpression(
    new Array(zones).fill(null).map((_, zone) =>
      buildRangeExpression({
        dsn,
        maximum: TEMP_MAX * 10,
        minimum: TEMP_MIN * 10,
        propertyName: `IdTmp${zone + 1}`,
      })
    ),
    AylaRuleOperator.OR
  ),
  name: buildRuleName({
    dsn,
    ruleType: AylaRuleTypes.RANGE,
    propertyName: "IdTmp",
  }),
});

export const resolver: Resolvers = {
  FeatureMap: {
    notifications: () => [
      NotificationsFeature.LocationFaults,
      NotificationsFeature.LocationHumidity,
      NotificationsFeature.LocationTemperature,
    ],
  },
  Location: {
    faultNotification: async ({ dsn }, _, { loaders, user }) => {
      if (!user) return null;

      const rule = await loaders.rule.load(faultRule(dsn).name);

      return {
        __typename: "BasicNotification",
        enabled: rule?.enabled ?? false,
      };
    },
    humidityNotification: async ({ dsn }, _, { loaders, user }) => {
      if (!user) return null;

      const { name, expression } = humidityRule(dsn);

      const rule = await loaders.rule.load(name);

      const enabled = rule?.enabled ?? false;

      const { maximum: upper, minimum: lower } = extractRangeExpression(
        rule?.expression ?? expression
      ) ?? { maximum: HUM_MAX, minimum: HUM_MIN };

      return {
        __typename: "HumidityNotification",
        enabled,
        ...dualRange({
          range: {
            max: HUM_MAX,
            min: HUM_MIN,
            step: 1,
          },
          lower,
          upper,
        }),
        minInterval: HUM_INTERVAL,
      };
    },
    temperatureNotification: async (
      { dsn, temperatureUnit },
      _,
      { loaders, user }
    ) => {
      if (!user) return null;

      const { name, expression } = temperatureRule(dsn);

      const rule = await loaders.rule.load(name);

      const enabled = rule?.enabled ?? false;

      const { maximum: upper, minimum: lower } = extractRangeExpression(
        rule?.expression ?? expression
      ) ?? { maximum: TEMP_MAX * 10, minimum: TEMP_MIN * 10 };

      return {
        __typename: "TemperatureNotification",
        enabled,
        lower: { key: "heat", value: lower / 10, temperatureUnit },
        upper: { key: "cool", value: upper / 10, temperatureUnit },
        minInterval: TEMP_INTERVAL,
      };
    },
  },
  PushToken: {
    id: ({ subscriptionArn }) => subscriptionId(subscriptionArn),
    platform: ({ endpointArn }) => endpointPlatform(endpointArn),
    status: async ({ endpointArn }, _, { loaders }) => {
      const endpoint = await loaders.snsEndpoint.load(endpointArn);

      return endpoint?.Attributes["Enabled"] === "true"
        ? PushTokenStatus.Enabled
        : PushTokenStatus.Disabled;
    },
    token: async ({ endpointArn }, _, { loaders }) => {
      const endpoint = await loaders.snsEndpoint.load(endpointArn);

      return endpoint?.Attributes["Token"] ?? "";
    },
  },
  User: {
    pushTokens: async ({ id }, _, { loaders }) => {
      const subscriptions = await loaders.snsSubscriptions.load(id);

      return subscriptions
        .filter((s) => s.Protocol?.toLowerCase() === "application")
        .map((s) => {
          return {
            endpointArn: s.Endpoint,
            subscriptionArn: s.SubscriptionArn,
            topicArn: s.TopicArn,
          };
        });
    },
  },
};

export const queryResolver: QueryResolvers = {};

export const mutationResolver: MutationResolvers = {
  adjustLocationHumidityNotificationThreshold: async (
    _,
    { input: { id, lower, upper } },
    { loaders, user }
  ) => {
    if (!user) throw new AuthenticationError("Authentication required");

    const location = await loaders.device.load(id);

    if (!location) return NotFound();

    const { zones } = decodeSysStg(location.properties.SysStg);

    const defaultRule = humidityRule(location.dsn, zones);

    const [minimum, maximum] = fitInDualRange(
      dualRange({
        range: {
          max: HUM_MAX,
          min: HUM_MIN,
          step: 1,
        },
        lower,
        upper,
        minInterval: HUM_INTERVAL,
      })
    );

    const action = await findOrCreateAction({
      name: defaultRule.name,
      parameters: {
        body: {
          locationId: id,
          locationName: location.name,
        },
        endpoint: AYLA_RULES_SERVICE_WEBHOOK_URL,
      },
      accessToken: user.accessToken,
    });

    const rule = await upsertRule({
      updates: {
        actionIds: [action.id],
        expression: buildCompoundExpression(
          new Array(zones).fill(null).map((_, zone) =>
            buildRangeExpression({
              dsn: location.dsn,
              maximum,
              minimum,
              propertyName: `Hum${zone + 1}`,
            })
          ),
          AylaRuleOperator.OR
        ),
      },
      defaultRule,
      accessToken: user.accessToken,
    });

    loaders.rules.clearAll();
    loaders.rule.clear(rule.name).prime(rule.name, rule);

    return {
      __typename: "AdjustLocationHumidityNotificationThresholdSuccess",
      location,
    };
  },
  adjustLocationTemperatureNotificationThreshold: async (
    _,
    { input: { id, lower, upper } },
    { loaders, user }
  ) => {
    if (!user) throw new AuthenticationError("Authentication required");

    const location = await loaders.device.load(id);

    if (!location) return NotFound();

    const { zones } = decodeSysStg(location.properties.SysStg);

    const defaultRule = temperatureRule(location.dsn, zones);

    const [minimum, maximum] = fitInDualRange(
      dualRange({
        range: {
          max: TEMP_MAX,
          min: TEMP_MIN,
          step: 1,
        },
        lower: Math.round(cToF(lower)),
        upper: Math.round(cToF(upper)),
        minInterval: TEMP_INTERVAL,
      })
    );

    const action = await findOrCreateAction({
      name: defaultRule.name,
      parameters: {
        body: {
          locationId: id,
          locationName: location.name,
        },
        endpoint: AYLA_RULES_SERVICE_WEBHOOK_URL,
      },
      accessToken: user.accessToken,
    });

    const rule = await upsertRule({
      updates: {
        actionIds: [action.id],
        expression: buildCompoundExpression(
          new Array(zones).fill(null).map((_, zone) =>
            buildRangeExpression({
              dsn: location.dsn,
              maximum: maximum * 10,
              minimum: minimum * 10,
              propertyName: `IdTmp${zone + 1}`,
            })
          ),
          AylaRuleOperator.OR
        ),
      },
      defaultRule,
      accessToken: user.accessToken,
    });

    loaders.rules.clearAll();
    loaders.rule.clear(rule.name).prime(rule.name, rule);

    return {
      __typename: "AdjustLocationTemperatureNotificationThresholdSuccess",
      location,
    };
  },
  subscribeToNotifications: async (
    _root,
    { input: { token, platform } },
    { loaders, user }
  ) => {
    if (!user) throw new AuthenticationError("Authentication required");

    let endpointArn: string;
    let subscriptionArn: string;
    let topicArn: string;

    const subscriptions = await loaders.snsSubscriptions.load(user.id);
    const endpoints = await loaders.snsEndpoint.loadMany(
      subscriptions.map(({ Endpoint }) => Endpoint)
    );

    const existing = endpoints.find(
      (endpoint) =>
        isEndpoint(endpoint) && endpoint.Attributes["Token"] === token
    );

    // NOTE(nleach): We're still vulnerable to a race condition here
    // if two of these mutations arrive at the "same time". This would
    // be a good place to add a mutex.
    if (isEndpoint(existing)) {
      // Because we can only load the Endpoint via a Subscription, we
      // know that this find operation must succeed at runtime
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const subscription = subscriptions.find(
        ({ Endpoint }) => Endpoint === existing.EndpointArn
      )!;

      endpointArn = existing.EndpointArn;
      subscriptionArn = subscription.SubscriptionArn;
      topicArn = subscription.TopicArn;
    } else {
      [endpointArn, subscriptionArn, topicArn] = await createSubscription(
        user.id,
        platform,
        token
      );
    }

    return {
      __typename: "SubscribeToNotificationsSuccess",
      pushToken: {
        endpointArn,
        subscriptionArn,
        topicArn,
      },
    };
  },
  toggleLocationFaultNotification: async (
    _,
    { input: { id, enabled } },
    { loaders, user }
  ) => {
    if (!user) throw new AuthenticationError("Authentication required");

    const location = await loaders.device.load(id);

    if (!location) return NotFound();

    const defaultRule = faultRule(location.dsn);

    const action = await findOrCreateAction({
      name: defaultRule.name,
      parameters: {
        body: {
          locationId: id,
          locationName: location.name,
        },
        endpoint: AYLA_RULES_SERVICE_WEBHOOK_URL,
      },
      accessToken: user.accessToken,
    });

    const rule = await upsertRule({
      updates: { actionIds: [action.id], enabled },
      defaultRule,
      accessToken: user.accessToken,
    });

    loaders.rules.clearAll();
    loaders.rule.clear(rule.name).prime(rule.name, rule);

    return {
      __typename: "ToggleLocationFaultNotificationSuccess",
      location,
    };
  },
  toggleLocationHumidityNotification: async (
    _,
    { input: { id, enabled } },
    { loaders, user }
  ) => {
    if (!user) throw new AuthenticationError("Authentication required");

    const location = await loaders.device.load(id);

    if (!location) return NotFound();

    const { zones } = decodeSysStg(location.properties.SysStg);

    const defaultRule = humidityRule(location.dsn, zones);

    const action = await findOrCreateAction({
      name: defaultRule.name,
      parameters: {
        body: {
          locationId: id,
          locationName: location.name,
        },
        endpoint: AYLA_RULES_SERVICE_WEBHOOK_URL,
      },
      accessToken: user.accessToken,
    });

    const rule = await upsertRule({
      updates: { actionIds: [action.id], enabled },
      defaultRule,
      accessToken: user.accessToken,
    });

    loaders.rules.clearAll();
    loaders.rule.clear(rule.name).prime(rule.name, rule);

    return {
      __typename: "ToggleLocationHumidityNotificationSuccess",
      location,
    };
  },
  toggleLocationTemperatureNotification: async (
    _,
    { input: { id, enabled } },
    { loaders, user }
  ) => {
    if (!user) throw new AuthenticationError("Authentication required");

    const location = await loaders.device.load(id);

    if (!location) return NotFound();

    const { zones } = decodeSysStg(location.properties.SysStg);

    const defaultRule = temperatureRule(location.dsn, zones);

    const action = await findOrCreateAction({
      name: defaultRule.name,
      parameters: {
        body: {
          locationId: id,
          locationName: location.name,
        },
        endpoint: AYLA_RULES_SERVICE_WEBHOOK_URL,
      },
      accessToken: user.accessToken,
    });

    const rule = await upsertRule({
      updates: { actionIds: [action.id], enabled },
      defaultRule,
      accessToken: user.accessToken,
    });

    loaders.rules.clearAll();
    loaders.rule.clear(rule.name).prime(rule.name, rule);

    return {
      __typename: "ToggleLocationTemperatureNotificationSuccess",
      location,
    };
  },
  unsubscribeFromNotifications: async (
    _root,
    { input: { id } },
    { loaders, user }
  ) => {
    try {
      await unsubscribe(subscriptionArn(id));
    } catch (e) {
      if (isClientError(e)) {
        return NotFound();
      }
      throw e;
    }

    if (user) {
      loaders.snsSubscriptions.clear(user.id);
    }

    return {
      __typename: "UnsubscribeFromNotificationsSuccess",
    };
  },
};
