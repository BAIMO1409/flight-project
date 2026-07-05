# 机票列表页面 - 自学项目

本项目实现了一个移动端机票列表页面，参照去哪儿网移动端机票搜索结果页进行开发。

## 运行方式

### 环境要求

- Node.js >= 18.x
- npm >= 9.x

### 启动步骤

```bash
# 1. 启动后端服务
cd server
npm install
npm start
# 后端服务运行在 http://localhost:3003

# 2. 启动前端开发服务器
cd client
npm install
npm start
# 前端页面运行在 http://localhost:3001
```

### 构建命令

```bash
# 前端构建
cd client
npm run build

# 后端启动（开发模式）
cd server
npm run dev
```

## 项目技术栈选型

### 前端技术栈

| 技术 | 版本 | 选型依据 |
|------|------|----------|
| React | 18.x | 主流前端框架，组件化开发，生态成熟，适合构建复杂的用户界面 |
| TypeScript | 5.x | 提供类型安全，减少运行时错误，提高代码可维护性 |
| MobX | 6.x | 状态管理方案，响应式设计，代码简洁，适合中等规模项目 |
| SCSS | latest | CSS预处理器，支持嵌套、变量、混合等特性，提高样式开发效率 |
| axios | 1.x | 轻量级HTTP客户端，支持拦截器、CancelToken等功能 |
| Webpack | 5.x | 模块打包工具，灵活配置，支持热更新 |

### 后端技术栈

| 技术 | 版本 | 选型依据 |
|------|------|----------|
| Express | 4.x | 轻量级Node.js框架，简单易用，生态成熟，适合快速搭建RESTful API |
| cors | latest | 跨域资源共享中间件，解决前后端分离架构的跨域问题 |
| nodemon | latest | 开发环境自动重启工具，提高开发效率 |

### 技术选型思考

1. **React vs Vue**：选择React是因为它在面试和实际项目中更广泛使用，且JSX语法更灵活。

2. **MobX vs Redux**：选择MobX是因为它的响应式设计更直观，代码量更少。项目规模中等，MobX的简单API更适合快速开发。

3. **手动搭建Webpack vs Create React App**：选择手动搭建是为了更好地理解Webpack配置原理，包括loader、plugin、devServer等核心概念。

4. **Express vs Koa**：选择Express是因为它更成熟，文档丰富，社区活跃，对于简单的Mock API服务足够使用。

## 核心功能实现

### 1. 日期切换组件
- 横向滚动日期列表
- 选中日期平滑滚动居中（scrollIntoView API）
- 日期浮层随滚动隐藏/显示

### 2. 排序筛选组件
- 推荐排序：综合价格、时长、出发时段计算评分
- 时间排序：按出发时间排序
- 价格排序：按价格从低到高排序

### 3. 航班列表组件
- 航班卡片展示（时间、价格、航班号、航空公司、折扣等）
- 骨架屏加载效果
- 下拉刷新功能

### 4. 请求竞态处理
- 使用axios CancelToken取消之前的请求
- 确保只显示最新请求的响应数据

### 5. 搜索条件持久化
- 使用localStorage存储选中日期和排序方式
- 页面刷新后自动恢复条件并发起请求

### 6. 交互效果
- 底部Tab滚动隐藏/显示
- 回到顶部按钮
- 平滑滚动动画

## 项目结构

```
flight-project/
├── server/                    # 后端服务
│   ├── index.js              # 服务入口
│   ├── routes/               # API路由
│   │   └── flights.js        # 航班接口
│   ├── mock/                 # Mock数据
│   │   └── data.js           # 模拟数据生成
│   └── package.json
├── client/                   # 前端应用
│   ├── src/
│   │   ├── components/       # 组件目录
│   │   │   ├── Header/       # 头部组件
│   │   │   ├── DatePicker/   # 日期选择组件
│   │   │   ├── FlightList/   # 航班列表组件
│   │   │   ├── FlightCard/   # 航班卡片组件
│   │   │   ├── FilterBar/    # 筛选栏组件
│   │   │   ├── Skeleton/     # 骨架屏组件
│   │   │   └── BackToTop/    # 回到顶部组件
│   │   ├── store/            # 状态管理
│   │   │   ├── mobx/         # MobX实现
│   │   │   └── redux/        # Redux实现（备用）
│   │   ├── services/         # API服务
│   │   │   └── api.ts        # 接口请求封装
│   │   ├── types/            # TypeScript类型定义
│   │   ├── utils/            # 工具函数
│   │   ├── App.tsx           # 主应用组件
│   │   ├── index.tsx         # 入口文件
│   │   └── index.scss        # 全局样式
│   ├── webpack.config.js     # Webpack配置
│   └── package.json
├── README.md                 # 项目说明文档
├── 项目计划.txt               # 项目实施计划
└── 开发规范.md               # 开发规范文档
```

