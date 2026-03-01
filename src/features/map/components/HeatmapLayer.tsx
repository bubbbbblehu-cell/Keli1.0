/**
 * 热力图组件
 * 
 * 作用：
 * 1. 根据酒店评分渲染热力图
 * 2. 使用 Circle 组件绘制圆形区域
 * 3. 颜色根据评分变化（绿色/黄色/红色）
 * 4. 半径根据评分权重调整
 * 
 * 使用场景：
 * - MapScreen 中使用此组件显示热力图
 * 
 * 算法：
 * - 评分 ≥ 4.5: 绿色 (#4ade80)
 * - 评分 ≥ 4.0: 黄色 (#fbbf24)
 * - 评分 < 4.0: 红色 (#f87171)
 * - 半径 = 500 + 评分 * 200 (米)
 * - 透明度 = 0.3
 */

import React from 'react';
import { Circle } from 'react-native-maps';
import { HeatmapPoint } from '@shared/types';
import { getScoreColor } from '@shared/utils/format';

interface HeatmapLayerProps {
  data: HeatmapPoint[];
  visible?: boolean;
}

export const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ 
  data, 
  visible = true 
}) => {
  if (!visible || data.length === 0) {
    return null;
  }

  return (
    <>
      {data.map((point, index) => {
        // 计算半径（根据权重）
        const radius = 500 + point.weight * 200;
        
        // 获取颜色（根据评分）
        const score = point.weight * 5; // 将权重转换回评分
        const color = getScoreColor(score);
        
        // 添加透明度
        const fillColor = `${color}40`; // 40 是十六进制的透明度（约25%）

        return (
          <Circle
            key={`heatmap-${index}`}
            center={{
              latitude: point.latitude,
              longitude: point.longitude,
            }}
            radius={radius}
            fillColor={fillColor}
            strokeWidth={0}
          />
        );
      })}
    </>
  );
};

export default HeatmapLayer;

