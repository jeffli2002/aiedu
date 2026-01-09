# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FuturAI (未来AI创造者) - A bilingual (zh/en) AI education platform for K12 students built with Next.js 14. The platform offers AI training courses, a credit-based generation system for AI images/videos, and subscription payment processing.

## Commands

```bash
# Development
npm run dev          # Start dev server on port 3003
npm run dev:3000     # Start dev server on port 3000

# Build & Quality
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript type checking (tsc --noEmit)

# Database (requires .env.local with DATABASE_URL)
npm run db:create-all-tables    # Initialize all database tables
npm run db:check-user           # Check user credits (tsx scripts/check-user-credits.ts)

# Media/Assets
npm run thumbs                  # Generate thumbnails
npm run upload:training         # Upload training media to R2
npm run upload:thumbs           # Upload thumbnails to R2
```

## Git Workflow

- Always bypass Husky hooks when committing: `HUSKY=0 git commit -m "..."`.

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Auth**: better-auth with email/password + Google OAuth
- **Storage**: Cloudflare R2 (S3-compatible)
- **Payments**: Creem payment provider
- **i18n**: next-intl with URL-based locale routing (`/en/...`, `/zh/...`)

### Key Directories

```
app/
├── [locale]/           # Internationalized routes (training courses)
├── api/                # API routes
│   ├── auth/          # better-auth endpoints
│   ├── credits/       # Credit balance, history, quota
│   ├── creem/         # Payment/subscription webhooks
│   ├── media/         # PDF/video streaming with entitlements
│   ├── rewards/       # Checkin, referral, share rewards
│   └── v1/            # AI generation APIs (image/video)
├── dashboard/          # User dashboard
├── signin/, signup/    # Auth pages
└── training/           # Course pages

lib/
├── auth/              # better-auth configuration
├── storage/r2.ts      # R2StorageService for file operations
├── credits/           # CreditService for earn/spend/refund
├── training-system.ts # Course metadata and content structure
└── [feature]/         # Modular business logic (rewards, quota, affiliate, etc.)

server/db/
├── index.ts           # Drizzle db instance (neon-http adapter)
└── schema.ts          # Complete schema (~850 lines): users, credits, payments, affiliates, generation

config/
├── credits.config.ts  # Credit costs per model/operation
├── payment.config.ts  # Subscription plans and credit packs
└── styles.config.ts   # Image/video style configurations
```

### Database Schema (Drizzle)

Key table groups in `server/db/schema.ts`:
- **Auth**: user, session, account, verification (better-auth)
- **Credits**: userCredits, creditTransactions, creditPackPurchase
- **Payments**: payment, subscription, paymentEvent
- **Affiliate**: affiliate, affiliateClick, affiliateCommission, affiliatePayout
- **Content**: generatedAsset, styleConfiguration, publishSubmissions

Note: `drizzle.config.ts` references `./src/server/db/schema.ts` but actual schema is at `./server/db/schema.ts`

### Internationalization (next-intl)

This project uses **next-intl** for internationalization, optimized for Next.js App Router with Server Components support.

#### Why next-intl (not react-i18next)
- Native App Router & RSC support
- URL-based locale routing (`/en/...`, `/zh/...`) for SEO
- Automatic `<html lang>` and hreflang meta tags
- Smaller bundle size, no hydration mismatches

#### Key Files

```
i18n/
├── routing.ts          # Locale config (locales: ['en', 'zh'], default: 'zh')
├── locale-utils.ts     # Helper functions (withLocalePath, toBaseLang)
└── messages/
    ├── en.json         # English translations
    └── zh.json         # Chinese translations

middleware.ts           # next-intl middleware for locale routing
app/[locale]/layout.tsx # Provides NextIntlClientProvider with messages
```

#### Usage in Components

**Client Components:**
```typescript
'use client';
import { useTranslations, useLocale } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('namespace');  // Scoped to namespace
  const locale = useLocale();              // 'en' | 'zh'

  return <h1>{t('title')}</h1>;
}
```

