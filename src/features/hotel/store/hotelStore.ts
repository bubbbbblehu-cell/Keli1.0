/**
 * 酒店状态管理 Store
 * 
 * 作用：
 * 1. 管理酒店详情数据
 * 2. 管理酒店评价列表
 * 3. 处理添加评价功能
 * 4. 处理收藏/取消收藏功能
 * 
 * 使用场景：
 * - HotelDetailScreen 使用此 Store 获取酒店详情
 * - ReviewList 使用此 Store 获取评价列表
 * - AddReviewForm 使用此 Store 提交评价
 * 
 * 注意：
 * - 酒店评价数据的抓取由另一位朋友开发
 * - 此 Store 只负责从 Supabase 读取和显示数据
 * - 酒店照片回传给 Agent 的功能也由另一位朋友开发
 */

import { create } from 'zustand';
import { Hotel, Review } from '@shared/types';
import { databaseService } from '@services/supabase/database';
import { useAuthStore } from '@features/auth/store/authStore';

interface HotelState {
  // 状态
  currentHotel: Hotel | null;         // 当前查看的酒店
  reviews: Review[];                  // 酒店评价列表
  isLoading: boolean;                 // 加载状态
  isFavorite: boolean;                // 是否已收藏
  
  // 操作方法
  loadHotelDetail: (hotelId: string) => Promise<void>;
  loadReviews: (hotelId: string) => Promise<void>;
  addReview: (hotelId: string, rating: number, comment: string, photos?: string[]) => Promise<void>;
  toggleFavorite: (hotelId: string) => Promise<void>;
  checkFavoriteStatus: (hotelId: string) => Promise<void>;
}

export const useHotelStore = create<HotelState>((set, get) => ({
  currentHotel: null,
  reviews: [],
  isLoading: false,
  isFavorite: false,

  // 加载酒店详情
  loadHotelDetail: async (hotelId: string) => {
    set({ isLoading: true });
    try {
      const hotel = await databaseService.getHotelDetail(hotelId);
      set({ currentHotel: hotel, isLoading: false });
      
      // 同时加载评价和收藏状态
      await Promise.all([
        get().loadReviews(hotelId),
        get().checkFavoriteStatus(hotelId),
      ]);
    } catch (error) {
      console.error('Load hotel detail error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // 加载酒店评价
  // 注意：评价数据的抓取由另一位朋友开发，这里只负责从数据库读取
  loadReviews: async (hotelId: string) => {
    try {
      const reviews = await databaseService.getHotelReviews(hotelId);
      set({ reviews });
    } catch (error) {
      console.error('Load reviews error:', error);
      throw error;
    }
  },

  // 添加评价
  addReview: async (hotelId: string, rating: number, comment: string, photos?: string[]) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      throw new Error('请先登录');
    }

    try {
      const review: Partial<Review> = {
        hotelId,
        userId: user.id,
        rating,
        comment,
        photos,
        isVisible: true,
        createdAt: new Date().toISOString(),
      };

      await databaseService.addReview(review);
      
      // 重新加载评价列表
      await get().loadReviews(hotelId);
    } catch (error) {
      console.error('Add review error:', error);
      throw error;
    }
  },

  // 切换收藏状态
  toggleFavorite: async (hotelId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      throw new Error('请先登录');
    }

    const { isFavorite } = get();

    try {
      if (isFavorite) {
        await databaseService.removeFavorite(user.id, hotelId);
        set({ isFavorite: false });
      } else {
        await databaseService.addFavorite(user.id, hotelId);
        set({ isFavorite: true });
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      throw error;
    }
  },

  // 检查收藏状态
  checkFavoriteStatus: async (hotelId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isFavorite: false });
      return;
    }

    try {
      const favorites = await databaseService.getFavorites(user.id);
      const isFavorite = favorites.some((hotel) => hotel.id === hotelId);
      set({ isFavorite });
    } catch (error) {
      console.error('Check favorite status error:', error);
      set({ isFavorite: false });
    }
  },
}));

