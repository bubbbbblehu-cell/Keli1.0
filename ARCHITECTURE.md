# 女性安全地图 - 移动端重构架构设计

**版本**: 3.0  
**日期**: 2026-03-01  
**目标**: 从零开发真正的跨平台移动应用（iOS + Android）

---

## 🎯 技术选型

### 前端框架：React Native + Expo
**为什么选择 Expo？**
- ✅ 开箱即用，无需配置 Xcode/Android Studio
- ✅ 内置地图、相机、文件上传等功能
- ✅ 支持 OTA 更新
- ✅ 开发效率高，一套代码双平台运行
- ✅ 可随时 eject 到原生项目

### 状态管理：Zustand
**为什么不用 Redux？**
- ✅ 更简单，学习成本低
- ✅ 无需 Provider 包裹
- ✅ TypeScript 支持好
- ✅ 体积小（1KB）

### 导航：React Navigation v6
- Stack Navigator（页面导航）
- Bottom Tab Navigator（底部导航）

### 地图：react-native-maps
- iOS：Apple Maps
- Android：Google Maps

### 数据库：Supabase
- PostgreSQL + PostGIS
- 实时订阅
- 内置认证
- 文件存储

### UI 组件库：React Native Paper
- Material Design 风格
- 组件丰富
- 主题定制

---

## 📁 项目结构

```
safety-map-mobile/
├── src/
│   ├── app/                    # 应用入口
│   │   ├── App.tsx            # 主应用组件
│   │   └── navigation/        # 导航配置
│   │       ├── RootNavigator.tsx
│   │       ├── AuthNavigator.tsx
│   │       └── MainNavigator.tsx
│   │
│   ├── features/              # 功能模块（按业务划分）
│   │   ├── auth/              # 认证模块
│   │   │   ├── screens/
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   └── RegisterScreen.tsx
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── store/
│   │   │       └── authStore.ts
│   │   │
│   │   ├── map/               # 地图模块
│   │   │   ├── screens/
│   │   │   │   ├── MapScreen.tsx
│   │   │   │   └── CitySelectionScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── HotelMarker.tsx
│   │   │   │   ├── HeatmapLayer.tsx
│   │   │   │   └── MapControls.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useHotels.ts
│   │   │   │   └── useHeatmap.ts
│   │   │   └── store/
│   │   │       └── mapStore.ts
│   │   │
│   │   ├── hotel/             # 酒店模块
│   │   │   ├── screens/
│   │   │   │   └── HotelDetailScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── HotelCard.tsx
│   │   │   │   ├── ReviewList.tsx
│   │   │   │   └── AddReviewForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useHotelDetail.ts
│   │   │   └── store/
│   │   │       └── hotelStore.ts
│   │   │
│   │   ├── detection/         # 拍照检测模块
│   │   │   ├── screens/
│   │   │   │   ├── DetectionHomeScreen.tsx
│   │   │   │   ├── DetectionGuideScreen.tsx
│   │   │   │   ├── PhotoCaptureScreen.tsx
│   │   │   │   └── DetectionResultScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── DetectionTypeSelector.tsx
│   │   │   │   ├── GuideCard.tsx
│   │   │   │   └── ResultCard.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useDetection.ts
│   │   │   └── store/
│   │   │       └── detectionStore.ts
│   │   │
│   │   └── profile/           # 个人中心模块
│   │       ├── screens/
│   │       │   ├── ProfileScreen.tsx
│   │       │   └── FavoritesScreen.tsx
│   │       ├── components/
│   │       └── store/
│   │           └── profileStore.ts
│   │
│   ├── shared/                # 共享资源
│   │   ├── components/        # 通用组件
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   │
│   │   ├── hooks/             # 通用 Hooks
│   │   │   ├── useAsync.ts
│   │   │   └── useDebounce.ts
│   │   │
│   │   ├── utils/             # 工具函数
│   │   │   ├── format.ts
│   │   │   ├── validation.ts
│   │   │   └── storage.ts
│   │   │
│   │   ├── constants/         # 常量
│   │   │   ├── cities.ts
│   │   │   ├── colors.ts
│   │   │   └── config.ts
│   │   │
│   │   └── types/             # TypeScript 类型
│   │       ├── hotel.ts
│   │       ├── user.ts
│   │       └── detection.ts
│   │
│   ├── services/              # 服务层
│   │   ├── api/               # API 客户端
│   │   │   ├── client.ts
│   │   │   ├── hotelApi.ts
│   │   │   ├── detectionApi.ts
│   │   │   └── authApi.ts
│   │   │
│   │   ├── supabase/          # Supabase 服务
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── database.ts
│   │   │   └── storage.ts
│   │   │
│   │   └── location/          # 定位服务
│   │       └── locationService.ts
│   │
│   └── assets/                # 静态资源
│       ├── images/
│       ├── fonts/
│       └── icons/
│
├── app.json                   # Expo 配置
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## 🏗️ 开发步骤（共10步）

### 第一阶段：项目初始化（1-2天）

#### Step 1: 创建项目
```bash
# 使用 Expo 创建项目
npx create-expo-app safety-map-mobile --template blank-typescript

