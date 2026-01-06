import { config } from 'dotenv';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Load .env.local explicitly
config({ path: path.join(process.cwd(), '.env.local') });

// Standalone KIE API client for script usage
const KIE_API_KEY = process.env.KIE_API_KEY;
const KIE_BASE_URL = 'https://api.kie.ai/api/v1';

if (!KIE_API_KEY) {
  console.error('KIE_API_KEY is not set in environment');
  process.exit(1);
}

async function createImageTask(prompt: string, aspectRatio: string) {
  const response = await fetch(`${KIE_BASE_URL}/jobs/createTask`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KIE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'nano-banana-pro',
      input: {
        prompt,
        aspect_ratio: aspectRatio,
        resolution: '2K',
      },
    }),
  });

  const data = await response.json();
  if (data.code !== 200) {
    throw new Error(data.msg || 'Failed to create task');
  }
  return data.data.taskId;
}

async function pollTaskStatus(taskId: string, maxAttempts = 80, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(`${KIE_BASE_URL}/jobs/recordInfo?taskId=${taskId}`, {
      headers: { Authorization: `Bearer ${KIE_API_KEY}` },
    });
    const data = await response.json();

    if (data.data?.state === 'success') {
      let imageUrl = data.data?.result?.imageUrl;
      if (!imageUrl && data.data?.resultJson) {
        const parsed = JSON.parse(data.data.resultJson);
        imageUrl = parsed?.resultUrls?.[0];
      }
      return imageUrl;
    }

    if (data.data?.state === 'fail') {
      throw new Error(data.data?.failMsg || 'Task failed');
    }

    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Task polling timeout');
}

// New Yorker editorial style illustrations for homepage
const ILLUSTRATIONS = [
  {
    name: 'hero',
    prompt: `Young diverse teenagers collaborating around a glowing AI interface, creating art and code together.
New Yorker magazine editorial illustration style, clean hand-drawn lines, minimal color palette with coral orange and teal accents on white background.
Sophisticated, whimsical, intellectual aesthetic. No text, no watermark. Simple geometric shapes, subtle hatching, elegant composition.`,
    aspect_ratio: '21:9',
  },
  {
    name: 'project-poster',
    prompt: `A teenager with paintbrush creating a colorful digital poster that comes to life from a computer screen.
New Yorker magazine editorial illustration style, hand-drawn linework, minimal color with coral orange accent.
Clean white background, sophisticated whimsical style, no text, no watermark.`,
    aspect_ratio: '4:3',
  },
  {
    name: 'project-video',
    prompt: `Young creative person directing an animated storyboard with floating video frames and play buttons around them.
New Yorker magazine editorial illustration style, elegant hand-drawn lines, teal and coral accents on cream background.
Sophisticated, minimal, magazine cover aesthetic. No text, no watermark.`,
    aspect_ratio: '4:3',
  },
  {
    name: 'project-app',
    prompt: `A teenager building a small robot or app prototype with coding symbols and gears floating around.
New Yorker magazine editorial illustration style, clean simple linework, coral orange accent color.
Intellectual yet playful, minimal geometric style. No text, no watermark.`,
    aspect_ratio: '4:3',
  },
  {
    name: 'about-vision',
    prompt: `Students looking through a telescope or window into a future city with floating AI symbols.
New Yorker editorial style, hand-drawn elegant lines, warm coral and teal accents.
Sophisticated, hopeful, minimal aesthetic. No text, no watermark.`,
    aspect_ratio: '3:2',
  },
];

async function generateAndSave(illustration: (typeof ILLUSTRATIONS)[0]) {
  console.log(`\nGenerating: ${illustration.name}...`);

  try {
    const taskId = await createImageTask(illustration.prompt, illustration.aspect_ratio);
    console.log(`Task created: ${taskId}`);

    const imageUrl = await pollTaskStatus(taskId);
    if (!imageUrl) throw new Error('No imageUrl returned');

    console.log(`Image generated, downloading...`);

    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());

    const outDir = path.join(process.cwd(), 'public', 'homepage');
    await mkdir(outDir, { recursive: true });
    const outPath = path.join(outDir, `${illustration.name}.jpg`);
    await writeFile(outPath, buf);

    console.log(`Saved: /homepage/${illustration.name}.jpg`);
    return `/homepage/${illustration.name}.jpg`;
  } catch (error) {
    console.error(`Failed to generate ${illustration.name}:`, error);
    return null;
  }
}

async function main() {
  console.log('Generating New Yorker style homepage illustrations...');
  console.log('Style: Editorial, minimal, hand-drawn, coral orange + teal accents\n');

  const results: Record<string, string | null> = {};

  for (const illustration of ILLUSTRATIONS) {
    results[illustration.name] = await generateAndSave(illustration);
  }

  console.log('\n=== Generation Complete ===');
  console.log('Results:');
  Object.entries(results).forEach(([name, path]) => {
    console.log(`  ${name}: ${path || 'FAILED'}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
