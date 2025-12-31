/**
 * E-commerce Image and Video Style Configurations
 * Based on PRD requirements for diverse e-commerce content generation
 */

export interface StyleConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  promptEnhancement?: string; // Additional prompt text to enhance the style
}

// Image Styles for E-commerce
export const IMAGE_STYLES: StyleConfig[] = [
  {
    id: 'modern-manga',
    name: 'modern-manga',
    displayName: '现代漫画',
    description: '现代漫画风格，清晰线条与动态构图，鲜明色彩',
    promptEnhancement:
      'modern manga style, clean line art, dynamic composition, bold shading, vibrant color palette, expressive character, comic panel aesthetics',
  },
  {
    id: 'ghibli',
    name: 'ghibli',
    displayName: '吉卜力风格',
    description: '温暖、细腻的动画质感，柔和光影与自然氛围',
    promptEnhancement:
      'ghibli-inspired, warm and whimsical, painterly textures, soft lighting, natural scenery, gentle color grading, cinematic atmosphere',
  },
  {
    id: 'cyberpunk',
    name: 'cyberpunk',
    displayName: '赛博朋克风格',
    description: '霓虹高反差，未来科技感，城市夜景氛围',
    promptEnhancement:
      'cyberpunk aesthetic, neon glow, high contrast, futuristic technology, dense city at night, rain reflections, holographic UI elements',
  },
  {
    id: 'chinese-classical',
    name: 'chinese-classical',
    displayName: '中国古风',
    description: '东方美学，水墨韵味与古典配色，雅致留白',
    promptEnhancement:
      'traditional Chinese classical style, ink wash aesthetics, elegant color palette, poetic minimalism, brush texture, cultural motifs',
  },
  {
    id: 'realism',
    name: 'realism',
    displayName: '写实艺术',
    description: '高细节、高真实度，光影准确，逼真质感',
    promptEnhancement:
      'photorealistic art, highly detailed textures, accurate lighting and shadows, realistic materials, cinematic realism, high resolution',
  },
  {
    id: 'hand-drawn',
    name: 'hand-drawn',
    displayName: '手绘插画风格',
    description: '手绘笔触，插画风格，独特个性与艺术质感',
    promptEnhancement:
      'hand-drawn illustration, artistic brush strokes, textured paper feel, charming imperfections, illustrative style, unique character',
  },
];

// Video Styles for E-commerce
export const VIDEO_STYLES: StyleConfig[] = [
  {
    id: 'spoken-script',
    name: 'spoken-script',
    displayName: '口播文案型',
    description: '口播讲解产品，动态文字和产品镜头',
    promptEnhancement: 'spoken script style, voiceover narration, dynamic text overlay, product close-ups, engaging presentation, clear audio',
  },
  {
    id: 'product-comparison',
    name: 'product-comparison',
    displayName: '产品对比型',
    description: '产品对比展示，前后对比或竞品对比',
    promptEnhancement: 'product comparison style, side-by-side comparison, before and after, competitive analysis, clear visual contrast',
  },
  {
    id: 'narrative-comedy',
    name: 'narrative-comedy',
    displayName: '叙事/喜剧型',
    description: '故事化呈现，幽默有趣',
    promptEnhancement: 'narrative storytelling, comedic elements, engaging storyline, character-driven, entertaining and memorable',
  },
  {
    id: '360-showcase',
    name: '360-showcase',
    displayName: '360度展示',
    description: '产品360度旋转展示，全方位展示',
    promptEnhancement: '360-degree product rotation, smooth spin, professional studio lighting, clean background, seamless loop, all angles visible',
  },
  {
    id: 'product-demo',
    name: 'product-demo',
    displayName: '产品演示',
    description: '展示产品功能和使用场景',
    promptEnhancement: 'product demonstration, feature highlights, usage scenarios, close-up shots, smooth transitions, clear presentation',
  },
];

/**
 * Get style by ID
 */
export function getImageStyle(styleId: string): StyleConfig | undefined {
  return IMAGE_STYLES.find((style) => style.id === styleId);
}

export function getVideoStyle(styleId: string): StyleConfig | undefined {
  return VIDEO_STYLES.find((style) => style.id === styleId);
}

/**
 * Get default style
 */
export function getDefaultImageStyle(): StyleConfig {
  return IMAGE_STYLES.find((s) => s.id === 'realism') || IMAGE_STYLES[0];
}

export function getDefaultVideoStyle(): StyleConfig {
  return VIDEO_STYLES[0]; // Spoken Script
}



