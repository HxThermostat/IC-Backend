import { setupPolly, useTestData } from "test-utils";

import {
  ApolloServerTestClient,
  createTestClient,
} from "apollo-server-testing";
import { ApolloServer, gql } from "apollo-server-express";

import { findUserById } from "../../../fixtures";

import buildServer, { buildSchema, loaders } from "../../../server";

import { TemperaturePreset } from "../../../data/models";

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

describe("scheduleEvents", () => {
  test("it returns all scheduleEvents", async () => {
    const res = client.query({
      query: gql`
        query {
          scheduleEvents {
            id
          }
        }
      `,
    });

    return expect(res).resolves.toMatchSnapshot();
  });
});

describe("controller", () => {
  const controllerId = "b06d8593-997a-44a1-ad23-2cf19e5ad071";
  test("returns the weekly schedule", async () => {
    const res = client.query({
      query: gql`
        query($id: ID!) {
          controller(id: $id) {
            schedule {
              days {
                day
                full
                events {
                  id
                }
              }
              monday {
                day
                full
                events {
                  id
                }
              }
              tuesday {
                day
                full
                events {
                  id
                }
              }
              wednesday {
                day
                full
                events {
                  id
                }
              }
              thursday {
                day
                full
                events {
                  id
                }
              }
              friday {
                day
                full
                events {
                  id
                }
              }
              saturday {
                day
                full
                events {
                  id
                }
              }
              sunday {
                day
                full
                events {
                  id
                }
              }
              maxEvents
              minEvents
              minEventInterval
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

  test("returns the activeHold", async () => {
    const res = client.query({
      query: gql`
        query($id: ID!) {
          controller(id: $id) {
            activeHold {
              ... on HoldLengthNextEvent {
                _
              }
              ... on HoldLengthNextEvent {
                _
              }
              ... on HoldLengthDate {
                date
              }
              ... on HoldLengthHours {
                hours
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
});

describe("scheduleEvent", () => {
  it("returns the correct fields", async () => {
    const id = "b06d8593-997a-44a1-ad23-2cf19e5ad071--SUN--0";
    const res = client.query({
      query: gql`
        query($id: ID!) {
          scheduleEvent(id: $id) {
            id
            day
            removable
            start {
              day
              hour
              minute
            }
            end {
              day
              hour
              minute
            }
            nextEvent {
              id
              day
            }
            prevEvent {
              id
              day
            }
            temperaturePreset {
              name
              slot
              fanMode
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
        id,
      },
    });

    return expect(res).resolves.toMatchSnapshot();
  });
});

describe("mutations", () => {
  test("it adds a new schedule event", async () => {
    const HomePreset = await TemperaturePreset.findOne({
      where: { slot: "HOME" },
    });

    const getEvents = gql`
      query {
        scheduleEvents {
          id
        }
      }
    `;
    const eventsBefore = await client.query({
      query: getEvents,
    });

    const controllerId = "b06d8593-997a-44a1-ad23-2cf19e5ad071";
    await client.mutate({
      mutation: gql`
        mutation(
          $id: ID!
          $start: ScheduleTimeInput!
          $end: ScheduleTimeInput!
          $temperaturePresetId: ID
        ) {
          addScheduleEvent(
            input: {
              id: $id
              start: $start
              end: $end
              temperaturePresetId: $temperaturePresetId
            }
          ) {
            __typename
            ... on AddScheduleEventSuccess {
              controller {
                id
              }
            }
          }
        }
      `,
      variables: {
        id: controllerId,
        start: { day: "SUN", hour: 6, minute: 15 },
        end: { day: "SUN", hour: 12, minute: 30 },
        temperaturePresetId: HomePreset?.id,
      },
    });

    const eventsAfter = await client.query({
      query: getEvents,
    });

    return expect(eventsAfter["data"]["scheduleEvents"].length).toEqual(
      parseInt(eventsBefore["data"]["scheduleEvents"].length) + 1
    );
  });

  test("it changes schedule event time", async () => {
    const id = "b06d8593-997a-44a1-ad23-2cf19e5ad071--SUN--0";
    const getEvent = gql`
      query($id: ID!) {
        scheduleEvent(id: $id) {
          id
          start {
            day
            hour
            minute
          }
          end {
            day
            hour
            minute
          }
        }
      }
    `;

    await client.mutate({
      mutation: gql`
        mutation(
          $id: ID!
          $start: ScheduleTimeInput!
          $end: ScheduleTimeInput!
        ) {
          changeScheduleEventTime(
            input: { id: $id, start: $start, end: $end }
          ) {
            __typename
            ... on ChangeScheduleEventTimeSuccess {
              scheduleEvent {
                id
              }
            }
          }
        }
      `,
      variables: {
        id: id,
        start: { day: "SUN", hour: 6, minute: 15 },
        end: { day: "SUN", hour: 12, minute: 30 },
      },
    });

    const eventAfter = await client.query({
      query: getEvent,
      variables: { id },
    });

    const res = eventAfter?.data?.scheduleEvent;

    expect(res.start.day).toBe("SUN");
    expect(res.end.day).toBe("SUN");

    expect(res.start.hour).toBe(6);
    expect(res.end.hour).toBe(12);

    expect(res.start.minute).toBe(15);
    return expect(res.end.minute).toBe(30);
  });

  test("it changes schedule event temperature preset", async () => {
    const id = "b06d8593-997a-44a1-ad23-2cf19e5ad071--SUN--0";
    const getEvent = gql`
      query($id: ID!) {
        scheduleEvent(id: $id) {
          id
          temperaturePreset {
            id
          }
        }
      }
    `;

    const SleepPreset = await TemperaturePreset.findOne({
      where: { slot: "SLEEP" },
    });
    await client.mutate({
      mutation: gql`
        mutation($id: ID!, $temperaturePresetId: ID!) {
          changeScheduleEventTemperaturePreset(
            input: { id: $id, temperaturePresetId: $temperaturePresetId }
          ) {
            __typename
            ... on ChangeScheduleEventTemperaturePresetSuccess {
              scheduleEvent {
                id
              }
            }
          }
        }
      `,
      variables: {
        id: id,
        temperaturePresetId: SleepPreset?.id,
      },
    });

    const eventAfter = await client.query({
      query: getEvent,
      variables: { id },
    });

    const res = eventAfter?.data?.scheduleEvent;

    expect(res.temperaturePreset.id).toBe(SleepPreset?.id);
  });
  test("it copies a day's schedule to other days", async () => {
    const controllerId = "b06d8593-997a-44a1-ad23-2cf19e5ad071";

    const res = client.mutate({
      mutation: gql`
        mutation($id: ID!, $source: Day!, $destination: [Day!]!) {
          copySchedule(
            input: { id: $id, source: $source, destination: $destination }
          ) {
            __typename
            ... on CopyScheduleSuccess {
              controller {
                schedule {
                  days {
                    day
                    full
                    events {
                      start {
                        day
                        hour
                        minute
                      }
                      end {
                        day
                        hour
                        minute
                      }
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
        source: "MON",
        destination: ["TUE", "WED", "SAT"],
      },
    });
    return expect(res).resolves.toMatchSnapshot();
  });
  test("it removes a schedule event", async () => {
    const id = "b06d8593-997a-44a1-ad23-2cf19e5ad071--SUN--0";

    const getEvents = gql`
      query {
        scheduleEvents {
          id
        }
      }
    `;
    const eventsBefore = await client.query({
      query: getEvents,
    });

    const controllerId = "b06d8593-997a-44a1-ad23-2cf19e5ad071";
    await client.mutate({
      mutation: gql`
        mutation($id: ID!, $scheduleEventId: ID!) {
          removeScheduleEvent(
            input: { id: $id, scheduleEventId: $scheduleEventId }
          ) {
            __typename
            ... on RemoveScheduleEventSuccess {
              controller {
                id
              }
            }
          }
        }
      `,
      variables: {
        id: controllerId,
        scheduleEventId: id,
      },
    });

    const eventsAfter = await client.query({
      query: getEvents,
    });

    return expect(eventsAfter["data"]["scheduleEvents"].length).toEqual(
      parseInt(eventsBefore["data"]["scheduleEvents"].length) - 1
    );
  });
});
