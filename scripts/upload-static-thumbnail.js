#!/usr/bin/env node
// Minimal uploader to push a local thumbnail image to R2 without TS/tsx.
// Usage:
//   node scripts/upload-static-thumbnail.js "training/thumbnail_T1_pdf.png=docs/training/thumbnail_T1_pdf.png"
//   node scripts/upload-static-thumbnail.js training/thumbnail_T1_pdf.png  (auto-infers key)

const fs = require('node:fs');
const path = require('node:path');
const { config: dotenv } = require('dotenv');

// Load .env.local if present so R2 creds are available
try { dotenv({ path: path.resolve(process.cwd(), '.env.local') }); } catch {}

const {
  R2_ENDPOINT,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL,
} = process.env;

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_PUBLIC_URL) {
  console.error('[upload-static-thumbnail] Missing R2 environment variables. Please set R2_* in .env.local');
  process.exit(1);
}

function inferKey(file) {
  const base = path.basename(file);
  const lower = base.toLowerCase();
  if (lower.endsWith('_pdf.png') || lower.includes('pdf')) return `docs/training/${base}`;
  if (lower.endsWith('_mp4.png') || lower.includes('mp4')) return `videos/training/${base}`;
  return `images/training/${base}`;
}

function parseArg(a) {
  const eq = a.indexOf('=');
  if (eq > 0) return { file: a.slice(0, eq), key: a.slice(eq + 1) };
  return { file: a, key: inferKey(a) };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: node scripts/upload-static-thumbnail.js <file[=r2-key]> [more ...]');
    process.exit(1);
  }

  const mappings = args.map(parseArg);

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
    const body = fs.readFileSync(abs);
    const ct = abs.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
    try {
      await s3.send(new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: m.key,
        Body: body,
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

