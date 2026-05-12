import { setupPolly, useTestData } from "test-utils";

import {
  ApolloServerTestClient,
  createTestClient,
} from "apollo-server-testing";
import { ApolloServer, gql } from "apollo-server-express";

import { findUserById, addPushToken } from "../../../fixtures";

import buildServer, { buildSchema, loaders } from "../../../server";
import { Platform, PushToken, PushTokenStatus } from "../../../schema";

import { GraphQLResponse as GraphQLResponseType } from "apollo-server-types";

// This type taken from the apollo generated types
type GraphQLResponse<TData> = Omit<GraphQLResponseType, "data"> & {
  data?: TData;
};

setupPolly(__dirname);
useTestData();

jest.mock("../../../utils");

let server: ApolloServer;
let client: ApolloServerTestClient;

beforeEach(async () => {
  const schema = await buildSchema();
  server = buildServer(schema, {
    user: (await findUserById("ed75d94a-dde6-48b8-83a3-e2aae86237f5")) ?? null,
    loaders: loaders("ed75d94a-dde6-48b8-83a3-e2aae86237f5"),
  });
  client = createTestClient(server);
});

describe("controller", () => {
  test("it returns the correct value for temperatureNotification", async () => {
    const res = client.query({
      query: gql`
        query($id: ID!) {
          controller(id: $id) {
            id
            temperatureNotification {
              enabled
              minInterval
              lower {
                step
                max
                min
                value
              }
              upper {
                step
                max
                min
                value
              }
            }
          }
        }
      `,
      variables: {
        id: "b06d8593-997a-44a1-ad23-2cf19e5ad071",
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
  test("it adjusts the values for adjustControllerTemperatureNotification", async () => {
    const res = client.mutate({
      mutation: gql`
        mutation($id: ID!, $lower: Float!, $upper: Float!) {
          adjustControllerTemperatureNotificationThreshold(
            input: { id: $id, lower: $lower, upper: $upper }
          ) {
            __typename
            ... on AdjustControllerTemperatureNotificationThresholdSuccess {
              controller {
                id
                temperatureNotification {
                  enabled
                  minInterval
                  lower {
                    step
                    max
                    min
                    value
                  }
                  upper {
                    step
                    max
                    min
                    value
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        id: "b06d8593-997a-44a1-ad23-2cf19e5ad071",
        lower: 14.5,
        upper: 22.3,
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
  test("it toggles the value for toggleControllerTemperatureNotification", async () => {
    const mutation = gql`
      mutation($id: ID!, $enabled: Boolean!) {
        toggleControllerTemperatureNotification(
          input: { id: $id, enabled: $enabled }
        ) {
          __typename
          ... on ToggleControllerTemperatureNotificationSuccess {
            controller {
              id
              temperatureNotification {
                enabled
              }
            }
          }
        }
      }
    `;

    const res = client.mutate({
      mutation,
      variables: {
        id: "b06d8593-997a-44a1-ad23-2cf19e5ad071",
        enabled: true,
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
  test("it returns the correct value for humidityNotification", async () => {
    const res = client.query({
      query: gql`
        query($id: ID!) {
          controller(id: $id) {
            id
            humidityNotification {
              enabled
              minInterval
              lower {
                step
                max
                min
                value
              }
              upper {
                step
                max
                min
                value
              }
            }
          }
        }
      `,
      variables: {
        id: "b06d8593-997a-44a1-ad23-2cf19e5ad071",
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
  test("it adjusts the values for adjustControllerHumidityNotification", async () => {
    const res = client.mutate({
      mutation: gql`
        mutation($id: ID!, $lower: Float!, $upper: Float!) {
          adjustControllerHumidityNotificationThreshold(
            input: { id: $id, lower: $lower, upper: $upper }
          ) {
            __typename
            ... on AdjustControllerHumidityNotificationThresholdSuccess {
              controller {
                id
                humidityNotification {
                  enabled
                  minInterval
                  lower {
                    step
                    max
                    min
                    value
                  }
                  upper {
                    step
                    max
                    min
                    value
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        id: "b06d8593-997a-44a1-ad23-2cf19e5ad071",
        lower: 25,
        upper: 45,
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
  test("it toggles the value for toggleControllerHumidityNotification", async () => {
    const mutation = gql`
      mutation($id: ID!, $enabled: Boolean!) {
        toggleControllerHumidityNotification(
          input: { id: $id, enabled: $enabled }
        ) {
          __typename
          ... on ToggleControllerHumidityNotificationSuccess {
            controller {
              id
              humidityNotification {
                enabled
              }
            }
          }
        }
      }
    `;

    const res = client.mutate({
      mutation,
      variables: {
        id: "b06d8593-997a-44a1-ad23-2cf19e5ad071",
        enabled: true,
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
});

describe("location", () => {
  test("it toggles the value for toggleLocationFaultNotification", async () => {
    const mutation = gql`
      mutation($id: ID!, $enabled: Boolean!) {
        toggleLocationFaultNotification(input: { id: $id, enabled: $enabled }) {
          __typename
          ... on ToggleLocationFaultNotificationSuccess {
            location {
              id
              faultNotification {
                enabled
              }
            }
          }
        }
      }
    `;

    const res = client.mutate({
      mutation,
      variables: {
        id: "9c98e454-531c-4042-b494-3a8f8bba1273",
        enabled: true,
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });

  test("it returns the value for faultNotification", async () => {
    const res = client.query({
      query: gql`
        query($id: ID!) {
          location(id: $id) {
            id
            faultNotification {
              enabled
            }
          }
        }
      `,
      variables: {
        id: "9c98e454-531c-4042-b494-3a8f8bba1273",
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });

  test("it toggles the value for toggleLocationHumidityNotification", async () => {
    const mutation = gql`
      mutation($id: ID!, $enabled: Boolean!) {
        toggleLocationHumidityNotification(
          input: { id: $id, enabled: $enabled }
        ) {
          __typename
          ... on ToggleLocationHumidityNotificationSuccess {
            location {
              id
              controllers {
                humidityNotification {
                  enabled
                }
              }
            }
          }
        }
      }
    `;

    const res = client.mutate({
      mutation,
      variables: {
        id: "9c98e454-531c-4042-b494-3a8f8bba1273",
        enabled: true,
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });

  test("it toggles the value for toggleLocationTemperatureNotification", async () => {
    const mutation = gql`
      mutation($id: ID!, $enabled: Boolean!) {
        toggleLocationTemperatureNotification(
          input: { id: $id, enabled: $enabled }
        ) {
          __typename
          ... on ToggleLocationTemperatureNotificationSuccess {
            location {
              id
              controllers {
                temperatureNotification {
                  enabled
                }
              }
            }
          }
        }
      }
    `;

    const res = client.mutate({
      mutation,
      variables: {
        id: "9c98e454-531c-4042-b494-3a8f8bba1273",
        enabled: true,
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
  test("it adjusts the values for adjustLocationHumidityNotification", async () => {
    const res = client.mutate({
      mutation: gql`
        mutation($id: ID!, $lower: Float!, $upper: Float!) {
          adjustLocationHumidityNotificationThreshold(
            input: { id: $id, lower: $lower, upper: $upper }
          ) {
            __typename
            ... on AdjustLocationHumidityNotificationThresholdSuccess {
              location {
                controllers {
                  id
                  humidityNotification {
                    enabled
                    lower {
                      max
                      min
                      value
                    }
                    upper {
                      max
                      min
                      value
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        id: "9c98e454-531c-4042-b494-3a8f8bba1273",
        lower: 25,
        upper: 45,
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
  test("it adjusts the values for adjustLocationTemperatureNotification", async () => {
    const res = client.mutate({
      mutation: gql`
        mutation($id: ID!, $lower: Float!, $upper: Float!) {
          adjustLocationTemperatureNotificationThreshold(
            input: { id: $id, lower: $lower, upper: $upper }
          ) {
            __typename
            ... on AdjustLocationTemperatureNotificationThresholdSuccess {
              location {
                controllers {
                  id
                  temperatureNotification {
                    enabled
                    lower {
                      max
                      min
                      value
                    }
                    upper {
                      max
                      min
                      value
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        id: "9c98e454-531c-4042-b494-3a8f8bba1273",
        lower: 14.5,
        upper: 22.3,
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
  test("it returns the value for temperatureNotification", async () => {
    const res = client.query({
      query: gql`
        query($id: ID!) {
          location(id: $id) {
            id
            temperatureNotification {
              enabled
              minInterval
              upper {
                step
                min
                max
                value
              }
              lower {
                step
                min
                max
                value
              }
            }
          }
        }
      `,
      variables: {
        id: "9c98e454-531c-4042-b494-3a8f8bba1273",
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
  test("it returns the value for humidityNotification", async () => {
    const res = client.query({
      query: gql`
        query($id: ID!) {
          location(id: $id) {
            id
            humidityNotification {
              enabled
              minInterval
              upper {
                step
                min
                max
                value
              }
              lower {
                step
                min
                max
                value
              }
            }
          }
        }
      `,
      variables: {
        id: "9c98e454-531c-4042-b494-3a8f8bba1273",
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
});
describe("user", () => {
  const addTestToken = async (
    token = "123token",
    platform = "IOS"
  ): Promise<
    GraphQLResponse<{
      subscribeToNotifications?: { pushToken?: { token: string } };
    }>
  > => {
    const mutation = gql`
      mutation($token: String!, $platform: Platform!) {
        subscribeToNotifications(
          input: { token: $token, platform: $platform }
        ) {
          __typename
          ... on SubscribeToNotificationsSuccess {
            pushToken {
              token
              id
              status
              platform
            }
          }
        }
      }
    `;
    return await client.mutate({
      mutation,
      variables: {
        token,
        platform,
      },
    });
  };

  test("it queries the user's tokens, and adds a token", async () => {
    const getTokens = gql`
      query {
        me {
          id
          pushTokens {
            id
          }
        }
      }
    `;

    const tokensBefore: PushToken[] = (await client.query({ query: getTokens }))
      .data?.me?.pushTokens;
    expect(tokensBefore.length).toEqual(0);

    const res = await addTestToken();

    expect(res.data?.subscribeToNotifications?.pushToken?.token).toEqual(
      "123token"
    );

    const tokensAfter: PushToken[] = (await client.query({ query: getTokens }))
      .data?.me?.pushTokens;
    expect(tokensAfter.length).toEqual(1);
  });

  test("it removes a push token", async () => {
    await addPushToken({
      userId: "ed75d94a-dde6-48b8-83a3-e2aae86237f5",
      token: "123token",
      platform: Platform.Ios,
      status: PushTokenStatus.Enabled,
    });

    const getTokens = gql`
      query {
        me {
          id
          pushTokens {
            id
          }
        }
      }
    `;

    const tokensBefore: PushToken[] = (await client.query({ query: getTokens }))
      .data?.me?.pushTokens;

    expect(tokensBefore.length).toEqual(1);

    await client.mutate({
      mutation: gql`
        mutation($id: ID!) {
          unsubscribeFromNotifications(input: { id: $id }) {
            __typename
          }
        }
      `,
      variables: {
        id: tokensBefore[0].id,
      },
    });
    const tokensAfter: PushToken[] = (await client.query({ query: getTokens }))
      .data?.me?.pushTokens;

    expect(tokensAfter.length).toEqual(0);
  });
});
