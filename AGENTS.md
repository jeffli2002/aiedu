# Repository Guidelines

## Project Structure & Module Organization

- `app/`: Next.js App Router pages and layouts (e.g. `app/page.tsx`, `app/<route>/page.tsx`, `app/layout.tsx`, `app/not-found.tsx`, `app/globals.css`).
- `components/`: shared React UI components (PascalCase filenames like `components/Navbar.tsx`).
- `lib/`: shared utilities and configuration (e.g. `lib/i18n.ts`).
- `public/`: static assets and translations (e.g. `public/locales/{en,zh}/common.json`).
- Generated output: `.next/` (do not commit).

## Build, Test, and Development Commands

Use `pnpm` (lockfile: `pnpm-lock.yaml`).

- `pnpm install`: install dependencies.
- `pnpm dev`: run the dev server at `http://localhost:3000`.
- `pnpm build`: produce a production build.
- `pnpm start`: serve the production build.
- `pnpm lint`: run Next.js ESLint checks (`next lint`).

## Coding Style & Naming Conventions

- TypeScript is `strict`; avoid `any` and keep props/types explicit.
- Match existing formatting: 2-space indentation, semicolons, single quotes.
- Components use PascalCase; variables/functions use camelCase.
- Add `'use client';` at the top of any component that uses hooks or browser APIs.
- Prefer Tailwind utility classes; only add global CSS to `app/globals.css` when necessary.
- Keep i18n keys stable and update both languages together.

## Testing Guidelines

No test runner is configured yet (no `test` script). If you add tests, keep them close to the feature (e.g. `components/__tests__/Navbar.test.tsx` or `*.test.tsx`) and add a `pnpm test` script with the chosen framework.

## Commit & Pull Request Guidelines

- Commit messages: use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`) with short, imperative subjects.
- PRs: include a clear description, link relevant context (e.g. `Future_AI_Creators_PRD.md`), and attach screenshots for UI changes.
- Before opening: run `pnpm lint` and smoke-check both locales render correctly.

## Security & Configuration Tips

- Put local configuration in `.env.local` (ignored by `.gitignore`) and never commit `.env*` files.
- Keep `next.config.js` changes minimal and explain any runtime/asset implications in the PR.

## Better Auth: Migration & Schema Checklist

- Generate schema with CLI to match the installed version:
  - `npx @better-auth/cli@latest generate`
- Verify `server/db/schema.ts` defines all core tables and matches Better Auth requirements:
  - `user`, `session`, `account`, `verification`, `rateLimit`
  - Ensure `rateLimit` includes `id` as PRIMARY KEY
- Keep Drizzle migrations in sync; if needed, generate and run:
  - `npx drizzle-kit generate`
- Create/repair tables if migrations are out-of-date:
  - `pnpm db:create-all-auth-tables`
- Validate DB state aligns with schema:
  - `pnpm db:check-auth-tables`
