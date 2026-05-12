import { setupPolly, useTestData } from "test-utils";

import {
  ApolloServerTestClient,
  createTestClient,
} from "apollo-server-testing";
import { ApolloServer, gql } from "apollo-server-express";

import buildServer, { buildSchema, loaders } from "../../../server";

import { findUserById } from "../../../fixtures";

import { sendbirdClient } from "../../../utils/sendbird";

setupPolly(__dirname);
useTestData();

// Config values for sendbird
jest.mock("../../../config", () => {
  const originalConfig = jest.requireActual("../../../config");

  return {
    __esModule: true,
    ...originalConfig,
    SENDBIRD_API_TOKEN: "test-api-token",
    SENDBIRD_APP_ID: "test-app-id",
  } as unknown;
});

let server: ApolloServer;
let client: ApolloServerTestClient;

const ONE_WEEK_FROM_NOW = Date.now() + 7 * 24 * 60 * 60 * 1000;

beforeEach(async () => {
  const schema = await buildSchema();
  server = buildServer(schema, {
    user: (await findUserById("ed75d94a-dde6-48b8-83a3-e2aae86237f5")) ?? null,
    loaders: loaders("ed75d94a-dde6-48b8-83a3-e2aae86237f5"),
  });
  client = createTestClient(server);
});

describe("requestSurveySession", () => {
  test("creates user and returns session info", async () => {
    const fakeUrlResponses: { [key: string]: unknown } = {
      users: null,
      "users/ed75d94a-dde6-48b8-83a3-e2aae86237f5": {
        user_id: "ed75d94a-dde6-48b8-83a3-e2aae86237f5",
        nickname: "klimate@kraftful.com",
      },
      "users/ed75d94a-dde6-48b8-83a3-e2aae86237f5/token": {
        token: "test-token-1234",
        expires_at: ONE_WEEK_FROM_NOW,
      },
    };
    const returnFakeResponse = (url: string): unknown => ({
      json: () => fakeUrlResponses[url],
    });

    const responseMock = jest.fn().mockImplementation(returnFakeResponse);
    sendbirdClient.get = responseMock;
    sendbirdClient.post = responseMock;

    const {
      data: { requestSurveySession: result },
    } = await client.query({
      query: gql`
        mutation {
          requestSurveySession {
            __typename
            userId
            userName
            sessionToken
            sessionExpiresAt
          }
        }
      `,
    });

    expect(result["userId"]).toBe("ed75d94a-dde6-48b8-83a3-e2aae86237f5");
    expect(result["sessionToken"]).toBe("test-token-1234");
  });
});
