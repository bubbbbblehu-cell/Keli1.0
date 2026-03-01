# 女性安全地图 - 产品需求文档 (PRD)

**项目名称**: 女性安全地图移动应用  
**版本**: 3.0 (全新重构)  
**日期**: 2026-03-01  
**平台**: iOS + Android  
**技术栈**: React Native + Expo + TypeScript

---

## 📱 产品概述

### 1.1 产品定位
一款专为女性用户设计的跨平台移动应用，通过热力图可视化展示酒店安全评分，并集成 AI 拍照检测功能，帮助用户识别住宿环境中的安全隐患。

### 1.2 目标用户
- **主要用户**: 18-45岁独自出行的女性旅客
- **次要用户**: 关注住宿安全的所有用户群体
- **使用场景**: 旅游、出差、商务出行

### 1.3 核心价值主张
- ✅ **安全可视化**: 热力图直观展示区域安全评分分布
- ✅ **AI 智能检测**: 拍照识别酒店房间安全隐患
- ✅ **真实用户评价**: 众包模式收集可信安全信息
- ✅ **跨平台体验**: iOS/Android 统一体验

### 1.4 产品目标
- **短期目标** (3个月): 完成 MVP，覆盖 5 个城市，1000+ 酒店数据
- **中期目标** (6个月): 用户量达到 10,000，覆盖 20 个城市
- **长期目标** (1年): 成为女性出行安全领域的首选应用

---

## 🏗️ 技术架构

### 2.1 技术栈

#### 前端
```
框架: React Native 0.73 + Expo 50
语言: TypeScript 5.3
状态管理: Zustand 4.4
UI 组件: React Native Paper 5.11
导航: React Navigation 6.1
地图: react-native-maps 1.10
```

#### 后端
```
数据库: Supabase (PostgreSQL + PostGIS)
认证: Supabase Auth
存储: Supabase Storage
API: Node.js + Express (现有)
AI: Coze API (Bot ID: 7588350694353649679)
```

### 2.2 架构设计

#### 项目结构 (Feature-based)
```
src/
├── app/                    # 应用入口
│   ├── App.tsx
│   └── navigation/         # 导航配置
├── features/               # 功能模块
│   ├── auth/              # 认证模块
│   ├── map/               # 地图模块
│   ├── hotel/             # 酒店模块
│   ├── detection/         # 检测模块
│   └── profile/           # 个人中心
├── shared/                # 共享资源
│   ├── components/        # 通用组件
│   ├── hooks/             # 通用 Hooks
│   ├── utils/             # 工具函数
│   ├── constants/         # 常量
│   └── types/             # TypeScript 类型
├── services/              # 服务层
│   ├── api/               # API 客户端
│   ├── supabase/          # Supabase 服务
│   └── location/          # 定位服务
└── assets/                # 静态资源
```

#### 数据流
```
View (UI) 
  ↓ 用户操作
Store (Zustand)
  ↓ 调用服务
Service (API/Supabase)
  ↓ 返回数据
Store (更新状态)
  ↓ 触发重渲染
View (UI 更新)
```

---

## 🎯 功能需求

### 3.1 功能模块总览

| 模块 | 优先级 | 开发周期 | 状态 |
|------|--------|---------|------|
| 用户认证 | P0 | 2天 | 待开发 |
| 地图展示 | P0 | 3天 | 待开发 |
| 酒店详情 | P0 | 2天 | 待开发 |
| 拍照检测 | P1 | 3天 | 待开发 |
| 个人中心 | P1 | 2天 | 待开发 |

---

### 3.2 模块一：用户认证

#### 功能描述
用户注册、登录、登出，支持邮箱密码和第三方登录。

#### 页面列表
1. **登录页面** (LoginScreen)
2. **注册页面** (RegisterScreen)
3. **忘记密码页面** (ForgotPasswordScreen)

#### 功能点

**3.2.1 邮箱密码登录**
- 输入：邮箱、密码
- 验证：邮箱格式、密码长度 (≥6位)
- 错误处理：显示友好提示
- 成功后：跳转到地图页面

**3.2.2 用户注册**
- 输入：邮箱、密码、确认密码
- 验证：
  - 邮箱格式
  - 密码强度 (≥6位，包含字母和数字)
  - 两次密码一致
