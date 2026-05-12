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
    SURVEYS_ENABLED: true,
    SURVEY_PROBABILITY: 1,
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

describe("requestSurveyFeedback", () => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  const twelveHoursAgo = new Date();
  twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 1);
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  const oneMinuteAgo = new Date();
  oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);

  test("returns true for happy path", async () => {
    // Happy path: installed three months ago, lastResponse one minute ago, never displayed
    const query = gql`
      query(
        $build: String!
        $installedAt: String!
        $lastDisplayedAt: String
        $lastResponseAt: String
        $platform: Platform!
        $version: String!
      ) {
        requestSurveyFeedback(
          input: {
            build: $build
            installedAt: $installedAt
            lastDisplayedAt: $lastDisplayedAt
            lastResponseAt: $lastResponseAt
            platform: $platform
            version: $version
          }
        )
      }
    `;

    const {
      data: { requestSurveyFeedback },
    } = await client.query({
      query: query,
      variables: {
        build: "1",
        platform: "IOS",
        version: "1.0",
        installedAt: threeMonthsAgo.toISOString(),
        lastResponseAt: oneMinuteAgo.toISOString(),
        lastDisplayedAt: null,
      },
    });

    expect(requestSurveyFeedback).toEqual(true);
  });

  test("returns true when recently responded", async () => {
    // installed three months ago, lastResponse 12 hours ago, displayed one hour ago
    const query = gql`
      query(
        $build: String!
        $installedAt: String!
        $lastDisplayedAt: String
        $lastResponseAt: String
        $platform: Platform!
        $version: String!
      ) {
        requestSurveyFeedback(
          input: {
            build: $build
            installedAt: $installedAt
            lastDisplayedAt: $lastDisplayedAt
            lastResponseAt: $lastResponseAt
            platform: $platform
            version: $version
          }
        )
      }
    `;

    const {
      data: { requestSurveyFeedback },
    } = await client.query({
      query: query,
      variables: {
        build: "1",
        platform: "IOS",
        version: "1.0",
        installedAt: threeMonthsAgo.toISOString(),
        lastResponseAt: oneMinuteAgo.toISOString(),
        lastDisplayedAt: oneHourAgo.toISOString(),
      },
    });

    expect(requestSurveyFeedback).toEqual(true);
  });

  test("returns false for fresh installs", async () => {
    // installed one day ago, lastResponse one minute ago, never displayed
    const query = gql`
      query(
        $build: String!
        $installedAt: String!
        $lastDisplayedAt: String
        $lastResponseAt: String
        $platform: Platform!
        $version: String!
      ) {
        requestSurveyFeedback(
          input: {
            build: $build
            installedAt: $installedAt
            lastDisplayedAt: $lastDisplayedAt
            lastResponseAt: $lastResponseAt
            platform: $platform
            version: $version
          }
        )
      }
    `;

    const {
      data: { requestSurveyFeedback },
    } = await client.query({
      query: query,
      variables: {
        build: "1",
        platform: "IOS",
        version: "1.0",
        installedAt: oneDayAgo.toISOString(),
        lastResponseAt: oneMinuteAgo.toISOString(),
        lastDisplayedAt: oneHourAgo.toISOString(),
      },
    });

    expect(requestSurveyFeedback).toEqual(false);
  });

  test("returns false when recently displayed", async () => {
    // installed three months ago, lastResponse one minute ago, last displayed one day ago
    const query = gql`
      query(
        $build: String!
        $installedAt: String!
        $lastDisplayedAt: String
        $lastResponseAt: String
        $platform: Platform!
        $version: String!
      ) {
        requestSurveyFeedback(
          input: {
            build: $build
            installedAt: $installedAt
            lastDisplayedAt: $lastDisplayedAt
            lastResponseAt: $lastResponseAt
            platform: $platform
            version: $version
          }
        )
      }
    `;

    const {
      data: { requestSurveyFeedback },
    } = await client.query({
      query: query,
      variables: {
        build: "1",
        platform: "IOS",
        version: "1.0",
        installedAt: oneDayAgo.toISOString(),
        lastResponseAt: oneMinuteAgo.toISOString(),
        lastDisplayedAt: oneDayAgo.toISOString(),
      },
    });

    expect(requestSurveyFeedback).toEqual(false);
  });
});
