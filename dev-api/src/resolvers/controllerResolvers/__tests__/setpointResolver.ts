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

describe("controller", () => {
  const setpointId = "b06d8593-997a-44a1-ad23-2cf19e5ad071";

  test("it returns the correct fields for DualSetpoint", () => {
    const res = client.query({
      query: gql`
        query($id: ID!) {
          controller(id: $id) {
            id
            setpoint {
              __typename
              ... on SingleSetpoint {
                min
                max
                value
                step
              }
              ... on DualSetpoint {
                lower {
                  min
                  max
                  value
                  step
                }
                upper {
                  min
                  max
                  value
                  step
                }
                minInterval
              }
            }
          }
        }
      `,
      variables: {
        id: setpointId,
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });

  test("it updates the setpoint for DualSetpoint", () => {
    const res = client.mutate({
      mutation: gql`
        mutation($id: ID!, $dual: DualSetpointInput) {
          changeSetpoint(input: { id: $id, dual: $dual }) {
            __typename
            ... on ChangeSetpointSuccess {
              controller {
                id
                setpoint {
                  __typename
                  ... on SingleSetpoint {
                    min
                    max
                    value
                    step
                  }
                  ... on DualSetpoint {
                    lower {
                      min
                      max
                      value
                      step
                    }
                    upper {
                      min
                      max
                      value
                      step
                    }
                    minInterval
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        id: setpointId,
        dual: {
          lower: 16,
          upper: 20,
        },
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
});
