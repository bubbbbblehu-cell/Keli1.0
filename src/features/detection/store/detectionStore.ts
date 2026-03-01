/**
 * 检测状态管理 Store
 * 
 * 作用：
 * 1. 管理拍照检测流程的所有状态
 * 2. 处理检测部位选择
 * 3. 处理自查问答结果
 * 4. 处理照片上传
 * 5. 调用 AI 分析 API
 * 6. 保存检测结果
 * 
 * 使用场景：
 * - DetectionHomeScreen 使用此 Store 选择检测部位
 * - DetectionGuideScreen 使用此 Store 记录自查结果
 * - PhotoCaptureScreen 使用此 Store 上传照片
 * - DetectionResultScreen 使用此 Store 显示分析结果
 * 
 * 注意：
 * - 酒店照片回传给 Agent 的功能由另一位朋友开发
 * - 此 Store 负责调用 Coze AI API 进行分析
 */

import { create } from 'zustand';
import { Detection, DetectionResult } from '@shared/types';
import { detectionApi } from '@services/api/detectionApi';
import { useAuthStore } from '@features/auth/store/authStore';

interface PhotoData {
  uri: string;
  type: string;
}

interface SelfCheckResult {
  type: string;
  hasIssue: boolean;
  note?: string;
}

interface DetectionState {
  // 状态
  selectedTypes: string[];            // 选中的检测部位
  selfCheckResults: SelfCheckResult[]; // 自查结果
  photos: PhotoData[];                // 上传的照片
  currentResult: DetectionResult | null; // 当前检测结果
  detectionHistory: Detection[];      // 检测历史记录
  isAnalyzing: boolean;               // 是否正在分析
  isLoading: boolean;                 // 加载状态
  
  // 操作方法
  selectType: (type: string) => void;
  deselectType: (type: string) => void;
  clearSelectedTypes: () => void;
  setSelfCheckResults: (results: SelfCheckResult[]) => void;
  addPhoto: (photo: PhotoData) => void;
  removePhoto: (index: number) => void;
  clearPhotos: () => void;
  analyzePhotos: () => Promise<DetectionResult>;
  saveDetection: (hotelId?: string) => Promise<void>;
  loadDetectionHistory: () => Promise<void>;
  resetDetection: () => void;
}

export const useDetectionStore = create<DetectionState>((set, get) => ({
  selectedTypes: [],
  selfCheckResults: [],
  photos: [],
  currentResult: null,
  detectionHistory: [],
  isAnalyzing: false,
  isLoading: false,

  // 选择检测部位
  selectType: (type: string) => {
    const { selectedTypes } = get();
    if (!selectedTypes.includes(type)) {
      set({ selectedTypes: [...selectedTypes, type] });
    }
  },

  // 取消选择检测部位
  deselectType: (type: string) => {
    const { selectedTypes } = get();
    set({ selectedTypes: selectedTypes.filter((t) => t !== type) });
  },

  // 清空选择
  clearSelectedTypes: () => {
    set({ selectedTypes: [] });
  },

  // 设置自查结果
  setSelfCheckResults: (results: SelfCheckResult[]) => {
    set({ selfCheckResults: results });
  },

  // 添加照片
  addPhoto: (photo: PhotoData) => {
    const { photos } = get();
    set({ photos: [...photos, photo] });
  },

  // 删除照片
  removePhoto: (index: number) => {
    const { photos } = get();
    set({ photos: photos.filter((_, i) => i !== index) });
  },

  // 清空照片
  clearPhotos: () => {
    set({ photos: [] });
  },

  // 分析照片（调用 Coze AI API）
  analyzePhotos: async () => {
    const { photos, selectedTypes, selfCheckResults } = get();
    
    if (photos.length === 0) {
      throw new Error('请至少上传一张照片');
    }

    set({ isAnalyzing: true });
    try {
      // 调用 AI 分析 API
      const result = await detectionApi.analyzePhotos(photos);
      
      set({ currentResult: result, isAnalyzing: false });
      return result;
    } catch (error) {
      console.error('Analyze photos error:', error);
      set({ isAnalyzing: false });
      throw error;
    }
  },

  // 保存检测记录
  saveDetection: async (hotelId?: string) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      throw new Error('请先登录');
    }

    const { currentResult, photos } = get();
    if (!currentResult) {
      throw new Error('没有检测结果');
    }

    try {
      const detection: Partial<Detection> = {
        userId: user.id,
        hotelId,
        photoUrl: photos[0]?.uri || '',
        detectionResult: currentResult,
        safetyScore: currentResult.safetyScore,
        status: 'completed',
        createdAt: new Date().toISOString(),
      };

      await detectionApi.saveDetection(detection as any);
    } catch (error) {
      console.error('Save detection error:', error);
      throw error;
    }
  },

  // 加载检测历史
  loadDetectionHistory: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ detectionHistory: [] });
      return;
    }

    set({ isLoading: true });
    try {
      const history = await detectionApi.getDetectionHistory(user.id);
      set({ detectionHistory: history, isLoading: false });
    } catch (error) {
      console.error('Load detection history error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // 重置检测状态（开始新的检测）
  resetDetection: () => {
    set({
      selectedTypes: [],
      selfCheckResults: [],
      photos: [],
      currentResult: null,
    });
  },
}));

