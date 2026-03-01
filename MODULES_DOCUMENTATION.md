# 女性安全地图 - 功能模块说明文档

**版本**: 1.0  
**日期**: 2026-03-01  
**目的**: 详细说明每个文件的作用和功能，便于判断是否需要

---

## 📋 目录结构总览

```
src/
├── app/                    # 应用入口和导航
├── features/               # 功能模块（5个）
│   ├── auth/              # 认证模块 ✅ 已完成
│   ├── map/               # 地图模块 ⚠️ 部分完成
│   ├── hotel/             # 酒店模块 ⚠️ 部分完成
│   ├── detection/         # 检测模块 ⚠️ 部分完成
│   └── profile/           # 个人中心 ⚠️ 部分完成
├── shared/                # 共享资源 ✅ 已完成
├── services/              # 服务层 ✅ 已完成
└── assets/                # 静态资源 ⏳ 待添加
```

---

## 🔐 一、认证模块 (Auth Module) - ✅ 已完成

### 文件列表

| 文件 | 作用 | 是否必需 | 说明 |
|------|------|---------|------|
| `store/authStore.ts` | 认证状态管理 | ✅ 必需 | 管理登录状态、用户信息、Token 持久化 |
| `screens/LoginScreen.tsx` | 登录页面 | ✅ 必需 | 邮箱密码登录表单 |
| `screens/RegisterScreen.tsx` | 注册页面 | ✅ 必需 | 用户注册表单 |

### 功能说明

#### 1. authStore.ts - 认证状态管理
**作用**：
- 管理用户登录状态（user、isLoading、isInitialized）
- 提供登录、注册、登出方法
- 应用启动时自动检查登录状态（checkAuth）
- Token 持久化到本地存储

**使用场景**：
- RootNavigator 根据 user 是否存在决定显示登录页还是主页
- 登录页面调用 `login(email, password)`
- 注册页面调用 `register(email, password)`
- 个人中心调用 `logout()`

**是否必需**：✅ 必需，整个应用的认证基础

---

#### 2. LoginScreen.tsx - 登录页面
**作用**：
- 提供邮箱和密码输入框
- 实时表单验证（邮箱格式、密码长度）
- 调用 authStore.login() 进行登录
- 显示错误提示（Snackbar）
- 跳转到注册页面

**使用场景**：
- 用户未登录时显示此页面
- 用户输入邮箱密码后点击"登录"

**是否必需**：✅ 必需，用户登录入口

---

#### 3. RegisterScreen.tsx - 注册页面
**作用**：
- 提供邮箱、密码、确认密码输入框
- 表单验证（邮箱格式、密码强度、两次密码一致）
- 调用 authStore.register() 进行注册
- 注册成功后自动登录
- 跳转到登录页面

**使用场景**：
- 新用户注册账号
- 从登录页面点击"注册"进入

**是否必需**：✅ 必需，新用户注册入口

---

## 🗺️ 二、地图模块 (Map Module) - ⚠️ 部分完成

### 已完成文件

| 文件 | 作用 | 是否必需 | 说明 |
|------|------|---------|------|
| `store/mapStore.ts` | 地图状态管理 | ✅ 必需 | 管理城市、酒店列表、热力图数据、筛选条件 |

### 缺失文件（需要创建）

| 文件 | 作用 | 是否必需 | 说明 |
|------|------|---------|------|
| `screens/MapScreen.tsx` | 地图主页面 | ✅ 必需 | 显示地图、酒店标记、热力图 |
| `screens/CitySelectionScreen.tsx` | 城市选择页面 | ✅ 必需 | 选择要查看的城市 |
| `components/HotelMarker.tsx` | 酒店标记组件 | ⚠️ 可选 | 自定义酒店标记样式（可用默认 Marker） |
| `components/HeatmapLayer.tsx` | 热力图组件 | ✅ 必需 | 渲染热力图（使用 Circle 组件） |
| `components/MapControls.tsx` | 地图控制组件 | ⚠️ 可选 | 热力图开关、评分筛选（可直接在 MapScreen 实现） |
| `hooks/useHotels.ts` | 酒店数据 Hook | ❌ 不必需 | 已在 mapStore 中实现 |
| `hooks/useHeatmap.ts` | 热力图数据 Hook | ❌ 不必需 | 已在 mapStore 中实现 |

