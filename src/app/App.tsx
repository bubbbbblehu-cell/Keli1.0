/**
 * 应用入口文件
 * 
 * 作用：
 * 1. 应用的根组件
 * 2. 配置全局 Provider（主题、导航）
 * 3. 配置错误边界
 * 
 * 组件层级：
 * ErrorBoundary
 *   └── PaperProvider (UI 主题)
 *       └── RootNavigator (导航)
 */

import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <ErrorBoundary>
      <PaperProvider>
        <RootNavigator />
      </PaperProvider>
    </ErrorBoundary>
  );
}