- 成功后：发送验证邮件，跳转到登录页

**3.2.3 第三方登录** (可选)
- 支持：Google、Apple Sign In
- 一键登录，无需填写表单

**3.2.4 自动登录**
- Token 存储在 SecureStore
- 应用启动时自动检查登录状态
- Token 过期自动跳转登录页

#### 技术实现
```typescript
// Store
interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// API
supabase.auth.signInWithPassword({ email, password })
supabase.auth.signUp({ email, password })
supabase.auth.signOut()
```

#### 验收标准
- [ ] 用户可以成功注册
- [ ] 用户可以成功登录
- [ ] 登录状态持久化
- [ ] 错误提示友好
- [ ] 支持自动登录

---

### 3.3 模块二：地图展示 (核心)

#### 功能描述
显示城市地图，通过热力图和标记点展示酒店安全评分分布。

#### 页面列表
1. **城市选择页面** (CitySelectionScreen)
2. **地图主页面** (MapScreen)

#### 功能点

**3.3.1 城市选择**
- 首次启动显示城市选择页面
- 按国家分组展示城市列表
- 支持的城市：
  - 🇨🇳 中国: 西双版纳、贵阳、上海
  - 🇹🇭 泰国: 曼谷
  - 🇮🇹 意大利: 那不勒斯
- 选择后保存到本地，下次直接进入地图

**3.3.2 地图显示**
- 使用 react-native-maps
- iOS: Apple Maps
- Android: Google Maps
- 初始视野：选中城市的中心点
- 缩放级别：13

**3.3.3 热力图渲染**
- 算法：
  ```
  颜色 = f(安全评分)
  - 评分 ≥ 4.5: 绿色 (#4ade80)
  - 评分 ≥ 4.0: 黄色 (#fbbf24)
  - 评分 < 4.0: 红色 (#f87171)
  
  半径 = 500 + 评分 * 200 (米)
  透明度 = 0.3
  ```
- 性能优化：
  - 按视野范围加载
  - 标记聚合 (Clustering)
  - 防抖处理

**3.3.4 酒店标记**
- 标记样式：圆形标记，颜色同热力图
- 标记大小：半径 8px
- 点击标记：显示酒店名称和评分
- 再次点击：打开酒店详情页面

**3.3.5 地图控制**
- 热力图开关：右上角按钮
- 评分筛选：筛选最低评分
- 城市切换：切换到其他城市
- 定位按钮：定位到当前位置

**3.3.6 统计信息**
- 左上角显示：
  - 酒店总数
  - 已评分酒店数
- 实时更新

#### 数据加载
```typescript
// 从 Supabase 加载
const { data } = await supabase
  .from('hotels')
  .select('*')
  .eq('city_id', cityId)
  .eq('is_active', true);

// 转换为地图数据
const markers = data.map(hotel => ({
  id: hotel.id,
  coordinate: {
    latitude: hotel.latitude,
    longitude: hotel.longitude,
  },
  title: hotel.name,
  score: hotel.safety_score,
}));
```

#### 技术实现
```typescript
// Store
interface MapState {
  selectedCity: City | null;
  hotels: Hotel[];
  showHeatmap: boolean;
  minRating: number;
  loadHotels: (cityId: string) => Promise<void>;
  setShowHeatmap: (show: boolean) => void;
  setMinRating: (rating: number) => void;
}

// 组件
<MapView
  initialRegion={region}
  onRegionChangeComplete={handleRegionChange}
>
  {/* 热力图 */}
  {showHeatmap && heatmapData.map(point => (
    <Circle
      key={point.id}
      center={point.coordinate}
      radius={point.radius}
      fillColor={point.color}
      strokeWidth={0}
    />
  ))}
  
  {/* 酒店标记 */}
  {hotels.map(hotel => (
    <Marker
      key={hotel.id}
      coordinate={hotel.coordinate}
      onPress={() => handleMarkerPress(hotel)}
    />
  ))}
</MapView>
```

#### 验收标准
- [ ] 地图正常显示
- [ ] 热力图渲染正确
- [ ] 酒店标记可点击
- [ ] 筛选功能正常
- [ ] 性能流畅 (60fps)

---

### 3.4 模块三：酒店详情

