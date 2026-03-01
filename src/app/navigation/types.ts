/**
 * 导航类型定义
 * 
 * 作用：
 * 1. 定义所有导航栈的参数类型
 * 2. 提供 TypeScript 类型检查
 * 3. 确保导航参数的类型安全
 * 
 * 使用场景：
 * - 在页面组件中使用 navigation.navigate() 时获得类型提示
 * - 在页面组件中使用 route.params 时获得类型提示
 */

import { DetectionResult } from '@shared/types';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  MapTab: undefined;
  DetectionTab: undefined;
  ProfileTab: undefined;
};

export type MapStackParamList = {
  MapHome: undefined;
  CitySelection: undefined;
  HotelDetail: { hotelId: string };
};

export type DetectionStackParamList = {
  DetectionHome: undefined;
  DetectionGuide: { selectedTypes: string[] };
  PhotoCapture: { selectedTypes: string[]; selfCheckResults: any };
  DetectionResult: { result: DetectionResult };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Favorites: undefined;
  DetectionHistory: undefined;
  Settings: undefined;
};
