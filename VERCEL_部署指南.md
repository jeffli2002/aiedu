# Vercel 部署配置指南

## 📋 部署前检查清单

### 1. 项目配置确认

✅ **已确认的配置：**
- Framework Preset: **Next.js** ✓
- Build Command: `pnpm build` 或 `npm run build` ✓
- Output Directory: Next.js default (`.next`) ✓
- Install Command: `pnpm install` ✓
- Root Directory: `./` ✓

### 2. 环境变量配置

在 Vercel 部署时，需要在 **Environment Variables** 部分添加以下环境变量：

#### 🔐 必需的环境变量

```bash
# App URL (部署后更新为 Vercel 域名)
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/database

# Auth
BETTER_AUTH_SECRET=your-secret-key-here

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FORWARD_TO_EMAIL=your-email@example.com

# R2 Storage (Cloudflare)
R2_BUCKET_NAME=your-bucket-name
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://your-r2-domain.com

# KIE API
KIE_API_KEY=your-kie-api-key

# DeepSeek API
DEEPSEEK_API_KEY=your-deepseek-api-key

# Firecrawl API (可选)
FIRECRAWL_API_KEY=fc-your-api-key

# Admin Configuration
ADMIN_EMAILS=admin@example.com

# Cron Security
CRON_SECRET=your-cron-secret-key

# Creem Payment (如果使用)
CREEM_API_KEY=your-creem-api-key
CREEM_WEBHOOK_SECRET=your-creem-webhook-secret
CREEM_PRO_PLAN_PRODUCT_KEY_MONTHLY=your-product-key
CREEM_PROPLUS_PLAN_PRODUCT_KEY_MONTHLY=your-product-key
CREEM_PRO_PLAN_PRODUCT_KEY_YEARLY=your-product-key
CREEM_PROPLUS_PLAN_PRODUCT_KEY_YEARLY=your-product-key
NEXT_PUBLIC_CREEM_TEST_MODE=false
NEXT_PUBLIC_CREEM_PRICE_PRO_MONTHLY=your-price-id
NEXT_PUBLIC_CREEM_PRICE_PRO_YEARLY=your-price-id
NEXT_PUBLIC_CREEM_PRICE_PROPLUS_MONTHLY=your-price-id
NEXT_PUBLIC_CREEM_PRICE_PROPLUS_YEARLY=your-price-id
NEXT_PUBLIC_CREEM_PRICE_PACK_200=your-product-id
NEXT_PUBLIC_CREEM_PRICE_PACK_500=your-product-id
NEXT_PUBLIC_CREEM_PRICE_PACK_1000=your-product-id
NEXT_PUBLIC_CREEM_PRICE_PACK_2000=your-product-id
NEXT_PUBLIC_CREEM_PRICE_PACK_5000=your-product-id
```

## 🚀 部署步骤

### 步骤 1: 在 Vercel 导入项目

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **"Add New"** → **"Project"**
3. 选择 **"Import Git Repository"**
4. 选择 GitHub 仓库：`jeffli2002/aiedu`
5. 选择分支：`main`

### 步骤 2: 配置项目设置

在导入页面，确认以下设置：

- **Framework Preset**: `Next.js` (自动检测)
- **Root Directory**: `./` (项目根目录)
- **Build Command**: `pnpm build` (或保持默认)
- **Output Directory**: `Next.js default` (保持默认)
- **Install Command**: `pnpm install` (或保持默认)

### 步骤 3: 配置环境变量

1. 展开 **"Environment Variables"** 部分
2. 点击 **"Add"** 添加每个环境变量
3. 为每个环境变量选择环境：
   - **Production**: 生产环境
   - **Preview**: 预览环境（PR 部署）
   - **Development**: 开发环境（可选）

**重要提示：**
- `NEXT_PUBLIC_*` 开头的变量会暴露给客户端，确保不包含敏感信息
- 部署后，将 `NEXT_PUBLIC_APP_URL` 更新为 Vercel 提供的域名

### 步骤 4: 部署

1. 点击 **"Deploy"** 按钮
2. 等待构建完成（通常 2-5 分钟）
3. 部署成功后，Vercel 会提供一个 URL（如：`https://aiedu.vercel.app`）

### 步骤 5: 更新环境变量

部署成功后，需要更新以下环境变量：

1. 在 Vercel Dashboard → Project → Settings → Environment Variables
2. 更新 `NEXT_PUBLIC_APP_URL` 为实际的 Vercel 域名
3. 如果使用 Google OAuth，更新 OAuth 回调 URL：
   - 在 Google Cloud Console 中添加：`https://your-project.vercel.app/api/auth/callback/google`
4. 如果使用 Resend，确保 `RESEND_FROM_EMAIL` 的域名已验证

## 🔧 部署后配置

### 1. 数据库迁移

部署后，需要运行数据库迁移脚本：

```bash
# 在本地运行（需要 DATABASE_URL 指向生产数据库）
pnpm db:create-all-auth-tables
pnpm db:check-auth-tables
```

或者通过 Vercel CLI：

```bash
vercel env pull .env.local
pnpm db:create-all-auth-tables
```

### 2. 域名配置（可选）

1. 在 Vercel Dashboard → Project → Settings → Domains
2. 添加自定义域名
3. 按照提示配置 DNS 记录

### 3. 环境变量更新

部署后，确保更新以下环境变量：

- `NEXT_PUBLIC_APP_URL`: 更新为实际部署 URL
- OAuth 回调 URL: 在 Google Cloud Console 中更新

## 📝 常见问题

### Q: 构建失败怎么办？

**A:** 检查以下几点：
1. 确保所有必需的环境变量都已配置
2. 检查 `package.json` 中的 `build` 脚本是否正确
3. 查看 Vercel 构建日志中的错误信息
4. 确保 `pnpm-lock.yaml` 已提交到仓库

### Q: 数据库连接失败？

**A:** 
1. 检查 `DATABASE_URL` 是否正确配置
2. 确保 Neon 数据库允许来自 Vercel IP 的连接
3. 检查数据库是否已创建所有必需的表

### Q: 图片无法加载？

**A:**
1. 检查 `next.config.js` 中的 `images.domains` 配置
2. 如果使用 R2，确保 `R2_PUBLIC_URL` 正确配置
3. 检查图片路径是否正确

### Q: 认证不工作？

**A:**
1. 检查 `BETTER_AUTH_SECRET` 是否设置
2. 确保 OAuth 回调 URL 正确配置
3. 检查 `NEXT_PUBLIC_APP_URL` 是否指向正确的域名

## 🔒 安全建议

1. **不要提交敏感信息**：确保 `.env.local` 在 `.gitignore` 中
2. **使用环境变量**：所有敏感配置都通过 Vercel 环境变量管理
3. **定期轮换密钥**：定期更新 API 密钥和 secrets
4. **启用 HTTPS**：Vercel 默认提供 HTTPS

## 📚 相关资源

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [环境变量最佳实践](https://vercel.com/docs/concepts/projects/environment-variables)


