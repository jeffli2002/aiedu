# Vercel 环境变量快速配置清单

在 Vercel Dashboard → Project → Settings → Environment Variables 中添加以下变量：

## 🔴 必需变量（必须配置，否则构建会失败）

```bash
# 应用 URL（部署后更新为 Vercel 域名）
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app

# 数据库连接（Neon PostgreSQL）
DATABASE_URL=postgresql://user:password@host:5432/database

# 认证密钥（生成：openssl rand -base64 32）
BETTER_AUTH_SECRET=your-32-character-secret-key

# Google OAuth（必需，用于社交登录）
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI API 密钥（必需，用于图片/视频生成）
KIE_API_KEY=your-kie-api-key
```

## 🟠 重要变量（强烈建议配置）

```bash
# 邮件服务（Resend）- 用于邮箱验证和密码重置
RESEND_API_KEY=re_your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FORWARD_TO_EMAIL=your-email@example.com

# R2 存储（Cloudflare）- 用于文件存储
R2_BUCKET_NAME=your-bucket-name
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://your-r2-domain.com

# DeepSeek API（用于提示词增强）
DEEPSEEK_API_KEY=your-deepseek-api-key
```

## 🟡 可选变量（根据功能需要）

```bash
# Firecrawl API（网站抓取）
FIRECRAWL_API_KEY=fc-your-api-key

# Admin 配置
ADMIN_EMAILS=admin@example.com

# Cron 安全
CRON_SECRET=your-cron-secret-key

# Creem 支付（如果使用）
CREEM_API_KEY=your-creem-api-key
CREEM_WEBHOOK_SECRET=your-creem-webhook-secret
# ... 其他 Creem 相关变量
```

## 📝 配置步骤

1. **部署前**：先添加所有必需变量
2. **部署后**：
   - 更新 `NEXT_PUBLIC_APP_URL` 为实际 Vercel 域名
   - 在 Google Cloud Console 更新 OAuth 回调 URL
   - 运行数据库迁移脚本

## ⚠️ 重要提示

- `NEXT_PUBLIC_*` 变量会暴露给客户端，不要包含敏感信息
- 所有变量都需要为 **Production** 环境配置
- 如果需要预览部署，也要为 **Preview** 环境配置

