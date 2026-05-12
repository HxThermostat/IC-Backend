import { setupPolly, useTestData } from "test-utils";

import {
  ApolloServerTestClient,
  createTestClient,
} from "apollo-server-testing";
import { ApolloServer, gql } from "apollo-server-express";

import { findUserById } from "../../../fixtures";

import buildServer, { buildSchema, loaders } from "../../../server";

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

describe("location", () => {
  test("it returns the correct value", async () => {
    const res = client.query({
      query: gql`
        query($id: ID!) {
          location(id: $id) {
            id
            temperatureUnit
          }
        }
      `,
      variables: {
        id: "9c98e454-531c-4042-b494-3a8f8bba1273",
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });

  test("it changes the temperatureUnit", async () => {
    const res = client.mutate({
      mutation: gql`
        mutation($id: ID!, $temperatureUnit: TemperatureUnit!) {
          changeTemperatureUnit(
            input: { id: $id, temperatureUnit: $temperatureUnit }
          ) {
            __typename
            ... on ChangeTemperatureUnitSuccess {
              location {
                id
                temperatureUnit
              }
            }
          }
        }
      `,
      variables: {
        id: "9c98e454-531c-4042-b494-3a8f8bba1273",
        temperatureUnit: "C",
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
});
