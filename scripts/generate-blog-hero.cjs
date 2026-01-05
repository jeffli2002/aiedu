// Usage: node scripts/generate-blog-hero.cjs <slug> "<title>" "k1,k2,k3"
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

async function readEnvKey() {
  if (process.env.KIE_API_KEY) return process.env.KIE_API_KEY;
  const envPath = path.join(process.cwd(), '.env.local');
  try {
    const txt = await fsp.readFile(envPath, 'utf8');
    const m = txt.match(/^KIE_API_KEY\s*=\s*(.+)$/m);
    if (m) return m[1].trim();
  } catch {}
  throw new Error('KIE_API_KEY not found in environment or .env.local');
}

async function createTask(apiKey, prompt) {
  const body = {
    model: 'nano-banana-pro',
    input: {
      prompt,
      aspect_ratio: '16:9',
      resolution: '2K',
      // omit output_format to use default accepted format by KIE
    },
  };
  const res = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  });
  const txt = await res.text();
  if (!res.ok || !txt) throw new Error(`KIE createTask error: ${res.status} ${txt}`);
  const data = JSON.parse(txt);
  if (data.code !== 200) throw new Error(`KIE createTask failed: ${data.msg || 'Unknown error'}`);
  return data.data.taskId;
}

async function getTaskInfo(apiKey, taskId) {
  const res = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const txt = await res.text();
  if (!res.ok || !txt) throw new Error(`KIE recordInfo error: ${res.status} ${txt}`);
  const data = JSON.parse(txt);
  return data;
}

async function pollForImage(apiKey, taskId, maxAttempts = 80, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const info = await getTaskInfo(apiKey, taskId);
    const state = info?.data?.state || info?.data?.status;
    if (state === 'success' || state === 'completed') {
      let url = info?.data?.result?.imageUrl || (info?.data?.result?.resultUrls || [])[0];
      if (!url && typeof info?.data?.resultJson === 'string') {
        try {
          const parsed = JSON.parse(info.data.resultJson);
          url = (parsed.resultUrls || [])[0];
        } catch {}
      }
      if (url) return url;
      throw new Error('Task completed but no image URL found');
    }
    if (state === 'fail' || state === 'failed') {
      throw new Error(info?.data?.error || info?.data?.failMsg || 'Task failed');
    }
    if (i < maxAttempts - 1) await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Task polling timeout');
}

async function main() {
  const [slug, title, keywordsCsv] = process.argv.slice(2);
  if (!slug || !title) {
    console.error('Usage: node scripts/generate-blog-hero.cjs <slug> "<title>" "k1,k2"');
    process.exit(1);
  }
  const keywords = (keywordsCsv || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const theme = `${title} — ${keywords.join(', ')}`;
  const prompt = `${theme}. clean editorial illustration, minimal, high contrast, professional blog cover, no text, no watermark, 16:9`;

  const apiKey = await readEnvKey();
  const taskId = await createTask(apiKey, prompt);
  const imageUrl = await pollForImage(apiKey, taskId);

  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Image download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());

  const outDir = path.join(process.cwd(), 'public', 'blog', slug);
  await fsp.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, 'hero.jpg');
  await fsp.writeFile(outPath, buf);
  console.log('Saved hero image to:', outPath);
  console.log('HERO_URL=/blog/' + slug + '/hero.jpg');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
