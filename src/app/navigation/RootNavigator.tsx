/**
 * 根导航器
 * 
 * 作用：
 * 1. 应用的顶层导航控制器
 * 2. 根据用户登录状态切换导航栈
 * 3. 应用启动时检查登录状态
 * 4. 显示启动加载页面
 * 
 * 导航逻辑：
 * - 未登录：显示 AuthNavigator（登录/注册页面）
 * - 已登录：显示 MainNavigator（主应用页面）
 * - 初始化中：显示 Loading 页面
 * 
 * 使用场景：
 * - App.tsx 中使用此组件作为根导航
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useAuthStore } from '@features/auth/store/authStore';
import { Loading } from '@shared/components/Loading';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, isInitialized, checkAuth } = useAuthStore();

  // 应用启动时检查登录状态
  useEffect(() => {
    checkAuth();
  }, []);

  // 初始化中，显示加载页面
  if (!isInitialized) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // 已登录：显示主应用
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          // 未登录：显示登录/注册页面
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