### 功能说明

#### 1. mapStore.ts - 地图状态管理 ✅
**作用**：
- 管理当前选中的城市（selectedCity）
- 从 Supabase 加载酒店数据（loadHotels）
- 计算热力图数据（heatmapData）
- 处理评分筛选（setMinRating）
- 切换热力图显示（setShowHeatmap）

**使用场景**：
- MapScreen 使用此 Store 获取酒店列表和热力图数据
- CitySelectionScreen 使用此 Store 切换城市
- 筛选组件使用此 Store 设置最低评分

**是否必需**：✅ 必需，地图功能的核心

---

#### 2. MapScreen.tsx - 地图主页面 ⏳ 待创建
**作用**：
- 显示地图（react-native-maps）
- 显示酒店标记（Marker）
- 显示热力图（Circle）
- 点击标记显示酒店名称和评分
- 点击标记跳转到酒店详情页
- 显示统计信息（酒店总数、已评分数）

**使用场景**：
- 用户登录后的主页面
- 查看城市内的酒店分布
- 点击酒店查看详情

**是否必需**：✅ 必需，核心功能页面

---

#### 3. CitySelectionScreen.tsx - 城市选择页面 ⏳ 待创建
**作用**：
- 显示支持的城市列表（按国家分组）
- 选择城市后保存到本地
- 跳转到地图页面

**使用场景**：
- 首次启动应用时显示
- 用户想切换城市时显示

**是否必需**：✅ 必需，城市切换功能

---

#### 4. HeatmapLayer.tsx - 热力图组件 ⏳ 待创建
**作用**：
- 根据酒店评分渲染热力图
- 使用 Circle 组件绘制圆形区域
- 颜色根据评分变化（绿色/黄色/红色）

**使用场景**：
- MapScreen 中使用此组件显示热力图

**是否必需**：✅ 必需，核心可视化功能

---

## 🏨 三、酒店模块 (Hotel Module) - ⚠️ 部分完成

### 已完成文件

| 文件 | 作用 | 是否必需 | 说明 |
|------|------|---------|------|
| `store/hotelStore.ts` | 酒店状态管理 | ✅ 必需 | 管理酒店详情、评价列表、收藏状态 |

### 缺失文件（需要创建）

| 文件 | 作用 | 是否必需 | 说明 |
|------|------|---------|------|
| `screens/HotelDetailScreen.tsx` | 酒店详情页面 | ✅ 必需 | 显示酒店信息、评价列表、收藏按钮 |
| `components/ReviewList.tsx` | 评价列表组件 | ⚠️ 可选 | 显示评价列表（可直接在 HotelDetailScreen 实现） |
| `components/AddReviewForm.tsx` | 添加评价表单 | ⚠️ 可选 | 添加评价（可用 Modal 实现） |
| `components/HotelCard.tsx` | 酒店卡片组件 | ❌ 不必需 | 用于列表展示（当前不需要） |

### 功能说明

#### 1. hotelStore.ts - 酒店状态管理 ✅
**作用**：
- 加载酒店详情（loadHotelDetail）
- 加载酒店评价列表（loadReviews）
- 添加评价（addReview）
- 收藏/取消收藏（toggleFavorite）
- 检查收藏状态（checkFavoriteStatus）

**重要说明**：
- ⚠️ **酒店评价数据的抓取由另一位朋友开发**
- 此 Store 只负责从 Supabase 读取和显示数据
- ⚠️ **酒店照片回传给 Agent 的功能也由另一位朋友开发**

**使用场景**：
- HotelDetailScreen 使用此 Store 获取酒店详情和评价
- 用户点击收藏按钮时调用 toggleFavorite

**是否必需**：✅ 必需，酒店详情功能的核心

---

#### 2. HotelDetailScreen.tsx - 酒店详情页面 ⏳ 待创建
**作用**：
- 显示酒店名称、地址、评分
- 显示评价列表
- 提供添加评价功能
- 提供收藏/取消收藏按钮
- 跳转到在线平台（Booking.com）

**使用场景**：
- 从地图页面点击酒店标记进入
- 从收藏列表点击酒店进入

**是否必需**：✅ 必需，查看酒店详情

