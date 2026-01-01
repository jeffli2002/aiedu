# Future AI Creators | 未来AI创造者

面向 K12（小学高年级–初中）青少年的 AI 教育展示与招生型网站。

## 项目简介

Future AI Creators 是一个展示型网站，用于介绍"AI × 未来社会"的核心理念，展示学生可完成的真实 AI 项目，并承载线下寒假 AI 创作营的报名申请。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **国际化**: react-i18next
- **字体**: Inter, Poppins

## 功能特性

- ✅ 响应式设计（移动端、平板、桌面端）
- ✅ 中英文双语切换
- ✅ 首页 Hero Banner 和核心主张展示
- ✅ 三大项目模块展示
- ✅ 冬季营活动介绍
- ✅ 在线报名表单
- ✅ 关于我们页面
- ✅ 现代化 UI 设计（未来感、科技感、青少年友好）

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 运行开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看网站。

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
.
├── app/                    # Next.js App Router 页面
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── globals.css        # 全局样式
│   ├── projects/          # 项目展示页面
│   ├── camp/              # 冬季营页面
│   ├── apply/             # 报名页面
│   └── about/             # 关于我们页面
├── components/            # React 组件
│   ├── Navbar.tsx        # 导航栏
│   ├── Footer.tsx        # 页脚
│   ├── Hero.tsx          # Hero Banner
│   ├── ValueProposition.tsx  # 核心主张
│   ├── Projects.tsx      # 项目展示
│   ├── CTA.tsx           # 行动号召
│   └── I18nProvider.tsx  # 国际化提供者
├── lib/                  # 工具库
│   └── i18n.ts          # 国际化配置
├── public/               # 静态资源
│   └── locales/         # 翻译文件
│       ├── zh/          # 中文翻译
│       └── en/          # 英文翻译
└── package.json         # 项目配置
```

## 页面说明

### 首页 (/)
- Hero Banner（未来感视觉 + 视频占位）
- 核心主张展示
- 三大项目模块预览
- 冬季营 CTA

### 项目展示 (/projects)
- 详细展示三个 AI 项目模块
- 每个项目的特色和功能

### 冬季营 (/camp)
- 活动时间和形式
- 活动收获展示

### 报名申请 (/apply)
- 学生信息表单
- 兴趣方向选择
- 表单提交功能

### 关于我们 (/about)
- 教育理念
- AI × 未来社会愿景
- 教学方式

## 国际化

网站支持中英文切换，翻译文件位于 `public/locales/` 目录下。

- 中文: `public/locales/zh/common.json`
- 英文: `public/locales/en/common.json`

语言设置会保存在浏览器的 localStorage 中。

## 样式定制

项目使用 Tailwind CSS，配置文件为 `tailwind.config.js`。主要颜色：

- **Primary**: 蓝色系 (#0ea5e9)
- **Accent**: 紫色系 (#d946ef)

## 部署

### Vercel（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 自动部署完成

### 其他平台

```bash
npm run build
npm start
```

## 后续开发建议

1. **表单后端集成**: 连接 Supabase 或 Firebase 处理报名数据
2. **视频集成**: 替换 Hero 区域的视频占位为实际视频
3. **作品展示**: 添加学生作品 Gallery 页面
4. **SEO 优化**: 添加 meta 标签和结构化数据
5. **性能优化**: 图片优化、代码分割等

## 许可证

© Future AI Creators










