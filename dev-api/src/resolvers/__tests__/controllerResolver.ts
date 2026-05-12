import { setupPolly, useTestData } from "test-utils";

import {
  ApolloServerTestClient,
  createTestClient,
} from "apollo-server-testing";
import { ApolloServer, gql } from "apollo-server-express";

import { findUserById } from "../../fixtures";

import buildServer, { buildSchema, loaders } from "../../server";

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

describe("controllers", () => {
  test("it returns multiple controllers", async () => {
    const res = client.query({
      query: gql`
        query {
          controllers {
            id
          }
        }
      `,
    });

    return expect(res).resolves.toMatchSnapshot();
  });
});

describe("controller", () => {
  const id = "b06d8593-997a-44a1-ad23-2cf19e5ad071";

  test("it returns the correct fields", async () => {
    const res = client.query({
      query: gql`
        query($id: ID!) {
          controller(id: $id) {
            id
            call
            humidityAmbient
            name
            temperatureAmbient
            zoning
          }
        }
      `,
      variables: {
        id,
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });

  test("it resolves the location", async () => {
    const res = await client.query({
      query: gql`
        query($id: ID!) {
          controller(id: $id) {
            location {
              id
            }
          }
        }
      `,
      variables: {
        id,
      },
    });

    expect(res.data["controller"]["location"]["id"]).toBe(
      "9c98e454-531c-4042-b494-3a8f8bba1273"
    );
  });
});

describe("location", () => {
  const id = "9c98e454-531c-4042-b494-3a8f8bba1273";

  test("it resolves the controllers", async () => {
    const res = await client.query({
      query: gql`
        query($id: ID!) {
          location(id: $id) {
            controllers {
              id
            }
          }
        }
      `,
      variables: {
        id,
      },
    });

    const controllers: { id: string }[] = res.data["location"]["controllers"];
    expect(controllers.map(({ id }) => id)).toEqual(
      expect.arrayContaining([
        "b06d8593-997a-44a1-ad23-2cf19e5ad071",
        "492cc711-4c86-42f5-bb2b-c61187825ffb",
      ])
    );
  });

  test("it doesn't resolves a single controller", async () => {
    const res = await client.query({
      query: gql`
        query($id: ID!) {
          location(id: $id) {
            controller {
              id
            }
          }
        }
      `,
      variables: {
        id,
      },
    });

    expect(res.data["location"]["controller"]).toBeNull();
  });
});
