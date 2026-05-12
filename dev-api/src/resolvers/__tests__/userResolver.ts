import { setupPolly, useTestData } from "test-utils";

import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server-express";

import { findUserById } from "../../fixtures";

import buildServer, { buildSchema, loaders } from "../../server";

setupPolly(__dirname);
useTestData();

jest.mock("../../utils");

describe("me", () => {
  test("it returns the correct fields when authenticated", async () => {
    const schema = await buildSchema();
    const server = buildServer(schema, {
      user:
        (await findUserById("ed75d94a-dde6-48b8-83a3-e2aae86237f5")) ?? null,
      loaders: loaders("ed75d94a-dde6-48b8-83a3-e2aae86237f5"),
    });

    const client = createTestClient(server);

    const res = client.query({
      query: gql`
        query {
          me {
            id
          }
        }
      `,
    });

    return expect(res).resolves.toMatchSnapshot();
  });

  test("it returns null when unauthenticated", async () => {
    const schema = await buildSchema();
    const server = buildServer(schema, { user: null, loaders: loaders() });

    const client = createTestClient(server);

    const res = client.query({
      query: gql`
        query {
          me {
            id
          }
        }
      `,
    });

    return expect(res).resolves.toMatchSnapshot();
  });
});
