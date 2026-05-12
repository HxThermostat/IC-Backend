import { setupPolly, useTestData } from "test-utils";

import {
  ApolloServerTestClient,
  createTestClient,
} from "apollo-server-testing";
import { ApolloServer, gql } from "apollo-server-express";

import { findUserById } from "../../fixtures";

import buildServer, { buildSchema, loaders } from "../../server";
import { TemperaturePreset } from "../../data/models";

setupPolly(__dirname);
useTestData();
jest.mock("../../utils");

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

describe("location", () => {
  test("it returns the presets for a location", async () => {
    const id = "9c98e454-531c-4042-b494-3a8f8bba1273";
    const res = await client.query({
      query: gql`
        query($id: ID!) {
          location(id: $id) {
            temperaturePresets {
              id
              slot
            }
          }
        }
      `,
      variables: {
        id,
      },
    });
    const temperaturePresets: { id: string; slot: string }[] =
      res.data["location"]["temperaturePresets"];
    expect(temperaturePresets.map(({ slot }) => slot)).toEqual(
      expect.arrayContaining(["HOME", "SLEEP", "AWAY", "CUSTOM"])
    );
  });
});

describe("temperaturePresets", () => {
  test("it returns all temperaturePresets", async () => {
    const res = await client.query({
      query: gql`
        query {
          temperaturePresets {
            id
            slot
          }
          locations {
            temperaturePresets {
              id
            }
          }
        }
      `,
    });

    expect(res).toMatchSnapshot();
    const temperaturePresets: { id: string }[] = res.data["temperaturePresets"];
    const locations: { temperaturePresets: { id: string } }[] =
      res.data["locations"];

    const presetIds = temperaturePresets.map(({ id }) => id);

    const locationPresetIds = locations
      .flatMap(({ temperaturePresets }) => temperaturePresets)
      .map(({ id }) => id);

    expect(new Set(presetIds)).toEqual(new Set(locationPresetIds));
  });
});

describe("temperaturePreset", () => {
  test("it returns the correct fields", async () => {
    const HomePreset = await TemperaturePreset.findOne({
      where: { slot: "HOME" },
    });
    const res = client.query({
      query: gql`
        query($id: ID!) {
          temperaturePreset(id: $id) {
            name
            slot
            removable
            setpoint {
              __typename
              ... on SingleSetpoint {
                min
                max
                value
                step
              }
              ... on DualSetpoint {
                lower {
                  min
                  max
                  value
                  step
                }
                upper {
                  min
                  max
                  value
                  step
                }
                minInterval
              }
            }
            fanMode
          }
        }
      `,
      variables: {
        id: HomePreset?.id,
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
});

describe("mutations", () => {
  test("it adds a new temperature preset", async () => {
    const res = client.mutate({
      mutation: gql`
        mutation(
          $id: ID!
          $name: String!
          $dual: DualSetpointInput
          $single: SingleSetpointInput
          $fanMode: FanMode
        ) {
          addTemperaturePreset(
            input: {
              id: $id
              name: $name
              dual: $dual
              single: $single
              fanMode: $fanMode
            }
          ) {
            __typename
            ... on AddTemperaturePresetSuccess {
              temperaturePreset {
                name
                slot
                setpoint {
                  __typename
                  ... on SingleSetpoint {
                    min
                    max
                    value
                    step
                  }
                  ... on DualSetpoint {
                    lower {
                      min
                      max
                      value
                      step
                    }
                    upper {
                      min
                      max
                      value
                      step
                    }
                    minInterval
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        id: "9c98e454-531c-4042-b494-3a8f8bba1273",
        name: "Hawaii",
        dual: { lower: 22, upper: 27 },
        fanMode: "AUTO",
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });

  test("it changes a presets setpoint", async () => {
    const HomePreset = await TemperaturePreset.findOne({
      where: { slot: "HOME" },
    });
    const res = client.mutate({
      mutation: gql`
        mutation(
          $id: ID!
          $single: SingleSetpointInput
          $dual: DualSetpointInput
        ) {
          changeTemperaturePresetSetpoint(
            input: { id: $id, dual: $dual, single: $single }
          ) {
            __typename
            ... on ChangeTemperaturePresetSetpointSuccess {
              temperaturePreset {
                slot
                setpoint {
                  __typename
                  ... on SingleSetpoint {
                    min
                    max
                    value
                    step
                  }
                  ... on DualSetpoint {
                    lower {
                      min
                      max
                      value
                      step
                    }
                    upper {
                      min
                      max
                      value
                      step
                    }
                    minInterval
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        id: HomePreset?.id,
        dual: { lower: 12, upper: 19 },
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });

  test("it changes a presets fanmode", async () => {
    const HomePreset = await TemperaturePreset.findOne({
      where: { slot: "HOME" },
    });
    const res = client.mutate({
      mutation: gql`
        mutation($id: ID!, $fanMode: FanMode!) {
          changeTemperaturePresetFanMode(
            input: { id: $id, fanMode: $fanMode }
          ) {
            __typename
            ... on ChangeTemperaturePresetFanModeSuccess {
              temperaturePreset {
                fanMode
              }
            }
          }
        }
      `,
      variables: {
        id: HomePreset?.id,
        fanMode: "FORTYFIVE",
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });

  test("it removes a preset", async () => {
    const CustomPreset = await TemperaturePreset.findOne({
      where: { slot: "CUSTOM" },
    });
    const getEvents = gql`
      query {
        temperaturePresets {
          id
        }
      }
    `;
    const eventsBefore = await client.query({
      query: getEvents,
    });
    await client.mutate({
      mutation: gql`
        mutation($locationId: ID!, $id: ID!) {
          removeTemperaturePreset(input: { locationId: $locationId, id: $id }) {
            __typename
            ... on RemoveTemperaturePresetSuccess {
              __typename
            }
          }
        }
      `,
      variables: {
        locationId: "9c98e454-531c-4042-b494-3a8f8bba1273",
        id: CustomPreset?.id,
      },
    });

    const eventsAfter = await client.query({
      query: getEvents,
    });

    return expect(eventsAfter["data"]["temperaturePresets"].length).toEqual(
      parseInt(eventsBefore["data"]["temperaturePresets"].length) - 1
    );
  });

  test("it changes a presets name", async () => {
    const HomePreset = await TemperaturePreset.findOne({
      where: { slot: "HOME" },
    });
    const res = client.mutate({
      mutation: gql`
        mutation($id: ID!, $name: String!) {
          changeTemperaturePresetName(input: { id: $id, name: $name }) {
            __typename
            ... on ChangeTemperaturePresetNameSuccess {
              temperaturePreset {
                name
              }
            }
          }
        }
      `,
      variables: {
        id: HomePreset?.id,
        name: "New Name",
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
});
