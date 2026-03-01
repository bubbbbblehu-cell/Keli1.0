// 城市类型
export interface City {
  id: string;
  code: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
}

// 酒店类型
export interface Hotel {
  id: string;
  cityId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  safetyScore: number;
  reviewCount: number;
  isActive: boolean;
}

// 评价类型
export interface Review {
  id: string;
  hotelId: string;
  userId: string;
  rating: number;
  comment: string;
  photos?: string[];
  isVisible: boolean;
  createdAt: string;
}

// 用户类型
export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}

// 用户资料类型
export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// 检测类型
export interface Detection {
  id: string;
  userId: string;
  hotelId?: string;
  photoUrl: string;
  detectionResult: DetectionResult;
  safetyScore: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

// 检测结果类型
export interface DetectionResult {
  hasRisk: boolean;
  riskLevel: 'high' | 'medium' | 'low';
  confidence: number;
  detectedItems: DetectionItem[];
  recommendations: string[];
  safetyScore: number;
}

// 检测项类型
export interface DetectionItem {
  type: string;
  name: string;
  hasRisk: boolean;
  riskDescription?: string;
  suggestion?: string;
}

// 收藏类型
export interface Favorite {
  id: string;
  userId: string;
  hotelId: string;
  createdAt: string;
}

// 地图区域类型
export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// 热力图数据点类型
export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  weight: number;
}

