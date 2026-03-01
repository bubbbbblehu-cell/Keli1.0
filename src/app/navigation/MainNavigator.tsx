/**
 * 主导航器（底部标签导航）
 * 
 * 作用：
 * 1. 管理已登录状态下的主要页面导航
 * 2. 提供底部标签栏（地图、检测、个人中心）
 * 3. 每个标签对应一个独立的导航栈
 * 
 * 标签页：
 * - MapTab: 地图模块（包含地图页、城市选择、酒店详情）
 * - DetectionTab: 检测模块（包含检测流程的所有页面）
 * - ProfileTab: 个人中心（包含个人信息、收藏、历史）
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MainTabParamList, MapStackParamList, DetectionStackParamList, ProfileStackParamList } from './types';

// 地图模块
import MapScreen from '@features/map/screens/MapScreen';
import CitySelectionScreen from '@features/map/screens/CitySelectionScreen';
import HotelDetailScreen from '@features/hotel/screens/HotelDetailScreen';

// 检测模块
import DetectionHomeScreen from '@features/detection/screens/DetectionHomeScreen';
import DetectionGuideScreen from '@features/detection/screens/DetectionGuideScreen';
import PhotoCaptureScreen from '@features/detection/screens/PhotoCaptureScreen';
import DetectionResultScreen from '@features/detection/screens/DetectionResultScreen';

// 个人中心模块
import ProfileScreen from '@features/profile/screens/ProfileScreen';
import FavoritesScreen from '@features/profile/screens/FavoritesScreen';
import DetectionHistoryScreen from '@features/profile/screens/DetectionHistoryScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const MapStack = createStackNavigator<MapStackParamList>();
const DetectionStack = createStackNavigator<DetectionStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();

// 地图导航栈
function MapNavigator() {
  return (
    <MapStack.Navigator screenOptions={{ headerShown: false }}>
      <MapStack.Screen name="MapHome" component={MapScreen} />
      <MapStack.Screen name="CitySelection" component={CitySelectionScreen} />
      <MapStack.Screen name="HotelDetail" component={HotelDetailScreen} />
    </MapStack.Navigator>
  );
}

// 检测导航栈
function DetectionNavigator() {
  return (
    <DetectionStack.Navigator screenOptions={{ headerShown: false }}>
      <DetectionStack.Screen name="DetectionHome" component={DetectionHomeScreen} />
      <DetectionStack.Screen name="DetectionGuide" component={DetectionGuideScreen} />
      <DetectionStack.Screen name="PhotoCapture" component={PhotoCaptureScreen} />
      <DetectionStack.Screen name="DetectionResult" component={DetectionResultScreen} />
    </DetectionStack.Navigator>
  );
}

// 个人中心导航栈
function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
      <ProfileStack.Screen name="Favorites" component={FavoritesScreen} />
      <ProfileStack.Screen name="DetectionHistory" component={DetectionHistoryScreen} />
    </ProfileStack.Navigator>
  );
}

// 主导航器
export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="MapTab"
        component={MapNavigator}
        options={{
          tabBarLabel: '地图',
          tabBarIcon: ({ color, size }) => (
            <span style={{ fontSize: size, color }}>🗺️</span>
          ),
        }}
      />
      <Tab.Screen
        name="DetectionTab"
        component={DetectionNavigator}
        options={{
          tabBarLabel: '检测',
          tabBarIcon: ({ color, size }) => (
            <span style={{ fontSize: size, color }}>📷</span>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({ color, size }) => (
            <span style={{ fontSize: size, color }}>👤</span>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
