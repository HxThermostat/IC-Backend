import { setupPolly, useTestData } from "test-utils";

import {
  ApolloServerTestClient,
  createTestClient,
} from "apollo-server-testing";
import { ApolloServer, gql } from "apollo-server-express";

import buildServer, { buildSchema, loaders } from "../../server";

setupPolly(__dirname);
useTestData();

jest.mock("../../utils");

let server: ApolloServer;
let client: ApolloServerTestClient;

beforeEach(async () => {
  const schema = await buildSchema();
  server = buildServer(schema, {
    user: null,
    loaders: loaders(),
  });
  client = createTestClient(server);
});

describe("features", () => {
  test("it returns the correct fields", async () => {
    const res = client.query({
      query: gql`
        query {
          features {
            away
            changeDefaultHoldLengthController
            changeDefaultHoldLengthLocation
            connect
            faultLogsController
            faultLogsLocation
            rename
            schedule
            signIn
          }
        }
      `,
    });

    return expect(res).resolves.toMatchSnapshot();
  });
});
