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

describe("controller", () => {
  test("it changes the name", async () => {
    const res = client.mutate({
      mutation: gql`
        mutation($id: ID!, $name: String!) {
          renameController(input: { id: $id, name: $name }) {
            __typename
            ... on RenameControllerSuccess {
              controller {
                id
                name
              }
            }
          }
        }
      `,
      variables: {
        id: "b06d8593-997a-44a1-ad23-2cf19e5ad071",
        name: "Dining Room",
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
});

describe("location", () => {
  test("it changes the name", async () => {
    const res = client.mutate({
      mutation: gql`
        mutation($id: ID!, $name: String!) {
          renameLocation(input: { id: $id, name: $name }) {
            __typename
            ... on RenameLocationSuccess {
              location {
                id
                name
              }
            }
          }
        }
      `,
      variables: {
        id: "9c98e454-531c-4042-b494-3a8f8bba1273",
        name: "Vacation home",
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
});