#### 功能描述
展示酒店详细信息，支持查看评价、添加评价、收藏酒店。

#### 页面列表
1. **酒店详情页面** (HotelDetailScreen)

#### 功能点

**3.4.1 信息展示**
- 酒店名称
- 地址
- 安全评分 (大号显示)
- 评价数量
- 评分分布图表

**3.4.2 评价列表**
- 显示最新 20 条评价
- 每条评价包含：
  - 用户头像和昵称
  - 评分 (星级)
  - 评价内容
  - 评价时间
  - 有用数 (点赞)
- 支持下拉刷新
- 支持上拉加载更多

**3.4.3 添加评价**
- 点击"添加评价"按钮
- 弹出评价表单：
  - 星级评分 (1-5星)
  - 文字评论 (选填)
  - 照片上传 (选填，最多3张)
- 提交后：
  - 更新酒店评分
  - 刷新评价列表

**3.4.4 收藏功能**
- 点击收藏按钮：⭐ → ★
- 收藏后保存到个人中心
- 支持取消收藏

**3.4.5 跳转在线平台**
- 点击"查看在线平台"按钮
- 跳转到 Booking.com 搜索页面
- 传递酒店名称作为搜索关键词

#### 技术实现
```typescript
// Store
interface HotelState {
  currentHotel: Hotel | null;
  reviews: Review[];
  loadHotelDetail: (hotelId: string) => Promise<void>;
  addReview: (review: ReviewInput) => Promise<void>;
  toggleFavorite: (hotelId: string) => Promise<void>;
}

// API
const { data } = await supabase
  .from('hotels')
  .select(`
    *,
    reviews (
      *,
      user:user_profiles (*)
    )
  `)
  .eq('id', hotelId)
  .single();
```

#### 验收标准
- [ ] 酒店信息完整展示
- [ ] 评价列表正常加载
- [ ] 可以成功添加评价
- [ ] 收藏功能正常
- [ ] 跳转外部链接正常

---

### 3.5 模块四：拍照检测

#### 功能描述
使用 AI 技术检测酒店房间的安全隐患，提供自查引导和智能分析。

#### 页面列表
1. **检测首页** (DetectionHomeScreen)
2. **部位选择** (DetectionTypeSelector)
3. **自查引导** (DetectionGuideScreen)
4. **拍照上传** (PhotoCaptureScreen)
5. **结果展示** (DetectionResultScreen)

#### 功能点

**3.5.1 检测部位选择**
- 6个检测部位（多选）：
  1. 🔒 门锁安全检查
  2. 🪟 窗户外部检查
  3. 🪞 双面镜检测
  4. 🚿 浴室通风口检查
  5. 🔌 插座与面板检查
  6. 📡 路由器与信号检查
- 每个部位显示：
  - 图标
  - 名称
  - 简短描述
- 至少选择 1 个部位才能继续

**3.5.2 自查引导**
- 对每个选中的部位显示：
  - 自查问题
  - 风险提示
  - 操作指引
- 用户回答：有异常 / 正常
- 记录自查结果

**3.5.3 拍照上传**
- 为每个部位拍摄照片
- 支持：
  - 调用相机拍照
  - 从相册选择
- 照片预览
- 自动压缩 (最大 1920x1920, 85% 质量)
- 上传进度显示

**3.5.4 AI 分析**
- 提交所有照片到后端 API
- 调用 Coze AI 分析
- 显示分析进度
- 超时处理 (60秒)

**3.5.5 结果展示**
- 总体安全评分 (0-5.0)
- 风险等级：高/中/低
- 每个部位的详细结果：
  - 检测项
  - 风险描述
  - 安全建议
- 支持保存到历史记录
- 支持分享结果

#### 检测部位详情

| 部位 | 自查问题 | 风险提示 |
|------|---------|---------|
| 门锁 | 握住门把手摇晃，是否感觉到明显松动或听到零件撞击声？ | 门锁松动极可能是被撬动的痕迹，或内部反锁机构已失效 |
| 窗户 | 观察窗外 1 米内是否有空调外机、水管或邻居阳台？ | 这类外部结构是天然的攀爬踏板，极易发生入室风险 |
| 镜子 | 用手指关节敲击镜面，声音是闷响还是空心的脆响？ | 脆响意味着镜后有空腔，极大概率是"双面镜"偷拍 |
| 浴室 | 观察排气扇格栅内部是否有黑色圆孔或红点红光？ | 通风口是隐藏摄像头的重灾区，红点通常是设备工作灯 |
| 插座 | 检查正对床铺的插座孔位，是否有反光点或异常缝隙？ | 改装插座可提供长久电源给针孔设备 |
| 路由器 | 路由器背面除了网线，是否有不明的微小孔洞或多余接线？ | 路由器常被植入网络嗅探或无线传输型偷拍模组 |

