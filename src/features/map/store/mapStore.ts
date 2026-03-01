/**
 * 地图状态管理 Store
 * 
 * 作用：
 * 1. 管理地图相关的所有状态（城市、酒店列表、筛选条件）
 * 2. 从 Supabase 加载酒店数据
 * 3. 处理热力图数据计算
 * 4. 管理地图筛选条件（最低评分、热力图开关）
 * 
 * 使用场景：
 * - MapScreen 使用此 Store 获取酒店数据
 * - CitySelectionScreen 使用此 Store 切换城市
 * - 热力图组件使用此 Store 获取热力图数据
 */

import { create } from 'zustand';
import { City, Hotel, HeatmapPoint } from '@shared/types';
import { databaseService } from '@services/supabase/database';
import { storage, STORAGE_KEYS } from '@shared/utils/storage';
import { DEFAULT_CITY } from '@shared/constants/cities';

interface MapState {
  // 状态
  selectedCity: City | null;          // 当前选中的城市
  hotels: Hotel[];                    // 当前城市的酒店列表
  filteredHotels: Hotel[];            // 筛选后的酒店列表
  heatmapData: HeatmapPoint[];        // 热力图数据
  isLoading: boolean;                 // 加载状态
  showHeatmap: boolean;               // 是否显示热力图
  minRating: number;                  // 最低评分筛选（0-5）
  
  // 操作方法
  setSelectedCity: (city: City) => Promise<void>;
  loadHotels: (cityId: string) => Promise<void>;
  setShowHeatmap: (show: boolean) => void;
  setMinRating: (rating: number) => void;
  refreshHotels: () => Promise<void>;
  initializeCity: () => Promise<void>;
}

export const useMapStore = create<MapState>((set, get) => ({
  selectedCity: null,
  hotels: [],
  filteredHotels: [],
  heatmapData: [],
  isLoading: false,
  showHeatmap: true,
  minRating: 0,

  // 初始化城市（从本地存储读取或使用默认城市）
  initializeCity: async () => {
    try {
      const savedCityJson = await storage.getItem(STORAGE_KEYS.SELECTED_CITY);
      const city = savedCityJson ? JSON.parse(savedCityJson) : DEFAULT_CITY;
      await get().setSelectedCity(city);
    } catch (error) {
      console.error('Initialize city error:', error);
      await get().setSelectedCity(DEFAULT_CITY);
    }
  },

  // 设置选中的城市
  setSelectedCity: async (city: City) => {
    set({ selectedCity: city, isLoading: true });
    
    // 保存到本地存储
    await storage.setItem(STORAGE_KEYS.SELECTED_CITY, JSON.stringify(city));
    
    // 加载该城市的酒店数据
    await get().loadHotels(city.id);
  },

  // 加载酒店数据
  loadHotels: async (cityId: string) => {
    set({ isLoading: true });
    try {
      const hotels = await databaseService.getHotels(cityId);
      
      // 计算热力图数据
      const heatmapData = hotels.map((hotel) => ({
        latitude: hotel.latitude,
        longitude: hotel.longitude,
        weight: hotel.safetyScore / 5, // 归一化到 0-1
      }));

      set({ 
        hotels, 
        filteredHotels: hotels,
        heatmapData,
        isLoading: false 
      });

      // 应用当前的筛选条件
      get().setMinRating(get().minRating);
    } catch (error) {
      console.error('Load hotels error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // 切换热力图显示
  setShowHeatmap: (show: boolean) => {
    set({ showHeatmap: show });
  },

  // 设置最低评分筛选
  setMinRating: (rating: number) => {
    const { hotels } = get();
    const filteredHotels = hotels.filter((hotel) => hotel.safetyScore >= rating);
    
    // 重新计算热力图数据
    const heatmapData = filteredHotels.map((hotel) => ({
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      weight: hotel.safetyScore / 5,
    }));

    set({ minRating: rating, filteredHotels, heatmapData });
  },

  // 刷新酒店数据
  refreshHotels: async () => {
    const { selectedCity } = get();
    if (selectedCity) {
      await get().loadHotels(selectedCity.id);
    }
  },
}));