# 安装核心依赖
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-maps
npm install @supabase/supabase-js
npm install zustand
npm install react-native-paper
npm install expo-camera expo-image-picker expo-location

# 安装开发依赖
npm install -D @types/react @types/react-native
```

**产出**：
- ✅ 项目骨架
- ✅ 依赖安装完成
- ✅ TypeScript 配置

---

#### Step 2: 配置项目结构
```bash
# 创建目录结构
mkdir -p src/{app,features,shared,services,assets}
mkdir -p src/features/{auth,map,hotel,detection,profile}
# ... 创建所有子目录
```

**产出**：
- ✅ 完整的目录结构
- ✅ 基础配置文件（tsconfig.json, .env）

---

### 第二阶段：基础设施（2-3天）

#### Step 3: 配置 Supabase 和服务层
**文件**：
- `src/services/supabase/client.ts`
- `src/services/api/client.ts`

**内容**：
```typescript
// src/services/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

**产出**：
- ✅ Supabase 客户端配置
- ✅ API 客户端封装
- ✅ 错误处理机制

---

#### Step 4: 配置导航系统
**文件**：
- `src/app/navigation/RootNavigator.tsx`
- `src/app/navigation/AuthNavigator.tsx`
- `src/app/navigation/MainNavigator.tsx`

**导航结构**：
```
RootNavigator
├── AuthNavigator (未登录)
│   ├── Login
│   └── Register
└── MainNavigator (已登录)
    ├── BottomTabs
    │   ├── Map (地图)
    │   ├── Detection (检测)
    │   └── Profile (个人)
    └── Modal Screens
        ├── HotelDetail
        ├── CitySelection
        └── DetectionResult
```

**产出**：
- ✅ 完整的导航配置
- ✅ 认证路由守卫
- ✅ 页面跳转逻辑

---

#### Step 5: 配置状态管理
**文件**：
- `src/features/auth/store/authStore.ts`
- `src/features/map/store/mapStore.ts`
- `src/features/hotel/store/hotelStore.ts`

**示例**（authStore）：
```typescript
import create from 'zustand';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  login: async (email, password) => {
    set({ isLoading: true });
    // 登录逻辑
  },
  logout: async () => {
    // 登出逻辑
  },
}));
```

**产出**：
- ✅ 所有模块的状态管理
- ✅ 数据持久化
- ✅ 状态同步机制

---

### 第三阶段：核心功能开发（5-7天）

#### Step 6: 开发认证模块
**页面**：
- LoginScreen
- RegisterScreen

**功能**：
- 邮箱密码登录
- 第三方登录（Google/Apple）
- 注册
- 忘记密码

**产出**：
- ✅ 完整的认证流程
- ✅ Token 管理
- ✅ 自动登录

---

#### Step 7: 开发地图模块（核心）
**页面**：
- CitySelectionScreen
- MapScreen

**组件**：
- HotelMarker（酒店标记）
- HeatmapLayer（热力图）
- MapControls（地图控制）

**功能**：
- 城市选择
- 地图显示
- 热力图渲染
- 酒店标记
- 点击查看详情
- 评分筛选

**技术难点**：
- 热力图算法
- 大量标记性能优化
- 地图交互

**产出**：
- ✅ 完整的地图功能
- ✅ 性能优化
- ✅ 流畅的交互

---

#### Step 8: 开发酒店详情模块
**页面**：
- HotelDetailScreen

**组件**：
- HotelCard
- ReviewList
- AddReviewForm