**Server Components:**
```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('namespace');
  return <h1>{t('title')}</h1>;
}
```

#### Language Switching

Language switching is URL-based (not client-side state):
```typescript
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { withLocalePath } from '@/i18n/locale-utils';

const locale = useLocale();
const router = useRouter();
const nextLocale = locale === 'zh' ? 'en' : 'zh';
router.replace(withLocalePath(pathname, nextLocale));
```

#### Adding Translations

1. Add keys to both `i18n/messages/en.json` and `i18n/messages/zh.json`
2. Use nested structure: `{ "namespace": { "key": "value" } }`
3. Access via `useTranslations('namespace')` then `t('key')`

### Environment Variables

Validated via `@t3-oss/env-nextjs` in `env.ts`. Key variables:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` - Auth configuration
- `R2_*` - Cloudflare R2 credentials and bucket
- `CREEM_*` - Payment provider keys
- `KIE_API_KEY`, `DEEPSEEK_API_KEY` - AI service keys

### Credit System

Credits are the platform currency for AI generations:
- Image generation: 5-30 credits depending on model/resolution
- Video generation: 25-300 credits depending on quality/duration
- Rewards: daily checkin (2), referrals (10), social shares (2)

See `config/credits.config.ts` for all pricing and `lib/credits/` for CreditService.

### Path Alias

Uses `@/*` mapping to project root (configured in `tsconfig.json`).

Example: `import { db } from '@/server/db'`

## Lessons Learned (Type Errors)

- Centralize Drizzle insert/update value types and reuse them across repositories.
- When schema changes, update write types and explicit select mappings in the same sweep.
- Keep TS compile scope tight (exclude legacy configs or add missing deps).
- Prefer explicit UI prop interfaces over brittle `Pick`/inference patterns.
- Run `pnpm build` (or at least `pnpm lint`) before pushing.

## Training Media System

### Course ID Format

`<module><series><course>` - e.g., `f101`, `c201`, `e301`, `v401`
- `f` = AI Foundations, `c` = Modality/Creation, `e` = Efficiency, `v` = Vibe Coding
- Legacy short IDs (e.g., `f1`) are normalized to new format in `app/training/[courseId]/page.tsx`

### Local File Structure

```
training/<Module Name>/<courseId>/<locale>/
  <slug>_Tnn.pdf          # e.g., ai-evolution-story_T01.pdf
  <slug>_Tnn.mp4          # e.g., ai-llm-evolution_T01.mp4
  <slug>_Tnn_thumb.jpg    # Optional local thumbnail
```

### R2 Storage Keys

From mediaId `training/<courseId>/<locale>/<slug>_Tnn`, R2 maps to:

**PDFs:**
- `docs/training/<courseId>/<locale>/<slug>_Tnn/full.pdf`
- `docs/training/<courseId>/<locale>/<slug>_Tnn/preview.pdf` (optional)
- `docs/training/<courseId>/<locale>/<slug>_Tnn/thumb.jpg`

**Videos:**
- `videos/training/<courseId>/<locale>/<slug>_Tnn/full.mp4`
- `videos/training/<courseId>/<locale>/<slug>_Tnn/thumb.jpg`

### Media API Endpoints

- PDF thumbnail (public): `/api/media/pdf/<mediaId>?thumb=1`
- PDF document (auth): `/api/media/pdf/<mediaId>?authOnly=1`
- Video thumbnail (public): `/api/media/video/<mediaId>/manifest?thumb=1`
- Video stream (auth): `/api/media/video/<mediaId>/manifest?authOnly=1`

### Adding New Course Materials

1. Place files in `training/<Module Name>/<courseId>/<locale>/` with naming `<slug>_Tnn.(pdf|mp4)`
2. Upload to R2 using canonical keys (see upload scripts)
3. Add course/material entries to `lib/training-system.ts` with `mediaId` only (no `thumbKey` needed)
4. Verify via `/api/media/pdf/<id>?thumb=1` or `/{locale}/training/{courseId}`

See `docs/training-media.md` for complete documentation.