#### 技术实现
```typescript
// Store
interface DetectionState {
  selectedTypes: string[];
  photos: { [key: string]: string };
  result: DetectionResult | null;
  isAnalyzing: boolean;
  selectType: (type: string) => void;
  uploadPhoto: (type: string, uri: string) => Promise<void>;
  analyze: () => Promise<void>;
}

// API 调用
const formData = new FormData();
photos.forEach((photo, index) => {
  formData.append('photos', {
    uri: photo.uri,
    type: 'image/jpeg',
    name: `photo-${index}.jpg`,
  });
  formData.append('detectionTypes[]', photo.type);
});

const response = await fetch(`${API_URL}/api/analyze-photos`, {
  method: 'POST',
  body: formData,
});

const result = await response.json();
```

#### 验收标准
- [ ] 可以选择检测部位
- [ ] 自查引导显示正确
- [ ] 相机功能正常
- [ ] 照片上传成功
- [ ] AI 分析返回结果
- [ ] 结果展示完整

---

### 3.6 模块五：个人中心

#### 功能描述
管理用户个人信息、收藏、检测历史。

#### 页面列表
1. **个人中心首页** (ProfileScreen)
2. **收藏列表** (FavoritesScreen)
3. **检测历史** (DetectionHistoryScreen)
4. **设置页面** (SettingsScreen)

#### 功能点

**3.6.1 个人信息**
- 显示：
  - 头像
  - 昵称
  - 邮箱
- 支持编辑：
  - 上传头像
  - 修改昵称

**3.6.2 收藏列表**
- 显示所有收藏的酒店
- 每个酒店显示：
  - 酒店名称
  - 城市
  - 安全评分
- 点击跳转到酒店详情
- 支持取消收藏

**3.6.3 检测历史**
- 显示所有检测记录
- 每条记录显示：
  - 检测时间
  - 检测部位
  - 安全评分
  - 风险等级
- 点击查看详细结果
- 支持删除记录

**3.6.4 设置**
- 通知设置
- 隐私设置
- 关于我们
- 退出登录

#### 技术实现
```typescript
// Store
interface ProfileState {
  profile: UserProfile | null;
  favorites: Hotel[];
  detectionHistory: Detection[];
  loadProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  loadFavorites: () => Promise<void>;
  loadDetectionHistory: () => Promise<void>;
}
```

#### 验收标准
- [ ] 个人信息正常显示
- [ ] 可以编辑个人信息
- [ ] 收藏列表正常加载
- [ ] 检测历史正常显示
- [ ] 设置功能正常

---

## 🎨 UI/UX 设计

### 4.1 设计原则
- **简洁**: 界面简洁，信息层级清晰
- **直观**: 操作直观，无需学习
- **一致**: 风格统一，符合平台规范
- **高效**: 减少操作步骤，提高效率

### 4.2 设计规范

#### 颜色系统
```typescript
primary: '#6366f1'      // 主色（紫色）
secondary: '#10b981'    // 辅色（绿色）
danger: '#ef4444'       // 危险（红色）
warning: '#f59e0b'      // 警告（橙色）

safetyHigh: '#4ade80'   // 高分（绿色）
safetyMedium: '#fbbf24' // 中分（黄色）
safetyLow: '#f87171'    // 低分（红色）
```

#### 字体系统
```typescript
h1: 32px, bold
h2: 24px, bold
h3: 20px, semibold
body: 16px, regular
caption: 14px, regular
small: 12px, regular
```

#### 间距系统
```typescript
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
xxl: 48px
```

### 4.3 交互规范

#### 反馈时间
- 按钮点击：< 100ms
- 页面跳转：< 300ms
- 数据加载：显示 Loading
- 操作成功：Toast 提示