---

## 📷 四、检测模块 (Detection Module) - ⚠️ 部分完成

### 已完成文件

| 文件 | 作用 | 是否必需 | 说明 |
|------|------|---------|------|
| `store/detectionStore.ts` | 检测状态管理 | ✅ 必需 | 管理检测流程、照片上传、AI 分析 |

### 缺失文件（需要创建）

| 文件 | 作用 | 是否必需 | 说明 |
|------|------|---------|------|
| `screens/DetectionHomeScreen.tsx` | 检测首页 | ✅ 必需 | 选择检测部位（6个部位多选） |
| `screens/DetectionGuideScreen.tsx` | 自查引导页面 | ✅ 必需 | 显示自查问题和风险提示 |
| `screens/PhotoCaptureScreen.tsx` | 拍照上传页面 | ✅ 必需 | 调用相机拍照或从相册选择 |
| `screens/DetectionResultScreen.tsx` | 结果展示页面 | ✅ 必需 | 显示 AI 分析结果和建议 |
| `components/DetectionTypeSelector.tsx` | 检测部位选择器 | ⚠️ 可选 | 可直接在 DetectionHomeScreen 实现 |
| `components/GuideCard.tsx` | 自查引导卡片 | ⚠️ 可选 | 可直接在 DetectionGuideScreen 实现 |
| `components/ResultCard.tsx` | 结果卡片组件 | ⚠️ 可选 | 可直接在 DetectionResultScreen 实现 |

### 功能说明

#### 1. detectionStore.ts - 检测状态管理 ✅
**作用**：
- 管理选中的检测部位（selectedTypes）
- 管理自查结果（selfCheckResults）
- 管理上传的照片（photos）
- 调用 Coze AI API 分析照片（analyzePhotos）
- 保存检测记录（saveDetection）
- 加载检测历史（loadDetectionHistory）

**重要说明**：
- ⚠️ **酒店照片回传给 Agent 的功能由另一位朋友开发**
- 此 Store 负责调用 Coze AI API 进行分析
- AI 分析结果会返回风险等级和建议

**使用场景**：
- DetectionHomeScreen 使用此 Store 选择检测部位
- PhotoCaptureScreen 使用此 Store 上传照片
- DetectionResultScreen 使用此 Store 显示分析结果

**是否必需**：✅ 必需，检测功能的核心

---

#### 2. DetectionHomeScreen.tsx - 检测首页 ⏳ 待创建
**作用**：
- 显示 6 个检测部位（门锁、窗户、镜子、浴室、插座、路由器）
- 支持多选
- 至少选择 1 个部位才能继续
- 跳转到自查引导页面

**使用场景**：
- 用户点击底部导航的"检测"标签进入
- 开始新的检测流程

**是否必需**：✅ 必需，检测流程的起点

---

#### 3. DetectionGuideScreen.tsx - 自查引导页面 ⏳ 待创建
**作用**：
- 对每个选中的部位显示自查问题
- 显示风险提示
- 用户回答"有异常"或"正常"
- 记录自查结果
- 跳转到拍照页面

**使用场景**：
- 从 DetectionHomeScreen 选择部位后进入
- 引导用户进行初步自查

**是否必需**：✅ 必需，提供自查引导

---

#### 4. PhotoCaptureScreen.tsx - 拍照上传页面 ⏳ 待创建
**作用**：
- 为每个部位拍摄照片
- 支持调用相机拍照
- 支持从相册选择
- 照片预览
- 自动压缩照片（最大 1920x1920, 85% 质量）
- 上传照片到服务器
- 调用 AI 分析

**使用场景**：
- 从 DetectionGuideScreen 完成自查后进入
- 拍摄酒店房间照片

**是否必需**：✅ 必需，核心功能

---

#### 5. DetectionResultScreen.tsx - 结果展示页面 ⏳ 待创建
**作用**：
- 显示总体安全评分（0-5.0）
- 显示风险等级（高/中/低）
- 显示每个部位的详细结果
- 显示安全建议
- 支持保存到历史记录
- 支持分享结果

**使用场景**：
- AI 分析完成后显示结果
- 查看检测历史时显示

**是否必需**：✅ 必需，展示分析结果

---