## 遇到的困难与解决方案

### 困难1：日期浮层和底部Tab的滚动交互逻辑复杂

**问题描述**：需要实现日期浮层和底部Tab在滚动时隐藏，停止滚动或滚动到顶部时有足够空间时显示。

**解决方案**：
- 监听window.scroll事件
- 使用scrollTimeout延迟判断是否停止滚动
- 计算Header和DatePicker的总高度，判断当前滚动位置是否在顶部区域
- 使用CSS transform实现平滑的显示/隐藏动画

### 困难2：请求竞态问题

**问题描述**：快速频繁切换日期或筛选项时，可能出现旧请求的响应数据覆盖新请求数据的情况。

**解决方案**：
- 使用axios的CancelToken机制
- 每次发起新请求前取消之前的请求
- 在api.ts中维护一个全局的cancelTokenSource，每次请求前检查并取消

### 困难3：Mock数据一致性问题

**问题描述**：每次请求后端都重新生成随机数据，导致同一日期返回的航班数据不一致。

**解决方案**：
- 实现基于种子的伪随机数生成器（LCG算法）
- 使用日期字符串作为种子，确保同一日期生成相同的航班数据
- 添加数据缓存机制，避免重复生成

### 困难4：推荐排序与价格排序效果相同

**问题描述**：推荐排序和价格排序使用了相同的排序逻辑，都是按价格升序排序。

**解决方案**：
- 实现综合评分算法，考虑价格（40%权重）、时长（30%权重）、出发时段（30%权重）
- 黄金时段（7-9点、14-16点、19-21点）给予加分，非黄金时段减分

### 困难5：Windows环境下PowerShell执行策略限制

**问题描述**：Windows系统下PowerShell默认禁止执行脚本，导致npm命令无法正常运行。

**解决方案**：
- 使用完整路径调用node和npm：`& "C:\Program Files\nodejs\node.exe"`
- 设置环境变量PATH：`$env:PATH = "C:\Program Files\nodejs;" + $env:PATH`

## API接口定义

### GET /api/flights

获取航班列表

**入参**：
- date: string - 日期，格式 YYYY-MM-DD
- sort: string - 排序方式：recommend(推荐), time(时间), price(价格)
- page: number - 页码，默认1

**出参**：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "flights": [],
    "total": 10,
    "dateList": []
  }
}
```

### GET /api/dates

获取可选日期列表

**出参**：
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "date": "2026-07-05",
      "week": "今天",
      "price": 420,
      "isToday": true
    }
  ]
}
```

## 质量验收标准

### 功能验收
- ✅ 日期切换功能正常，选中日期居中显示
- ✅ 排序筛选功能正常（推荐、时间、价格）
- ✅ 航班列表数据正确展示
- ✅ 骨架屏加载效果正常
- ✅ 请求竞态处理正确
- ✅ 搜索条件持久化正常
- ✅ 下拉刷新功能正常
- ✅ 底部Tab滚动隐藏/显示正常
- ✅ 回到顶部功能正常

### 界面验收
- ✅ 页面布局符合移动端设计
- ✅ 按钮点击有反馈效果
- ✅ 日期选中状态明显
- ✅ 航班卡片信息完整清晰
- ✅ 加载动画流畅

### 性能验收
- ✅ 首屏加载时间 < 2秒
- ✅ 数据请求响应时间 < 1秒
- ✅ 页面滚动流畅无卡顿

## 后续工作

1. 使用Redux实现状态管理（通过分支隔离）
2. 添加更多筛选条件（航空公司、起降时段等）
3. 实现航班详情页面
4. 添加登录/注册功能
5. 接入真实的机票API

## License

MIT License