**功能**：
- 酒店信息展示
- 评价列表
- 添加评价
- 收藏/取消收藏
- 跳转在线平台

**产出**：
- ✅ 酒店详情页
- ✅ 评价系统
- ✅ 收藏功能

---

#### Step 9: 开发拍照检测模块
**页面**：
- DetectionHomeScreen（检测首页）
- DetectionGuideScreen（自查引导）
- PhotoCaptureScreen（拍照上传）
- DetectionResultScreen（结果展示）

**流程**：
```
1. 选择检测部位（多选）
   ↓
2. 自查引导（问答）
   ↓
3. 拍照上传（每个部位1张）
   ↓
4. AI 分析（调用后端 API）
   ↓
5. 结果展示（风险等级、建议）
```

**功能**：
- 相机调用
- 图片压缩
- 上传进度
- AI 分析
- 结果保存

**产出**：
- ✅ 完整的检测流程
- ✅ 相机功能
- ✅ 结果展示

---

#### Step 10: 开发个人中心模块
**页面**：
- ProfileScreen
- FavoritesScreen

**功能**：
- 个人信息展示
- 收藏列表
- 检测历史
- 设置

**产出**：
- ✅ 个人中心
- ✅ 收藏管理
- ✅ 历史记录

---

### 第四阶段：优化和测试（2-3天）

#### Step 11: 性能优化
- 图片懒加载
- 列表虚拟化
- 地图标记聚合
- 缓存策略

#### Step 12: 测试
- 单元测试（Jest）
- 集成测试
- E2E 测试（Detox）
- 真机测试

#### Step 13: 打包发布
- iOS 打包（Expo EAS Build）
- Android 打包
- 应用商店上架

---

## 📊 开发时间估算

| 阶段 | 步骤 | 预计时间 | 累计时间 |
|------|------|---------|---------|
| 初始化 | Step 1-2 | 1-2天 | 2天 |
| 基础设施 | Step 3-5 | 2-3天 | 5天 |
| 核心功能 | Step 6-10 | 5-7天 | 12天 |
| 优化测试 | Step 11-13 | 2-3天 | 15天 |
| **总计** | **13步** | **10-15天** | **15天** |

**说明**：以上为单人全职开发的时间估算

---

## 🎨 UI/UX 设计原则

### 设计风格
- **简洁现代**：Material Design 3.0
- **色彩**：主色 #6366f1（紫色），辅色 #10b981（绿色）
- **字体**：系统默认字体
- **图标**：Material Icons

### 交互原则
- **快速响应**：所有操作 < 300ms 反馈
- **容错性**：友好的错误提示
- **引导性**：首次使用有引导
- **无障碍**：支持屏幕阅读器

---

## 🔐 安全考虑

### 数据安全
- ✅ HTTPS 通信
- ✅ Token 加密存储
- ✅ 敏感信息不缓存

### 权限管理
- ✅ 相机权限
- ✅ 位置权限
- ✅ 存储权限

### 隐私保护
- ✅ 用户数据加密
- ✅ 匿名模式
- ✅ 数据删除功能

---

## 📱 兼容性

### iOS
- 最低版本：iOS 13.0+
- 支持设备：iPhone 6s 及以上

### Android
- 最低版本：Android 6.0 (API 23)+
- 支持架构：arm64-v8a, armeabi-v7a

---

## 🚀 部署方案

### 开发环境
- Expo Go（开发调试）

### 测试环境
- TestFlight（iOS）
- Google Play Internal Testing（Android）

### 生产环境
- App Store（iOS）
- Google Play（Android）

---

## 📝 下一步行动

### 立即执行
1. ✅ 创建新的 GitHub 仓库
2. ✅ 初始化 Expo 项目
3. ✅ 配置开发环境

### 本周完成
1. Step 1-5（基础设施）
2. 搭建 CI/CD 流程
3. 编写开发文档

### 两周完成
1. Step 6-10（核心功能）
2. 内部测试
3. Bug 修复

---

## 🤝 团队协作

### Git 工作流
```
main (生产)
  ↑
develop (开发)
  ↑
feature/* (功能分支)
```

### 代码规范
- ESLint + Prettier
- Husky（Git Hooks）
- Conventional Commits

### 文档
- README.md（项目说明）
- CONTRIBUTING.md（贡献指南）
- API.md（API 文档）

---

**准备好了吗？让我们开始吧！** 🚀

