# 女性安全地图 - 开发检查清单

**版本**: 1.0  
**更新**: 2026-03-01  
**用途**: 逐步开发指南，每完成一项打勾 ✅

---

## 📋 第一阶段：项目初始化（预计 1-2 天）

### ✅ Step 1: 环境准备
- [ ] 安装 Node.js 18+
- [ ] 安装 Git
- [ ] 安装 VS Code
- [ ] 安装 VS Code 插件：
  - [ ] ESLint
  - [ ] Prettier
  - [ ] React Native Tools
  - [ ] TypeScript
- [ ] 注册 Expo 账号
- [ ] 安装 Expo CLI：`npm install -g expo-cli`
- [ ] 安装 EAS CLI：`npm install -g eas-cli`
- [ ] 手机安装 Expo Go App

### ✅ Step 2: 创建 GitHub 仓库
- [ ] 创建新仓库：`safety-map-mobile`
- [ ] 设置为私有仓库
- [ ] 添加 README.md
- [ ] 添加 .gitignore (Node.js + React Native)
- [ ] 添加 LICENSE (MIT)
- [ ] Clone 到本地

### ✅ Step 3: 初始化 Expo 项目
```bash
# 创建项目
npx create-expo-app safety-map-mobile --template blank-typescript

# 进入目录
cd safety-map-mobile

# 初始化 Git
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

- [ ] 项目创建成功
- [ ] 运行 `npm start` 测试
- [ ] 在 Expo Go 中打开测试
- [ ] 提交到 GitHub

### ✅ Step 4: 安装核心依赖
```bash
# 导航
npx expo install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler

# 地图
npx expo install react-native-maps

# 状态管理
npm install zustand

# UI 组件
npm install react-native-paper react-native-vector-icons

# Supabase
npm install @supabase/supabase-js

# 相机和图片
npx expo install expo-camera expo-image-picker expo-image-manipulator

# 位置
npx expo install expo-location

# 工具
npm install date-fns zod
npm install react-native-dotenv

# 开发依赖
npm install -D @types/react @types/react-native
npm install -D eslint prettier
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

- [ ] 所有依赖安装成功
- [ ] 运行 `npm start` 无报错
- [ ] 提交到 GitHub

### ✅ Step 5: 配置项目结构
```bash
# 创建目录
mkdir -p src/app/navigation
mkdir -p src/features/{auth,map,hotel,detection,profile}/{screens,components,hooks,store}
mkdir -p src/shared/{components,hooks,utils,constants,types}
mkdir -p src/services/{api,supabase,location}
mkdir -p src/assets/{images,fonts,icons}
```

- [ ] 目录结构创建完成
- [ ] 创建 `src/app/App.tsx`
- [ ] 修改根目录 `App.tsx` 导入 `src/app/App.tsx`
- [ ] 提交到 GitHub

