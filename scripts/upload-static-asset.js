#!/usr/bin/env node
// Minimal uploader to push a local asset to R2 at an explicit key.
// Usage:
//   node scripts/upload-static-asset.js <file>=<r2-key> [more ...]
// Examples:
//   node scripts/upload-static-asset.js "training/f101/ai-evolution-story_T01_zh.pdf=docs/training/f101/ai-evolution-story_T01_zh/full.pdf"
//   node scripts/upload-static-asset.js "training/f101/ai-llm-evolution_T01_zh.mp4=videos/training/f101/ai-llm-evolution_T01_zh/full.mp4"

const fs = require('node:fs');
const path = require('node:path');
const { config: dotenv } = require('dotenv');

try { dotenv({ path: path.resolve(process.cwd(), '.env.local') }); } catch {}

const {
  R2_ENDPOINT,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL,
} = process.env;

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_PUBLIC_URL) {
  console.error('[upload-static-asset] Missing R2 env vars. Set R2_* in .env.local');
  process.exit(1);
}

function parse(a) {
  const eq = a.indexOf('=');
  if (eq < 1) return null;
  return { file: a.slice(0, eq), key: a.slice(eq + 1) };
}

function contentTypeFor(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.pdf') return 'application/pdf';
  if (ext === '.mp4') return 'video/mp4';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  return 'application/octet-stream';
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: node scripts/upload-static-asset.js <file>=<r2-key> [more ...]');
    process.exit(1);
  }
  const mappings = args.map(parse).filter(Boolean);
  const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
  const s3 = new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  });

  let ok = 0;
  for (const m of mappings) {
    const abs = path.resolve(m.file);
    if (!fs.existsSync(abs)) {
      console.error(`❌ Not found: ${m.file}`);
      continue;
    }
    const buf = fs.readFileSync(abs);
    const ct = contentTypeFor(abs);
    try {
      await s3.send(new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: m.key,
        Body: buf,
        ContentType: ct,
        CacheControl: 'public, max-age=31536000, immutable',
      }));
      const url = `${R2_PUBLIC_URL.replace(/\/$/, '')}/${m.key}`;
      console.log(`✅ ${m.file} → ${m.key}`);
      console.log(`   ${url}`);
      ok++;
    } catch (err) {
      console.error(`❌ Failed: ${m.file} → ${m.key}`);
      console.error(err && err.message ? err.message : String(err));
    }
  }
  if (ok === 0) process.exit(2);
}

main();

