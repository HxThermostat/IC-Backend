import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Location from "expo-location";

type Example = {
  key: "some_key_name";
  valueType: string;
};

type SelectedController = {
  key: "selected_controller";
  valueType: [string, string];
};

export type GeofenceNamespace = `last_geofence_event:${string}`;

export const buildGeofenceStorageKey = (value: string): GeofenceNamespace => {
  return `last_geofence_event:${value}` as GeofenceNamespace;
};

type GeofenceEvent = {
  key: GeofenceNamespace;
  valueType: Location.LocationGeofencingEventType;
};

type LastRatingPromptAt = {
  key: "last_rating_prompt_at";
  valueType: string;
};

type LastSurveyPromptAt = {
  key: "last_survey_prompt_at";
  valueType: string;
};

type LastSurveyResponseAt = {
  key: "last_survey_response_at";
  valueType: string;
};

type DevicePushToken = {
  key: "device_push_token";
  valueType: string;
};

type SurveyFeedbackSessionToken = {
  key: "survey_feedback_session_token";
  valueType: string;
};

type SurveyFeedbackSessionExpiresAt = {
  key: "survey_feedback_session_expires_at";
  valueType: string;
};

type Keys =
  | Example
  | SelectedController
  | GeofenceEvent
  | LastRatingPromptAt
  | LastSurveyPromptAt
  | LastSurveyResponseAt
  | DevicePushToken
  | SurveyFeedbackSessionToken
  | SurveyFeedbackSessionExpiresAt;

const formatKey = (key: string): string => `@klimate:${key}`;

// Loads a key from storage and parses it if it exists
export async function loadFromAsyncStorage<
  K extends Keys["key"],
  V extends Extract<Keys, { key: K }>["valueType"]
>(key: K): Promise<V | null> {
  try {
    const item = await AsyncStorage.getItem(formatKey(key));
    if (item) {
      return JSON.parse(item) as V;
    }
    return null;
  } catch {
    return null;
  }
}

// Saves an object to storage
export async function saveToAsyncStorage<K extends Keys["key"]>(
  key: K,
  value: Extract<Keys, { key: K }>["valueType"]
): Promise<boolean> {
  try {
    // async storage has to be stored as strings
    await AsyncStorage.setItem(formatKey(key), JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// removes an item from storage
export async function removeFromAsyncStorage<K extends Keys["key"]>(
  key: K
): Promise<void> {
  try {
    await AsyncStorage.removeItem(formatKey(key));
  } catch {
    // kraftful/klimate#372; handle errors
  }
}

// clears all storage
export async function clearAsyncStorage(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch {
    // kraftful/klimate#372; handle errors
  }
}
