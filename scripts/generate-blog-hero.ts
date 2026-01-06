import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getKieApiService } from '@/lib/kie/kie-api';

// Usage: pnpm tsx scripts/generate-blog-hero.ts <slug> "<title>" "k1,k2,k3"
async function main() {
  const [slug, title, keywordsCsv] = process.argv.slice(2);
  if (!slug || !title) {
    console.error('Usage: pnpm tsx scripts/generate-blog-hero.ts <slug> "<title>" "k1,k2"');
    process.exit(1);
  }
  const keywords = (keywordsCsv || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const theme = `${title} — ${keywords.join(', ')}`;
  const prompt = `${theme}. clean editorial illustration, minimal, high contrast, professional blog cover, no text, no watermark, 16:9`;

  const service = getKieApiService();
  const task = await service.generateImage(
    { prompt, aspect_ratio: '16:9', resolution: '2K', outputFormat: 'jpeg' },
    'nano-banana-pro'
  );
  const { imageUrl } = await service.pollTaskStatus(task.data.taskId, 'image', 80, 3000);
  if (!imageUrl) throw new Error('No imageUrl returned');

  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());

  const outDir = path.join(process.cwd(), 'public', 'blog', slug);
  await mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, 'hero.jpg');
  await writeFile(outPath, buf);
  console.log('Saved hero image to:', outPath);
  console.log('Set heroImageUrl to:', `/blog/${slug}/hero.jpg`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

