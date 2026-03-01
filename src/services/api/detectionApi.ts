import { apiClient } from './client';
import { DetectionResult } from '@shared/types';

export const detectionApi = {
  // 分析照片
  async analyzePhotos(photos: { uri: string; type: string }[]): Promise<DetectionResult> {
    const formData = new FormData();
    
    photos.forEach((photo, index) => {
      formData.append('photos', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: `photo-${index}.jpg`,
      } as any);
      formData.append('detectionTypes[]', photo.type);
    });

    const result = await apiClient.upload('/api/analyze-photos', formData);
    return result;
  },

  // 保存检测记录
  async saveDetection(detection: {
    userId: string;
    hotelId?: string;
    photoUrl: string;
    detectionResult: DetectionResult;
  }) {
    return apiClient.post('/api/detections', detection);
  },

  // 获取检测历史
  async getDetectionHistory(userId: string) {
    return apiClient.get(`/api/detections?userId=${userId}`);
  },
};

