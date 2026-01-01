#!/usr/bin/env tsx
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { config } from 'dotenv';
import { resolve as resolvePath } from 'node:path';

type UploadStat = { file: string; key: string; url: string };

function isVideo(file: string) {
  return /\.(mp4|mov|mkv)$/i.test(file);
}

function isPdf(file: string) {
  return /\.(pdf)$/i.test(file);
}

async function walk(input: string): Promise<string[]> {
  const st = await fs.stat(input);
  if (st.isFile()) return [input];
  const results: string[] = [];
  async function rec(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await rec(p);
      else results.push(p);
    }
  }
  await rec(input);
  return results;
}

function relFromTraining(absFile: string): string {
  const parts = absFile.split(path.sep);
  const idx = parts.lastIndexOf('training');
  if (idx >= 0) {
    return parts.slice(idx).join('/');
  }
  // fallback to file name
  return path.parse(absFile).name;
}

function targetKeyFor(file: string): { key: string; contentType: string } | null {
  const rel = relFromTraining(file);
  const noExt = rel.replace(/\.[^.]+$/, '');
  if (isPdf(file)) {
    return { key: `docs/${noExt}/full.pdf`, contentType: 'application/pdf' };
  }
  if (isVideo(file)) {
    return { key: `videos/${noExt}/full.mp4`, contentType: 'video/mp4' };
  }
  return null;
}

async function main() {
  // Load local env first so Next env validation can use it
  try {
    config({ path: resolvePath(process.cwd(), '.env.local') });
  } catch {}
  // Skip strict env validation for this standalone script
  if (!process.env.SKIP_ENV_VALIDATION) {
    process.env.SKIP_ENV_VALIDATION = '1';
  }
  // Dynamically import after env is loaded to ensure R2 creds are available
  const { r2StorageService } = await import('@/lib/storage/r2');
  const argv = process.argv.slice(2);
  const inputs = argv.length > 0 ? argv : ['training'];

  const filesSet = new Set<string>();
  for (const inp of inputs) {
    const abs = path.resolve(inp);
    try {
      const list = await walk(abs);
      list.forEach((f) => filesSet.add(f));
    } catch (err) {
      console.warn(`[upload] Skipping ${inp}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const candidates = Array.from(filesSet).filter((f) => isPdf(f) || isVideo(f));
  if (candidates.length === 0) {
    console.log('[upload] No mp4/pdf files found.');
    return;
  }

  console.log(`[upload] Found ${candidates.length} files. Uploading to R2...`);
  const results: UploadStat[] = [];

  for (const file of candidates) {
    const meta = targetKeyFor(file);
    if (!meta) continue;
    const buf = await fs.readFile(file);
    const { key, contentType } = meta;
    try {
      const res = await r2StorageService.uploadToKey(
        key,
        buf,
        contentType,
        'public, max-age=31536000, immutable'
      );
      results.push({ file, key: res.key, url: res.url });
      console.log(`  ✅ ${file} → ${res.key}`);
    } catch (err) {
      console.error(`  ❌ Failed: ${file} → ${key}`, err);
    }
  }

  console.log(`\n[upload] Completed. Uploaded ${results.length}/${candidates.length} files.`);
  for (const r of results) {
    console.log(` - ${r.key}: ${r.url}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
