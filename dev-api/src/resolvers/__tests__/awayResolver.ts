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
  const controllerId = "b06d8593-997a-44a1-ad23-2cf19e5ad071";

  test("it returns the correct fields for Away", () => {
    const res = client.query({
      query: gql`
        query($id: ID!) {
          controller(id: $id) {
            id
            away {
              active
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
      `,
      variables: {
        id: controllerId,
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });

  test("it sets away active, and updates the setpoint", () => {
    const res = client.mutate({
      mutation: gql`
        mutation($id: ID!, $active: Boolean!) {
          toggleControllerAway(input: { id: $id, active: $active }) {
            __typename
            ... on ToggleControllerAwaySuccess {
              controller {
                id
                away {
                  active
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
        id: controllerId,
        active: true,
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
  test("it changes the away setpoint for dualsetpoint controllers", () => {
    const res = client.mutate({
      mutation: gql`
        mutation(
          $id: ID!
          $dual: DualSetpointInput
          $single: SingleSetpointInput
        ) {
          changeControllerAwaySetpoint(
            input: { id: $id, dual: $dual, single: $single }
          ) {
            __typename
            ... on ChangeControllerAwaySetpointSuccess {
              controller {
                id
                away {
                  active
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
        }
      `,
      variables: {
        id: controllerId,
        dual: {
          upper: 26.1111,
          lower: 11.1111,
        },
        single: null,
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
});

describe("location", () => {
  test("it sets away active for all controllers", async () => {
    const res = client.mutate({
      mutation: gql`
        mutation($id: ID!, $active: Boolean!) {
          toggleLocationAway(input: { id: $id, active: $active }) {
            __typename
            ... on ToggleLocationAwaySuccess {
              location {
                away {
                  active
                }
                controllers {
                  away {
                    active
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        id: "9c98e454-531c-4042-b494-3a8f8bba1273",
        active: true,
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
});
