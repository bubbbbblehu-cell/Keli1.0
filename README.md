# 女性安全地图 - 移动端

一款专为女性用户设计的跨平台移动应用，通过热力图可视化展示酒店安全评分，并集成 AI 拍照检测功能。

## 🎯 项目概述

- **版本**: 3.0.0
- **平台**: iOS + Android
- **技术栈**: React Native + Expo + TypeScript
- **状态管理**: Zustand
- **后端**: Supabase + Node.js API

## 📁 项目结构

```
safety-map-mobile/
├── src/
│   ├── app/                    # 应用入口
│   │   ├── App.tsx
│   │   └── navigation/         # 导航配置
│   ├── features/               # 功能模块
│   │   ├── auth/              # 认证模块
│   │   ├── map/               # 地图模块
│   │   ├── hotel/             # 酒店模块
│   │   ├── detection/         # 检测模块
│   │   └── profile/           # 个人中心
│   ├── shared/                # 共享资源
│   │   ├── components/        # 通用组件
│   │   ├── hooks/             # 通用 Hooks
│   │   ├── utils/             # 工具函数
│   │   ├── constants/         # 常量
│   │   └── types/             # TypeScript 类型
│   ├── services/              # 服务层
│   │   ├── api/               # API 客户端
│   │   ├── supabase/          # Supabase 服务
│   │   └── location/          # 定位服务
│   └── assets/                # 静态资源
├── app.json                   # Expo 配置
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `env.example` 为 `.env` 并填写配置：

```bash
SUPABASE_URL=你的_Supabase_URL
SUPABASE_ANON_KEY=你的_Supabase_密钥
API_URL=你的_API_地址
COZE_BOT_ID=7588350694353649679
```

### 3. 启动开发服务器

```bash
npm start
```

### 4. 在设备上运行

- **iOS**: 按 `i` 或运行 `npm run ios`
- **Android**: 按 `a` 或运行 `npm run android`
- **Expo Go**: 扫描二维码

## 📱 核心功能

### 1. 地图展示
- 热力图可视化安全评分
- 酒店标记点击查看详情
- 城市切换
- 评分筛选

### 2. 酒店详情
- 安全评分展示
- 用户评价列表
- 添加评价
- 收藏功能

### 3. AI 拍照检测
- 6个检测部位选择
- 自查引导
- 拍照上传
- AI 智能分析
- 结果展示

### 4. 个人中心
- 个人信息管理
- 收藏列表
- 检测历史

## 🛠️ 开发命令

```bash
# 启动开发服务器
npm start

# 运行 iOS
npm run ios

# 运行 Android
npm run android

# 代码检查
npm run lint

# 代码格式化
npm run format

# 运行测试
npm test
```

## 📚 技术文档

- [产品需求文档](./PRD.md)
- [架构设计文档](./ARCHITECTURE.md)
- [技术选型文档](./TECH_STACK.md)
- [开发检查清单](./DEVELOPMENT_CHECKLIST.md)

## 🔒 安全与隐私

- HTTPS 通信
- Token 加密存储
- 敏感信息不缓存
- 遵守 GDPR 和国内隐私法规

## 📄 许可证

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

---

**开发时间**: 预计 10-15 天  
**当前状态**: 项目初始化完成 ✅

