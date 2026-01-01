#!/usr/bin/env tsx
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

type CliOpts = {
  server: string;
  width: number;
  height: number;
  quality: number; // jpeg quality 2-31 (ffmpeg scale; lower is better). We'll just keep for future.
  inputs: string[];
};

function parseArgs(argv: string[]): CliOpts {
  const opts: CliOpts = {
    server: process.env.THUMB_SERVER || 'http://localhost:3003',
    width: Number(process.env.THUMB_WIDTH || 1280),
    height: Number(process.env.THUMB_HEIGHT || 720),
    quality: Number(process.env.THUMB_QUALITY || 2),
    inputs: [],
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--server' && argv[i + 1]) {
      opts.server = argv[++i];
    } else if (a === '--width' && argv[i + 1]) {
      opts.width = Number(argv[++i]);
    } else if (a === '--height' && argv[i + 1]) {
      opts.height = Number(argv[++i]);
    } else if (a === '--quality' && argv[i + 1]) {
      opts.quality = Number(argv[++i]);
    } else if (a.startsWith('-')) {
      // ignore unknown flags
    } else {
      opts.inputs.push(a);
    }
  }

  return opts;
}

async function which(cmd: string): Promise<string | null> {
  return new Promise((resolve) => {
    const proc = spawn(process.platform === 'win32' ? 'where' : 'which', [cmd]);
    let out = '';
    proc.stdout.on('data', (d) => (out += d.toString()))
      .on('end', () => resolve(out.trim() ? out.trim().split(/\r?\n/)[0] : null));
    proc.on('error', () => resolve(null));
  });
}

async function ensureDeps() {
  const ffmpeg = await which('ffmpeg');
  const pdftoppm = await which('pdftoppm');
  if (!ffmpeg) {
    throw new Error('ffmpeg not found in PATH. Please install ffmpeg.');
  }
  if (!pdftoppm) {
    console.warn('[thumb] pdftoppm not found. PDF thumbnails will be skipped. Install poppler-utils to enable.');
  }
  return { ffmpeg, pdftoppm } as const;
}

async function walkFiles(input: string): Promise<string[]> {
  const stats = await fs.stat(input);
  if (stats.isFile()) return [input];
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

function toR2ThumbKey(file: string): { key: string; kind: 'video' | 'pdf' | 'other' } {
  const ext = path.extname(file).toLowerCase();
  const relTrainingIdx = file.split(path.sep).lastIndexOf('training');
  let rel = path.parse(file).name;
  if (relTrainingIdx >= 0) {
    // build relative path starting at 'training'
    const parts = file.split(path.sep).slice(relTrainingIdx);
    const noExt = parts.slice(0, -1).concat(path.parse(parts.at(-1) || '').name).join('/');
    rel = noExt;
  }
  if (ext === '.mp4' || ext === '.mov' || ext === '.mkv') {
    return { key: `videos/${rel}/thumb.jpg`, kind: 'video' };
  }
  if (ext === '.pdf') {
    return { key: `docs/${rel}/thumb.jpg`, kind: 'pdf' };
  }
  return { key: `misc/${rel}/thumb.jpg`, kind: 'other' };
}

function run(cmd: string, args: string[], cwd?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: 'inherit', cwd });
    proc.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`));
    });
    proc.on('error', reject);
  });
}

async function genVideoThumb(ffmpegPath: string, file: string, w: number, h: number, outFile: string) {
  const vf = `thumbnail,scale=${w}:-1:flags=lanczos:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2:black`;
  const args = ['-y', '-i', file, '-vf', vf, '-frames:v', '1', '-an', outFile];
  await run(ffmpegPath, args);
}

async function genPdfThumb(pdftoppmPath: string | null, ffmpegPath: string, file: string, w: number, h: number, outFile: string) {
  if (!pdftoppmPath) throw new Error('pdftoppm not available to render PDF');
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pdfthumb-'));
  const prefix = path.join(tmpDir, 'page1');
  const ppmOut = `${prefix}.png`;
  const args = ['-png', file, '-f', '1', '-l', '1', '-singlefile', '-scale-to-x', String(w), '-scale-to-y', '-1', prefix];
  await run(pdftoppmPath, args);
  if (!existsSync(ppmOut)) throw new Error('Failed to render PDF first page');
  const vf = `scale=${w}:-1:flags=lanczos:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2:white`;
  await run(ffmpegPath, ['-y', '-i', ppmOut, '-vf', vf, '-frames:v', '1', '-an', outFile]);
}

async function uploadThumb(server: string, key: string, file: string) {
  const buf = await fs.readFile(file);
  const base64 = buf.toString('base64');
  const body = {
    key,
    content: `data:image/jpeg;base64,${base64}`,
    contentType: 'image/jpeg',
  };
  const res = await fetch(`${server.replace(/\/$/, '')}/api/media/thumbnail`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} ${res.statusText} ${text}`);
  }
  const json = (await res.json()) as any;
  console.log(`[thumb] Uploaded → ${json.url}`);
}

async function main() {
  const opts = parseArgs(process.argv);
  if (opts.inputs.length === 0) {
    console.log('Usage: pnpm tsx scripts/generate-thumbnails.ts [--server http://localhost:3003] <file-or-dir> [more ...]');
    console.log('Examples:');
    console.log('  pnpm tsx scripts/generate-thumbnails.ts training');
    console.log('  pnpm tsx scripts/generate-thumbnails.ts training/AI_Evolution_Story_T1.pdf training/AI大模型进化T1.mp4');
    process.exit(1);
  }

  const { ffmpeg, pdftoppm } = await ensureDeps();
  const filesSet = new Set<string>();
  for (const input of opts.inputs) {
    const abs = path.resolve(input);
    if (!existsSync(abs)) {
      console.warn(`[thumb] Skipping not found: ${input}`);
      continue;
    }
    const all = await walkFiles(abs);
    all.forEach((f) => filesSet.add(f));
  }

  const files = Array.from(filesSet).filter((f) => /\.(mp4|mov|mkv|pdf)$/i.test(f));
  if (files.length === 0) {
    console.log('[thumb] No supported files found (.mp4, .mov, .mkv, .pdf).');
    return;
  }

  console.log(`[thumb] Generating ${files.length} thumbnails (${opts.width}x${opts.height}) → ${opts.server}`);
  for (const file of files) {
    const { key, kind } = toR2ThumbKey(file);
    const tmpOut = path.join(os.tmpdir(), `thumb-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`);
    try {
      if (kind === 'video') {
        console.log(`[thumb] Video: ${file}`);
        await genVideoThumb(ffmpeg!, file, opts.width, opts.height, tmpOut);
      } else if (kind === 'pdf') {
        console.log(`[thumb] PDF: ${file}`);
        await genPdfThumb(pdftoppm || null, ffmpeg!, file, opts.width, opts.height, tmpOut);
      } else {
        console.log(`[thumb] Skipping unsupported kind for ${file}`);
        continue;
      }
      await uploadThumb(opts.server, key, tmpOut);
    } catch (err) {
      console.error(`[thumb] Failed for ${file}:`, err);
    } finally {
      try { await fs.unlink(tmpOut); } catch {}
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

