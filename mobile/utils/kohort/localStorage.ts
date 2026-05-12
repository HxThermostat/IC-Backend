import AsyncStorage from "@react-native-async-storage/async-storage";

// Loads a key from storage and parses it if it exists
export async function loadFromAsyncStorage<T>(key: string): Promise<T | null> {
  try {
    const item = await AsyncStorage.getItem(key);
    if (item) {
      return JSON.parse(item) as T;
    }
    return null;
  } catch {
    return null;
  }
}

// Saves an object to storage
export async function saveToAsyncStorage<T = string>(
  key: string,
  value: T
): Promise<boolean> {
  try {
    // async storage has to be stored as strings
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// removes an item from storage
export async function removeFromAsyncStorage(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    console.error("Error removing from storage");
  }
}

// clears all storage - perhaps on logout?
export async function clearAsyncStorage(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch {
    console.error("Error clearing storage");
  }
}
