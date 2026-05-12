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

// These config values are mocked to enable review rating requests
jest.mock("../../../config", () => {
  const originalConfig = jest.requireActual("../../../config");

  return {
    __esModule: true,
    ...originalConfig,
    REVIEWS_ENABLED: true,
    REVIEW_PROBABILITY: 1,
  } as unknown;
});

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

describe("requestRating", () => {
  test("requestRating", async () => {
    jest.useFakeTimers("modern").setSystemTime(new Date("2021-01-01"));
    const query = gql`
      query(
        $build: String!
        $installedAt: String!
        $lastDisplayedAt: String
        $platform: Platform!
        $version: String!
      ) {
        requestRating(
          input: {
            build: $build
            installedAt: $installedAt
            lastDisplayedAt: $lastDisplayedAt
            platform: $platform
            version: $version
          }
        )
      }
    `;

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const eligibleRes = await client.query({
      query: query,
      variables: {
        build: "1",
        platform: "IOS",
        version: "1.0",
        installedAt: threeMonthsAgo.toISOString(),
        lastDisplayedAt: null,
      },
    });

    const ineligibleRes = await client.query({
      query: query,
      variables: {
        build: "1",
        platform: "IOS",
        version: "1.0",
        installedAt: threeMonthsAgo.toISOString(),
        lastDisplayedAt: oneDayAgo.toISOString(),
      },
    });

    expect(eligibleRes.data["requestRating"]).toEqual(true);
    expect(ineligibleRes.data["requestRating"]).toEqual(false);

    jest.useRealTimers();
  });
});
