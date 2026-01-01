#!/usr/bin/env tsx
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { config as dotenv } from 'dotenv';
import { resolve as resolvePath } from 'node:path';

type UploadResult = { file: string; key: string; url: string };

function usageAndExit(): never {
  console.log('Usage: pnpm tsx scripts/upload-thumbnails.ts <file[=r2-key]> [more ...]');
  console.log('Examples:');
  console.log('  pnpm tsx scripts/upload-thumbnails.ts "training/thumbnail_T1_pdf.png=docs/training/thumbnail_T1_pdf.png"');
  console.log('  pnpm tsx scripts/upload-thumbnails.ts "training/thumbnail_T1_mp4.png=videos/training/thumbnail_T1_mp4.png"');
  console.log('  pnpm tsx scripts/upload-thumbnails.ts training/thumbnail_T1_pdf.png training/thumbnail_T1_mp4.png');
  console.log('    (without explicit keys, will infer docs/videos/ by filename suffix _pdf/_mp4)');
  process.exit(1);
}

function inferKey(file: string): string | null {
  const base = path.basename(file);
  const lower = base.toLowerCase();
  if (lower.endsWith('_pdf.png') || lower.includes('pdf')) {
    return `docs/training/${base}`;
  }
  if (lower.endsWith('_mp4.png') || lower.includes('mp4')) {
    return `videos/training/${base}`;
  }
  // default to images bucket under training
  return `images/training/${base}`;
}

async function main() {
  // Load local env so R2 creds are available for the service.
  try { dotenv({ path: resolvePath(process.cwd(), '.env.local') }); } catch {}
  // Skip strict Next env validation since this is a standalone script.
  if (!process.env.SKIP_ENV_VALIDATION) process.env.SKIP_ENV_VALIDATION = '1';

  const args = process.argv.slice(2);
  if (args.length === 0) usageAndExit();

  const mappings: Array<{ file: string; key: string } > = [];
  for (const a of args) {
    const eq = a.indexOf('=');
    if (eq > 0) {
      const file = a.slice(0, eq);
      const key = a.slice(eq + 1);
      mappings.push({ file, key });
    } else {
      const key = inferKey(a);
      if (!key) {
        console.warn(`[thumb-upload] Could not infer key for ${a}; please provide explicit mapping with file=key`);
        continue;
      }
      mappings.push({ file: a, key });
    }
  }

  if (mappings.length === 0) usageAndExit();

  const { r2StorageService } = await import('@/lib/storage/r2');

  const results: UploadResult[] = [];
  for (const m of mappings) {
    const abs = path.resolve(m.file);
    const buf = await fs.readFile(abs);
    const ct = m.file.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
    try {
      const res = await r2StorageService.uploadToKey(
        m.key,
        buf,
        ct,
        'public, max-age=31536000, immutable'
      );
      results.push({ file: m.file, key: res.key, url: res.url });
      console.log(`✅ ${m.file} → ${res.key}`);
    } catch (err) {
      console.error(`❌ Failed: ${m.file} → ${m.key}`, err);
    }
  }

  console.log(`\n[thumb-upload] Uploaded ${results.length}/${mappings.length} file(s):`);
  for (const r of results) console.log(` - ${r.key}: ${r.url}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

