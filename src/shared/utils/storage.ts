import * as SecureStore from 'expo-secure-store';

export const storage = {
  // 保存数据
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Storage setItem error:', error);
      throw error;
    }
  },

  // 获取数据
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },

  // 删除数据
  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
      throw error;
    }
  },

  // 清空所有数据
  async clear(): Promise<void> {
    // SecureStore 没有 clear 方法，需要手动删除已知的 key
    const keys = ['auth_token', 'user_data', 'selected_city'];
    await Promise.all(keys.map((key) => this.removeItem(key)));
  },
};

// 存储键常量
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  SELECTED_CITY: 'selected_city',
};

