/**
 * 认证导航器
 * 
 * 作用：
 * 1. 管理未登录状态下的页面导航
 * 2. 包含登录页面和注册页面
 * 3. 用户登录成功后会自动切换到 MainNavigator
 * 
 * 页面：
 * - Login: 登录页面
 * - Register: 注册页面
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from './types';
import LoginScreen from '@features/auth/screens/LoginScreen';
import RegisterScreen from '@features/auth/screens/RegisterScreen';

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