### ✅ Step 6: 配置 TypeScript
创建 `tsconfig.json`：
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@app/*": ["src/app/*"],
      "@features/*": ["src/features/*"],
      "@shared/*": ["src/shared/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["src/assets/*"]
    }
  }
}
```

- [ ] TypeScript 配置完成
- [ ] 路径别名测试通过
- [ ] 提交到 GitHub

### ✅ Step 7: 配置 ESLint 和 Prettier
创建 `.eslintrc.js`：
```javascript
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
```

创建 `.prettierrc`：
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

- [ ] ESLint 配置完成
- [ ] Prettier 配置完成
- [ ] 运行 `npm run lint` 测试
- [ ] 提交到 GitHub

### ✅ Step 8: 配置环境变量
创建 `.env.example`：
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
API_URL=http://localhost:3001
```

创建 `.env`（不提交到 Git）：
```
SUPABASE_URL=https://hmmruoankhohowlzajll.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
API_URL=http://localhost:3001
```

- [ ] 环境变量配置完成
- [ ] `.env` 添加到 `.gitignore`
- [ ] 提交 `.env.example` 到 GitHub

---

## 🏗️ 第二阶段：基础设施（预计 2-3 天）

### ✅ Step 9: 配置 Supabase 客户端
创建 `src/services/supabase/client.ts`：
```typescript
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

- [ ] Supabase 客户端创建
- [ ] 测试连接成功
- [ ] 提交到 GitHub

### ✅ Step 10: 创建类型定义
创建 `src/shared/types/index.ts`：
```typescript
// 城市类型
export interface City {
  id: string;
  code: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
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
}

// 评价类型
export interface Review {
  id: string;
  hotelId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// 用户类型
export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}

// 检测类型
export interface Detection {
  id: string;
  userId: string;
  hotelId?: string;
  photoUrl: string;
  detectionResult: DetectionResult;
  createdAt: string;
}

export interface DetectionResult {
  hasRisk: boolean;
  riskLevel: 'high' | 'medium' | 'low';
  confidence: number;
  detectedItems: string[];
  recommendations: string[];
  safetyScore: number;
}
```

- [ ] 类型定义完成
- [ ] 提交到 GitHub

### ✅ Step 11: 创建常量
创建 `src/shared/constants/cities.ts`：
```typescript
import { City } from '@shared/types';

export const CITIES: City[] = [
  {
    id: 'xishuangbanna',
    code: 'xishuangbanna',
    name: '西双版纳',
    country: '中国',
    latitude: 22.0084,
    longitude: 100.7979,
  },
  // ... 其他城市
];
```

创建 `src/shared/constants/colors.ts`：
```typescript
export const colors = {
  primary: '#6366f1',
  secondary: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  success: '#10b981',
  
  safetyHigh: '#4ade80',
  safetyMedium: '#fbbf24',
  safetyLow: '#f87171',
  
  background: '#ffffff',
  surface: '#f5f5f5',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
};
```

- [ ] 常量定义完成
- [ ] 提交到 GitHub

### ✅ Step 12: 配置导航系统
创建 `src/app/navigation/types.ts`：
```typescript
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Map: undefined;
  Detection: undefined;
  Profile: undefined;
};

export type MapStackParamList = {
  MapHome: undefined;
  CitySelection: undefined;
  HotelDetail: { hotelId: string };
};
```

创建 `src/app/navigation/RootNavigator.tsx`：
```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '@features/auth/store/authStore';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { user } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

- [ ] 导航类型定义完成
- [ ] RootNavigator 创建完成
- [ ] AuthNavigator 创建完成
- [ ] MainNavigator 创建完成
- [ ] 提交到 GitHub

### ✅ Step 13: 创建认证 Store
创建 `src/features/auth/store/authStore.ts`：
```typescript
import create from 'zustand';
import { User } from '@shared/types';
import { supabase } from '@services/supabase/client';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ user: data.user as User, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  register: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      set({ user: data.user as User, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
  
  checkAuth: async () => {
    const { data } = await supabase.auth.getSession();
    set({ user: data.session?.user as User || null });
  },
}));
```

- [ ] authStore 创建完成
- [ ] 测试登录/注册/登出
- [ ] 提交到 GitHub

---

## 🎨 第三阶段：核心功能开发（预计 5-7 天）

### ✅ Step 14: 开发登录页面
创建 `src/features/auth/screens/LoginScreen.tsx`：
```typescript
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">登录</Text>
      <TextInput
        label="邮箱"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        label="密码"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button mode="contained" onPress={handleLogin} loading={isLoading}>
        登录
      </Button>
      <Button onPress={() => navigation.navigate('Register')}>
        还没有账号？注册
      </Button>
    </View>
  );
}
```

- [ ] LoginScreen 创建完成
- [ ] RegisterScreen 创建完成
- [ ] 测试登录流程
- [ ] 提交到 GitHub

### ✅ Step 15: 开发地图页面
创建 `src/features/map/screens/MapScreen.tsx`：
```typescript
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useMapStore } from '../store/mapStore';

export default function MapScreen() {
  const { hotels, loadHotels, selectedCity } = useMapStore();

  useEffect(() => {
    if (selectedCity) {
      loadHotels(selectedCity.id);
    }
  }, [selectedCity]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: selectedCity?.latitude || 22.0084,
          longitude: selectedCity?.longitude || 100.7979,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {hotels.map((hotel) => (
          <Marker
            key={hotel.id}
            coordinate={{
              latitude: hotel.latitude,
              longitude: hotel.longitude,
            }}
            title={hotel.name}
            description={`评分: ${hotel.safetyScore}/5.0`}
          />
        ))}
      </MapView>
    </View>
  );
}
```

- [ ] MapScreen 创建完成
- [ ] 地图显示正常
- [ ] 酒店标记显示
- [ ] 提交到 GitHub

### ✅ Step 16-20: 继续开发其他功能
- [ ] 城市选择页面
- [ ] 酒店详情页面
- [ ] 拍照检测流程
- [ ] 个人中心页面
- [ ] 收藏功能

---

## 🧪 第四阶段：测试和优化（预计 2-3 天）

### ✅ Step 21: 单元测试
- [ ] 安装 Jest 和 Testing Library
- [ ] 编写 Store 测试
- [ ] 编写组件测试
- [ ] 测试覆盖率 > 80%

### ✅ Step 22: 性能优化
- [ ] 图片懒加载
- [ ] 列表虚拟化
- [ ] 地图标记聚合
- [ ] 缓存策略

### ✅ Step 23: 真机测试
- [ ] iOS 真机测试
- [ ] Android 真机测试
- [ ] 修复发现的 Bug

---

## 🚀 第五阶段：打包发布（预计 1-2 天）

### ✅ Step 24: 配置 EAS Build
```bash
eas build:configure
```

- [ ] 配置 iOS 证书
- [ ] 配置 Android 签名
- [ ] 测试构建

### ✅ Step 25: 发布
- [ ] 构建 iOS 版本
- [ ] 构建 Android 版本
- [ ] 提交到 TestFlight
- [ ] 提交到 Google Play Internal Testing

---

## 📝 开发规范

### Git Commit 规范
```
feat: 新功能
fix: 修复 Bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

### 分支管理
```
main        # 生产分支
develop     # 开发分支
feature/*   # 功能分支
bugfix/*    # Bug 修复分支
```

---

**祝开发顺利！** 🎉