## 👤 五、个人中心模块 (Profile Module) - ⚠️ 部分完成

### 已完成文件

| 文件 | 作用 | 是否必需 | 说明 |
|------|------|---------|------|
| `store/profileStore.ts` | 个人中心状态管理 | ✅ 必需 | 管理用户资料、收藏列表、检测历史 |

### 缺失文件（需要创建）

| 文件 | 作用 | 是否必需 | 说明 |
|------|------|---------|------|
| `screens/ProfileScreen.tsx` | 个人中心首页 | ✅ 必需 | 显示用户信息、收藏、历史、设置 |
| `screens/FavoritesScreen.tsx` | 收藏列表页面 | ✅ 必需 | 显示收藏的酒店列表 |
| `screens/DetectionHistoryScreen.tsx` | 检测历史页面 | ✅ 必需 | 显示检测历史记录 |
| `screens/SettingsScreen.tsx` | 设置页面 | ⚠️ 可选 | 通知设置、隐私设置、关于我们 |

### 功能说明

#### 1. profileStore.ts - 个人中心状态管理 ✅
**作用**：
- 加载用户资料（loadProfile）
- 更新用户资料（updateProfile）
- 加载收藏列表（loadFavorites）
- 加载检测历史（loadDetectionHistory）
- 取消收藏（removeFavorite）

**使用场景**：
- ProfileScreen 使用此 Store 显示用户信息
- FavoritesScreen 使用此 Store 显示收藏列表
- DetectionHistoryScreen 使用此 Store 显示检测历史

**是否必需**：✅ 必需，个人中心功能的核心

---

#### 2. ProfileScreen.tsx - 个人中心首页 ⏳ 待创建
**作用**：
- 显示用户头像、昵称、邮箱
- 支持编辑个人信息
- 显示收藏数量、检测次数
- 跳转到收藏列表
- 跳转到检测历史
- 跳转到设置页面
- 退出登录按钮

**使用场景**：
- 用户点击底部导航的"我的"标签进入
- 查看和编辑个人信息

**是否必需**：✅ 必需，个人中心入口

---

#### 3. FavoritesScreen.tsx - 收藏列表页面 ⏳ 待创建
**作用**：
- 显示所有收藏的酒店
- 每个酒店显示名称、城市、评分
- 点击跳转到酒店详情
- 支持取消收藏

**使用场景**：
- 从 ProfileScreen 点击"我的收藏"进入
- 查看收藏的酒店

**是否必需**：✅ 必需，收藏功能

---

#### 4. DetectionHistoryScreen.tsx - 检测历史页面 ⏳ 待创建
**作用**：
- 显示所有检测记录
- 每条记录显示检测时间、部位、评分、风险等级
- 点击查看详细结果
- 支持删除记录

**使用场景**：
- 从 ProfileScreen 点击"检测历史"进入
- 查看历史检测记录

**是否必需**：✅ 必需，历史记录功能

---

## 🔧 六、导航系统 (Navigation) - ✅ 已完成

### 文件列表

| 文件 | 作用 | 是否必需 | 说明 |
|------|------|---------|------|
| `navigation/types.ts` | 导航类型定义 | ✅ 必需 | TypeScript 类型检查 |
| `navigation/RootNavigator.tsx` | 根导航器 | ✅ 必需 | 根据登录状态切换导航栈 |
| `navigation/AuthNavigator.tsx` | 认证导航器 | ✅ 必需 | 登录/注册页面导航 |
| `navigation/MainNavigator.tsx` | 主导航器 | ✅ 必需 | 底部标签导航 |

### 功能说明

#### 1. RootNavigator.tsx - 根导航器 ✅
**作用**：
- 应用启动时检查登录状态
- 未登录显示 AuthNavigator
- 已登录显示 MainNavigator
- 初始化中显示 Loading 页面

**是否必需**：✅ 必需，导航的核心

---

#### 2. AuthNavigator.tsx - 认证导航器 ✅
**作用**：
- 管理登录和注册页面的导航
- 支持页面切换

**是否必需**：✅ 必需，认证流程导航

---

#### 3. MainNavigator.tsx - 主导航器 ✅
**作用**：
- 提供底部标签导航（地图、检测、个人中心）
- 每个标签对应一个独立的导航栈

