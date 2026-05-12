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

describe("connectAylaDisplay", () => {
  test("adds a location", async () => {
    const res = await client.mutate({
      mutation: gql`
        mutation($token: String!) {
          connectAylaDisplay(input: { token: $token }) {
            __typename
            ... on ConnectAylaDisplaySuccess {
              location {
                id
              }
            }
          }
        }
      `,
      variables: {
        token: "abc123",
      },
    });

    expect(typeof res.data?.["connectAylaDisplay"]?.["location"]?.["id"]).toBe(
      "string"
    );
  });
});
