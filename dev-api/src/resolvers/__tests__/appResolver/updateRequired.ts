import { setupPolly, useTestData } from "test-utils";

import {
  ApolloServerTestClient,
  createTestClient,
} from "apollo-server-testing";
import { ApolloServer, gql } from "apollo-server-express";

import buildServer, { buildSchema, loaders } from "../../../server";

import { findUserById } from "../../../fixtures";

setupPolly(__dirname);
useTestData();

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

describe("updateRequired", () => {
  test("updates are not required", async () => {
    const res = await client.query({
      query: gql`
        query($platform: Platform!, $version: String!, $build: String!) {
          updateRequired(
            input: { platform: $platform, version: $version, build: $build }
          )
        }
      `,
      variables: {
        platform: "IOS",
        version: "1.0.0",
        build: "1",
      },
    });

    expect(res.data["updateRequired"]).toBeNull();
  });
});
