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

describe("checkEmail", () => {
  test("it marks available emails as available", async () => {
    const res = await client.mutate({
      mutation: gql`
        mutation {
          checkEmail(input: { email: "available@example.com" }) {
            available
          }
        }
      `,
    });

    expect(res.data["checkEmail"]["available"]).toBe(true);
  });

  test("it marks taken emails as taken", async () => {
    const res = await client.mutate({
      mutation: gql`
        mutation {
          checkEmail(input: { email: "klimate@kraftful.com" }) {
            available
          }
        }
      `,
    });

    expect(res.data["checkEmail"]["available"]).toBe(false);
  });
});

describe("sendToken", () => {
  test("it succeeds for existing accounts", async () => {
    const res = await client.mutate({
      mutation: gql`
        mutation {
          sendToken(input: { email: "klimate@kraftful.com" }) {
            __typename
          }
        }
      `,
    });

    expect(res.data["sendToken"]["__typename"]).toBe("SendTokenSuccess");
  });

  test("it fails for unregistered accounts", async () => {
    const res = await client.mutate({
      mutation: gql`
        mutation {
          sendToken(input: { email: "available@example.com" }) {
            __typename
          }
        }
      `,
    });

    expect(res.data["sendToken"]["__typename"]).toBe("EmailInvalid");
  });
});

describe("signIn", () => {
  test("it succeeds with a valid token", async () => {
    const res = await client.mutate({
      mutation: gql`
        mutation {
          signIn(input: { email: "klimate@kraftful.com", token: "abcd1234" }) {
            __typename
          }
        }
      `,
    });

    expect(res.data["signIn"]["__typename"]).toBe("SignInSuccess");
  });

  test("it fails with an invalid token", async () => {
    const res = await client.mutate({
      mutation: gql`
        mutation {
          signIn(input: { email: "klimate@kraftful.com", token: "invalid" }) {
            __typename
          }
        }
      `,
    });

    expect(res.data["signIn"]["__typename"]).toBe("TokenInvalid");
  });

  test("it fails with an invalid email", async () => {
    const res = await client.mutate({
      mutation: gql`
        mutation {
          signIn(input: { email: "available@example.com", token: "invalid" }) {
            __typename
          }
        }
      `,
    });

    expect(res.data["signIn"]["__typename"]).toBe("EmailInvalid");
  });
});

describe("refreshToken", () => {
  test("it refreshes with a valid token", async () => {
    const signIn = await client.mutate({
      mutation: gql`
        mutation {
          signIn(input: { email: "klimate@kraftful.com", token: "abcd1234" }) {
            ... on SignInSuccess {
              refreshToken
            }
          }
        }
      `,
    });

    const token = signIn.data["signIn"]["refreshToken"] as string;

    const res = await client.mutate({
      mutation: gql`
        mutation($token: String!) {
          refreshToken(input: { token: $token }) {
            __typename
          }
        }
      `,
      variables: {
        token: token,
      },
    });

    expect(res.data["refreshToken"]["__typename"]).toBe("RefreshTokenSuccess");
  });
});