**是否必需**：✅ 必需，主应用导航

---

## 📊 七、总结

### 已完成的文件（基础设施）

✅ **配置文件**（8个）
- package.json, tsconfig.json, babel.config.js, .eslintrc.js, .prettierrc, .gitignore, app.json, env.example

✅ **类型定义**（2个）
- src/shared/types/index.ts
- src/types/env.d.ts

✅ **常量配置**（3个）
- src/shared/constants/cities.ts
- src/shared/constants/detection.ts
- src/shared/constants/theme.ts

✅ **服务层**（6个）
- src/services/supabase/client.ts
- src/services/supabase/auth.ts
- src/services/supabase/database.ts
- src/services/api/client.ts
- src/services/api/detectionApi.ts
- src/services/location/locationService.ts

✅ **工具函数**（3个）
- src/shared/utils/format.ts
- src/shared/utils/storage.ts
- src/shared/utils/validation.ts

✅ **通用组件**（2个）
- src/shared/components/Loading.tsx
- src/shared/components/ErrorBoundary.tsx

✅ **自定义 Hooks**（2个）
- src/shared/hooks/useAsync.ts
- src/shared/hooks/useDebounce.ts

✅ **认证模块**（3个）
- src/features/auth/store/authStore.ts
- src/features/auth/screens/LoginScreen.tsx
- src/features/auth/screens/RegisterScreen.tsx

✅ **导航系统**（4个）
- src/app/navigation/types.ts
- src/app/navigation/RootNavigator.tsx
- src/app/navigation/AuthNavigator.tsx
- src/app/navigation/MainNavigator.tsx

✅ **状态管理 Store**（4个）
- src/features/auth/store/authStore.ts
- src/features/map/store/mapStore.ts
- src/features/hotel/store/hotelStore.ts
- src/features/detection/store/detectionStore.ts
- src/features/profile/store/profileStore.ts

**总计：已完成 42 个文件**

---

### 缺失的文件（需要创建）

⏳ **地图模块**（3个必需）
- MapScreen.tsx - 地图主页面
- CitySelectionScreen.tsx - 城市选择页面
- HeatmapLayer.tsx - 热力图组件

⏳ **酒店模块**（1个必需）
- HotelDetailScreen.tsx - 酒店详情页面

⏳ **检测模块**（4个必需）
- DetectionHomeScreen.tsx - 检测首页
- DetectionGuideScreen.tsx - 自查引导页面
- PhotoCaptureScreen.tsx - 拍照上传页面
- DetectionResultScreen.tsx - 结果展示页面

⏳ **个人中心**（3个必需）
- ProfileScreen.tsx - 个人中心首页
- FavoritesScreen.tsx - 收藏列表页面
- DetectionHistoryScreen.tsx - 检测历史页面

**总计：需要创建 11 个核心页面**

---

### 与另一位朋友的协作说明

#### 他负责的功能：
1. ⚠️ **酒店评价数据的抓取**
   - 从在线平台抓取酒店评价数据
   - 存储到 Supabase 的 reviews 表
   - 我们的应用只负责从数据库读取和显示

2. ⚠️ **酒店照片回传给 Agent**
   - 用户上传的酒店照片需要回传给某个 Agent
   - 具体实现由他负责
   - 我们的应用调用他提供的 API 即可

#### 我们负责的功能：
1. ✅ 前端应用开发（React Native）
2. ✅ 用户认证和授权
3. ✅ 地图展示和热力图
4. ✅ 酒店详情展示（读取数据库）
5. ✅ 拍照检测流程
6. ✅ 调用 Coze AI API 进行分析
7. ✅ 个人中心和收藏功能

---

## 🎯 下一步建议

### 优先级 P0（必须完成）
1. ✅ 认证模块（已完成）
2. ⏳ 地图模块（MapScreen, CitySelectionScreen, HeatmapLayer）
3. ⏳ 酒店详情页面（HotelDetailScreen）

### 优先级 P1（重要）
4. ⏳ 检测模块（4个页面）
5. ⏳ 个人中心（3个页面）

### 优先级 P2（可选）
6. ⏳ 设置页面
7. ⏳ 优化和美化

---

**需要我继续创建剩余的 11 个核心页面吗？**

