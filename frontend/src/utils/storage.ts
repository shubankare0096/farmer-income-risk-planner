import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  PROFIT_PLAN: 'profit_plan',
  EXPENSES: 'expenses',
  LEARNING_PROGRESS: 'learning_progress',
  PRICE_ALERTS: 'price_alerts',
  USER_PREFERENCES: 'user_preferences',
};

export const storage = {
  async set(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error('Error saving data:', e);
    }
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Error reading data:', e);
      return null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing data:', e);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error('Error clearing data:', e);
    }
  },
};
