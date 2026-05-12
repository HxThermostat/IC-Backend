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

describe("fan", () => {
  const fanControllerId = "492cc711-4c86-42f5-bb2b-c61187825ffb";

  test("it returns the correct fields for fan", async () => {
    const res = client.query({
      query: gql`
        query($id: ID!) {
          controller(id: $id) {
            id
            fan {
              __typename
              ... on SpeedNameFan {
                activeSpeedName
                running
              }
              ... on PercentageFan {
                activeSpeedPercent
                running
              }
            }
          }
        }
      `,
      variables: {
        id: fanControllerId,
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
});
