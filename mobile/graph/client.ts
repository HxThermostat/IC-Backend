import {
  ApolloClient,
  InMemoryCache,
  StoreObject,
  FieldFunctionOptions,
  FieldMergeFunction,
} from "@apollo/client";

import { Platform } from "react-native";
import {
  Controller,
  Location,
  Mode,
  ScheduleEvent,
  TemperaturePreset,
} from "./schema";

import { buildLink } from "./links";

import introspectionResults from "./introspectionResult";

const objectMerge: FieldMergeFunction = (existing, incoming) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return incoming && { ...existing, ...incoming };
};

const takeIncomingValues: FieldMergeFunction = (existing, incoming) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return incoming;
};

export function mergeArrayByField<T>(
  field: keyof T,
  keepExisting = true,
  incomingNullable = false
) {
  return function merge(
    existing: readonly (T & StoreObject)[] | null,
    incoming: readonly (T & StoreObject)[] | null,
    { readField, mergeObjects }: FieldFunctionOptions
  ): (T & StoreObject)[] {
    // Start with all of the existing entities
    const merged: (T & StoreObject)[] = existing ? existing.slice(0) : [];

    const indexes = Object.create(null) as Record<string, number>;
    (existing ?? []).forEach((item, i) => {
      const indexField = readField<string>(field.toString(), item);

      if (indexField == null) return;

      indexes[indexField] = i;
    });

    const incomingIndexes = new Set<string>();

    // Update merged by either adding the new entities from incoming
    // Or updating the existing entities with the data from incoming
    (incoming ?? []).forEach((item) => {
      const indexField = readField<string>(field.toString(), item);

      if (indexField == null) return;

      // Keep track of the entities we see when processing incoming so
      // that we know which to keep if keepExisting is false
      incomingIndexes.add(indexField);

      const index = indexes[indexField];
      if (typeof index === "number") {
        const mergedObject = mergeObjects(merged[index], item);
        if (mergedObject) {
          merged[index] = mergedObject;
        }
      } else {
        indexes[indexField] = merged.length;
        merged.push(item);
      }
    });

    if (!keepExisting && (incoming != null || incomingNullable)) {
      // Only include the entities which were included in incoming
      // (with the data from existing, where appropraite)
      return merged.filter((item) => {
        const indexField = readField<string>(field.toString(), item);

        if (indexField == null) return false;

        return incomingIndexes.has(indexField);
      });
    }

    return merged;
  };
}

export const client = new ApolloClient({
  connectToDevTools: __DEV__,
  cache: new InMemoryCache({
    possibleTypes: introspectionResults.possibleTypes,
    typePolicies: {
      Query: {
        fields: {
          // https://www.apollographql.com/docs/react/caching/advanced-topics/#cache-redirects-using-field-policy-read-functions
          controller: (_, { args, toReference }) =>
            toReference({
              __typename: "Controller",
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: args?.id,
            }),
          location: (_, { args, toReference }) =>
            toReference({
              __typename: "Location",
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: args?.id,
            }),
          temperaturePreset: (_, { args, toReference }) =>
            toReference({
              __typename: "TemperaturePreset",
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: args?.id,
            }),
          scheduleEvent: (_, { args, toReference }) =>
            toReference({
              __typename: "ScheduleEvent",
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: args?.id,
            }),
          controllers: {
            merge: mergeArrayByField<Controller>("id", false),
          },
          locations: {
            merge: mergeArrayByField<Location>("id", false),
          },
          temperaturePresets: {
            merge: mergeArrayByField<TemperaturePreset>("id", false),
          },
          scheduleEvents: {
            merge: mergeArrayByField<ScheduleEvent>("id", false),
          },
        },
      },
      Away: {
        fields: {
          setpoint: {
            merge: objectMerge,
          },
        },
      },
      Controller: {
        fields: {
          schedule: {
            merge: objectMerge,
          },
          activeHold: {
            merge: objectMerge,
          },
          away: {
            merge: objectMerge,
          },
          defaultHoldLength: {
            merge: takeIncomingValues,
          },
          location: {
            merge: objectMerge,
          },
          mode: {
            merge: objectMerge,
          },
          modes: {
            merge: mergeArrayByField<Mode>("name", false),
          },
          setpoint: {
            merge: objectMerge,
          },
        },
      },
      Location: {
        fields: {
          away: {
            merge: objectMerge,
          },
          controller: {
            merge: objectMerge,
          },
          controllers: {
            merge: mergeArrayByField<Controller>("id", false),
          },
          defaultHoldLength: {
            merge: takeIncomingValues,
          },
          humidityNotification: {
            merge: objectMerge,
          },
          temperatureNotification: {
            merge: objectMerge,
          },
          temperaturePresets: {
            merge: mergeArrayByField<TemperaturePreset>("id", false),
          },
        },
      },
      DualRangeValue: {
        fields: {
          lower: {
            merge: objectMerge,
          },
          upper: {
            merge: objectMerge,
          },
        },
      },
      DualSetpoint: {
        fields: {
          lower: {
            merge: objectMerge,
          },
          upper: {
            merge: objectMerge,
          },
        },
      },
      HumidityNotification: {
        fields: {
          lower: {
            merge: objectMerge,
          },
          upper: {
            merge: objectMerge,
          },
        },
      },
      TemperatureNotification: {
        fields: {
          lower: {
            merge: objectMerge,
          },
          upper: {
            merge: objectMerge,
          },
        },
      },
      TemperaturePreset: {
        fields: {
          location: {
            merge: objectMerge,
          },
        },
      },
      ScheduleEvent: {
        fields: {
          start: {
            merge: objectMerge,
          },
          end: {
            merge: objectMerge,
          },
          nextEvent: {
            merge: objectMerge,
          },
          prevEvent: {
            merge: objectMerge,
          },
          temperaturePreset: {
            merge: objectMerge,
          },
        },
      },
    },
  }),
  // Use the authenticated link chain without any refresh error
  // handling since we'll overwrite this in the bootstrap step and any
  // requests we make before that should be auth'd (if possible)
  link: buildLink(async () => Promise.resolve()),
  name: Platform.OS,
});
