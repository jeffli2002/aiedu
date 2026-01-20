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

  // Enterprise-grade prompt template for blog hero images
  const prompt = `${theme}. industrial line-based vector illustration, enterprise AI and automation hero image, wide horizontal composition for website hero section, clean outline illustration style, consistent line weight, flat vector design, precise geometric shapes, structured and modular layout, infographic-style visual language, white background with subtle structural lines, clear visual hierarchy, center-focused hero composition with generous negative space, aspect ratio 16:9, wide layout suitable for website hero image, limited enterprise color palette: deep navy blue and dark blue as primary colors, accent orange for highlights and key actions, flat colors only, no gradients, no shadows, professional, trustworthy, enterprise-grade tone, modern Industry 4.0 aesthetic, SVG-style, scalable vector illustration, no text, no watermark`;

  const service = getKieApiService();
  // Don't specify preferredModel - let the service use the model priority list
  // This will try: env.KIE_IMAGE_T2I_MODEL, 'google/nano-banana', 'nano-banana-pro'
  const task = await service.generateImage({
    prompt,
    imageSize: '16:9',  // For google/nano-banana model
    aspect_ratio: '16:9',  // For nano-banana-pro model
    resolution: '2K',
    outputFormat: 'jpeg',
  });
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

