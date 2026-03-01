/**
 * 个人中心状态管理 Store
 * 
 * 作用：
 * 1. 管理用户个人信息
 * 2. 管理收藏列表
 * 3. 管理检测历史
 * 4. 处理个人信息更新
 * 
 * 使用场景：
 * - ProfileScreen 使用此 Store 显示和编辑个人信息
 * - FavoritesScreen 使用此 Store 显示收藏列表
 * - DetectionHistoryScreen 使用此 Store 显示检测历史
 */

import { create } from 'zustand';
import { UserProfile, Hotel, Detection } from '@shared/types';
import { databaseService } from '@services/supabase/database';
import { useAuthStore } from '@features/auth/store/authStore';
import { useDetectionStore } from '@features/detection/store/detectionStore';

interface ProfileState {
  // 状态
  profile: UserProfile | null;        // 用户资料
  favorites: Hotel[];                 // 收藏的酒店列表
  detectionHistory: Detection[];      // 检测历史记录
  isLoading: boolean;                 // 加载状态
  
  // 操作方法
  loadProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  loadFavorites: () => Promise<void>;
  loadDetectionHistory: () => Promise<void>;
  removeFavorite: (hotelId: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  favorites: [],
  detectionHistory: [],
  isLoading: false,

  // 加载用户资料
  loadProfile: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ profile: null });
      return;
    }

    set({ isLoading: true });
    try {
      // 这里简化处理，直接使用 user 数据
      // 实际项目中可能需要从 user_profiles 表加载更多信息
      const profile: UserProfile = {
        id: user.id,
        userId: user.id,
        displayName: user.displayName || user.email?.split('@')[0] || '用户',
        avatarUrl: user.avatarUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      set({ profile, isLoading: false });
    } catch (error) {
      console.error('Load profile error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // 更新用户资料
  updateProfile: async (data: Partial<UserProfile>) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      throw new Error('请先登录');
    }

    try {
      // 更新本地状态
      const { profile } = get();
      if (profile) {
        const updatedProfile = { ...profile, ...data, updatedAt: new Date().toISOString() };
        set({ profile: updatedProfile });
        
        // 同时更新 authStore 中的用户信息
        await useAuthStore.getState().updateProfile({
          displayName: data.displayName,
          avatarUrl: data.avatarUrl,
        });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // 加载收藏列表
  loadFavorites: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ favorites: [] });
      return;
    }

    set({ isLoading: true });
    try {
      const favorites = await databaseService.getFavorites(user.id);
      set({ favorites, isLoading: false });
    } catch (error) {
      console.error('Load favorites error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // 加载检测历史
  loadDetectionHistory: async () => {
    try {
      await useDetectionStore.getState().loadDetectionHistory();
      const history = useDetectionStore.getState().detectionHistory;
      set({ detectionHistory: history });
    } catch (error) {
      console.error('Load detection history error:', error);
      throw error;
    }
  },

  // 取消收藏
  removeFavorite: async (hotelId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      throw new Error('请先登录');
    }

    try {
      await databaseService.removeFavorite(user.id, hotelId);
      
      // 更新本地状态
      const { favorites } = get();
      set({ favorites: favorites.filter((hotel) => hotel.id !== hotelId) });
    } catch (error) {
      console.error('Remove favorite error:', error);
      throw error;
    }
  },
}));