#### 错误处理
- 网络错误：显示重试按钮
- 表单错误：实时验证提示
- 系统错误：友好的错误页面

---

## 📊 数据库设计

### 5.1 表结构

#### cities (城市表)
```sql
id: UUID
code: VARCHAR(50)        -- 'xishuangbanna'
name: VARCHAR(100)       -- '西双版纳'
country: VARCHAR(100)    -- '中国'
latitude: DECIMAL(10,7)
longitude: DECIMAL(10,7)
is_active: BOOLEAN
```

#### hotels (酒店表)
```sql
id: UUID
city_id: UUID
name: VARCHAR(200)
address: TEXT
latitude: DECIMAL(10,7)
longitude: DECIMAL(10,7)
safety_score: DECIMAL(3,2)  -- 0-5
review_count: INTEGER
is_active: BOOLEAN
```

#### reviews (评价表)
```sql
id: UUID
hotel_id: UUID
user_id: UUID
rating: DECIMAL(2,1)     -- 1-5
comment: TEXT
photos: TEXT[]
is_visible: BOOLEAN
created_at: TIMESTAMP
```

#### favorites (收藏表)
```sql
id: UUID
user_id: UUID
hotel_id: UUID
created_at: TIMESTAMP
UNIQUE(user_id, hotel_id)
```

#### photo_detections (检测记录表)
```sql
id: UUID
user_id: UUID
hotel_id: UUID (可选)
photo_url: TEXT
detection_result: JSONB
safety_score: DECIMAL(3,2)
status: VARCHAR(20)
created_at: TIMESTAMP
```

### 5.2 数据关系
```
users (Supabase Auth)
  ├── reviews (1:N)
  ├── favorites (1:N)
  └── photo_detections (1:N)

cities
  └── hotels (1:N)
      ├── reviews (1:N)
      └── favorites (1:N)
```

---

## 🔒 安全与隐私

### 6.1 数据安全
- ✅ HTTPS 通信
- ✅ Token 加密存储 (SecureStore)
- ✅ 敏感信息不缓存
- ✅ SQL 注入防护 (Supabase RLS)

### 6.2 权限管理
- 相机权限：拍照检测时请求
- 位置权限：定位功能时请求
- 存储权限：保存照片时请求

### 6.3 隐私保护
- 用户数据加密存储
- 支持匿名浏览（不登录）
- 支持删除账号和所有数据
- 遵守 GDPR 和国内隐私法规

---

## 📈 性能指标

### 7.1 性能目标
- 应用启动时间：< 2秒
- 页面切换时间：< 300ms
- 地图加载时间：< 1秒
- API 响应时间：< 500ms
- 内存占用：< 150MB

### 7.2 优化策略
- 图片懒加载和压缩
- 列表虚拟化 (FlatList)
- 地图标记聚合
- API 请求缓存
- 代码分割和按需加载

---

## 🚀 发布计划

### 8.1 开发阶段

| 阶段 | 时间 | 里程碑 |
|------|------|--------|
| 第一阶段 | 1-2天 | 项目初始化、基础配置 |
| 第二阶段 | 2-3天 | 认证、导航、状态管理 |
| 第三阶段 | 5-7天 | 核心功能开发 |
| 第四阶段 | 2-3天 | 测试、优化、Bug 修复 |
| 第五阶段 | 1-2天 | 打包发布 |

### 8.2 测试计划
- 单元测试：覆盖率 > 80%
- 集成测试：核心流程测试
- E2E 测试：关键用户路径
- 真机测试：iOS + Android

### 8.3 发布流程
1. 内部测试 (TestFlight + Internal Testing)
2. Beta 测试 (邀请用户测试)
3. 正式发布 (App Store + Google Play)

---

## 📝 附录

### A. 术语表
- **热力图**: 使用颜色渐变表示数据密度的可视化方式
- **RLS**: Row Level Security，行级安全策略
- **OTA**: Over-The-Air，空中更新

### B. 参考资料
- React Native 官方文档
- Expo 官方文档
- Supabase 官方文档
- Material Design 设计规范

---

**文档维护**: 每次重大更新后同步更新本文档  
**版本历史**: 
- v3.0 (2026-03-01): 全新重构版本
- v2.0 (2026-02-08): 旧版本（已废弃）

