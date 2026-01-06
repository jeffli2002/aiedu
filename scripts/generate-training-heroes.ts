import { mkdir, stat, writeFile } from 'fs/promises';
import path from 'path';
import { getKieApiService } from '@/lib/kie/kie-api';
import { TRAINING_SYSTEM } from '@/lib/training-system';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'training', 'heroes');

const STYLE_PROMPT = [
  'Editorial minimal hero image for youth AI education.',
  'Warm coral and teal accents, soft daylight, airy composition.',
  'Subtle grain, clean background, high-end magazine photography.',
  'No text, no watermark, no logos, no UI, 16:9.',
].join(' ');

type ModuleLite = { id: string; title: string; description: string };

const collectModules = (): ModuleLite[] => {
  const en = TRAINING_SYSTEM.en;
  const zh = TRAINING_SYSTEM.zh;
  const modules = new Map<string, ModuleLite>();

  const addModule = (module: ModuleLite) => {
    if (!modules.has(module.id)) {
      modules.set(module.id, module);
    }
  };

  [...en.foundations, ...en.creation, ...en.efficiency, ...en.vibe].forEach(addModule);
  [...zh.foundations, ...zh.creation, ...zh.efficiency, ...zh.vibe].forEach(addModule);

  return [...modules.values()].sort((a, b) => a.id.localeCompare(b.id));
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  const onlyArg = args.find((arg) => arg.startsWith('--only='));
  const onlyIds = onlyArg
    ? new Set(onlyArg.replace('--only=', '').split(',').map((id) => id.trim()).filter(Boolean))
    : null;
  const force = args.includes('--force');

  return { onlyIds, force };
};

const ensureOutputDir = async () => {
  await mkdir(OUTPUT_DIR, { recursive: true });
};

const fileExists = async (filePath: string) => {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
};

const buildPrompt = (module: ModuleLite) => {
  return `${STYLE_PROMPT} Course focus: ${module.title}. ${module.description}`;
};

const main = async () => {
  const { onlyIds, force } = parseArgs();
  const modules = collectModules();
  const filteredModules = onlyIds ? modules.filter((m) => onlyIds.has(m.id)) : modules;

  if (filteredModules.length === 0) {
    console.error('No matching course IDs found.');
    process.exit(1);
  }

  await ensureOutputDir();
  const service = getKieApiService();

  for (const module of filteredModules) {
    const outputPath = path.join(OUTPUT_DIR, `${module.id}.jpg`);
    if (!force && await fileExists(outputPath)) {
      console.log(`Skipping ${module.id}: already exists.`);
      continue;
    }

    const prompt = buildPrompt(module);
    console.log(`Generating hero for ${module.id}...`);

    const task = await service.generateImage(
      { prompt, aspect_ratio: '16:9', resolution: '2K', outputFormat: 'jpeg' },
      'nano-banana-pro'
    );
    const result = await service.pollTaskStatus(task.data.taskId, 'image', 80, 3000);
    if (!result.imageUrl) {
      throw new Error(`No imageUrl returned for ${module.id}`);
    }

    const res = await fetch(result.imageUrl);
    if (!res.ok) {
      throw new Error(`Download failed for ${module.id}: ${res.status}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(outputPath, buf);
    console.log(`Saved ${module.id} -> ${outputPath}`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
