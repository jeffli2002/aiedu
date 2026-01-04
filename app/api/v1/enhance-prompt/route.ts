import { env } from '@/env';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface EnhancePromptRequest {
  prompt: string;
  context?: string;
  aspectRatio?: string;
  style?: string;
  brandTone?: string[];
  productFeatures?: string[];
  productSellingPoints?: string[];
  styleKeywords?: string[];
  colorPalette?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: EnhancePromptRequest = await request.json();
    const {
      prompt,
      context = 'image',
      aspectRatio,
      style,
      brandTone = [],
      productFeatures = [],
      productSellingPoints = [],
      styleKeywords = [],
      colorPalette = [],
    } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    const sanitizedPrompt = prompt.trim();
    const generationContext =
      typeof context === 'string' && context.trim().length > 0 ? context.trim() : 'image';

    const deepseekKey = env.DEEPSEEK_API_KEY;

    if (!deepseekKey) {
      return NextResponse.json({ error: 'DeepSeek API key not configured' }, { status: 500 });
    }

    // Build context information for enhancement
    const contextInfo: string[] = [];

    // Add user-selected parameters
    if (aspectRatio) {
      contextInfo.push(`Target aspect ratio: ${aspectRatio}`);
    }

    if (style) {
      contextInfo.push(`Selected style: ${style}`);
    }

    // Add brand context
    if (brandTone.length > 0) {
      contextInfo.push(`Brand tone: ${brandTone.join(', ')}`);
    }

    if (productFeatures.length > 0) {
      contextInfo.push(`Product features: ${productFeatures.join(', ')}`);
    }

    if (productSellingPoints.length > 0) {
      contextInfo.push(`Product selling points: ${productSellingPoints.join(', ')}`);
    }

    if (styleKeywords.length > 0) {
      contextInfo.push(`Style keywords: ${styleKeywords.join(', ')}`);
    }

    if (colorPalette.length > 0) {
      contextInfo.push(`Color palette: ${colorPalette.join(', ')}`);
    }

    const contextString = contextInfo.length > 0 ? `\n\nContext:\n${contextInfo.join('\n')}` : '';

    const buildMessages = (promptText: string, generationContext: string, contextStr: string) => {
      // Image generation system prompt
      const imageSystemPrompt = `You are a creative AI educator and visual designer, specialized in creating inspiring, imaginative images for young learners and creators (ages 10-30) exploring AI and digital creativity.

[Creation Goal]:
Design visually captivating images that spark curiosity, creativity, and inspiration about AI, technology, art, and innovation.

[Visual Style]:
Use dynamic compositions, striking colors, and modern aesthetics. Balance between realistic and imaginative elements. Professional quality that appeals to both younger students and young adults.

[Subject Matter]:
Focus on themes like:
- AI and emerging technology (robots, neural networks, digital worlds)
- Space exploration and cosmic phenomena
- Science, innovation, and discovery
- Digital art and creative expression
- Nature reimagined with creative twists
- Future concepts and speculative design
- Gaming, virtual worlds, and digital culture

[Composition]:
Strong focal points, balanced layouts, engaging perspectives. Include elements that tell a story or invite exploration. Modern, clean aesthetics with artistic flair.

[Style & Details]:
High quality, detailed imagery with cinematic lighting. Contemporary and polished. Suitable for educational content, creative projects, social media, and presentations.

[Exclusions]:
No violence, inappropriate content, or overly dark themes. Keep content positive, inspiring, and suitable for educational contexts.

[Instructions]:
Optimize the prompt for educational and creative content targeting young people. Enhance with imaginative details that inspire curiosity, creativity, and learning. Only return the enhanced prompt text without any additional commentary.`;

      // Video generation system prompt
      const videoSystemPrompt = `You are a creative AI educator and video designer, specialized in producing engaging, inspiring video content for young learners and creators (ages 10-30) exploring AI and digital creativity.

[Video Goal]:
Create visually captivating videos that spark wonder, curiosity, and excitement about AI, creativity, technology, and innovation.

[Video Structure]:
Scene 1 — Dynamic Opening: Hook with striking visuals, smooth camera motion, establishing intrigue and wonder.
Scene 2 — Exploration: Reveal the subject with interesting angles, close-ups, and movement that highlights details and textures.
Scene 3 — Story/Transformation: Add narrative elements, transitions, or journeys that engage and inspire.
Scene 4 — Memorable Conclusion: End with an impactful, inspiring shot that leaves viewers curious and motivated.

[Visual Style]:
Modern aesthetics, dynamic colors, cinematic quality. Mix of realistic and imaginative elements. Professional polish with contemporary appeal for young audiences.

[Themes]:
AI and technology, space and cosmos, science and innovation, digital art, creative expression, future concepts, gaming aesthetics, nature and environment.

[Pacing]:
Smooth yet dynamic motion. Engaging rhythm that maintains interest. Modern editing sensibility.

[Exclusions]:
No violence, inappropriate content, or overly dark material. Keep content positive, inspiring, and suitable for educational contexts.

[Instructions]:
Optimize for educational and creative content targeting young people. Structure with clear scene descriptions and camera movements. Only return the enhanced prompt text without any additional commentary.`;

      return [
        {
          role: 'system',
          content: generationContext === 'video' ? videoSystemPrompt : imageSystemPrompt,
        },
        {
          role: 'user',
          content: `Enhance this prompt for ${generationContext} generation:${contextStr}\n\nPrompt:\n${promptText}\n\nRespond with the enhanced prompt only.`,
        },
      ];
    };

    const fetchWithTimeout = async (input: RequestInfo | URL, init: RequestInit = {}) => {
      const controller = new AbortController();
      const timeout = Number(process.env.AI_ENHANCER_TIMEOUT_MS || 15000);
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(input, {
          ...init,
          signal: controller.signal,
        });
        return response;
      } finally {
        clearTimeout(timeoutId);
      }
    };

    const extractContent = (rawContent: unknown) => {
      if (!rawContent) return null;
      if (typeof rawContent === 'string') {
        return rawContent.trim();
      }

      if (Array.isArray(rawContent)) {
        const combined = rawContent
          .map((part) => {
            if (typeof part === 'string') return part;
            if (typeof part === 'object' && part !== null) {
              if ('text' in part && typeof part.text === 'string') return part.text;
              if ('content' in part && typeof part.content === 'string') return part.content;
            }
            return '';
          })
          .join('\n')
          .trim();
        return combined || null;
      }

      if (typeof rawContent === 'object' && rawContent !== null && 'text' in rawContent) {
        const content = rawContent as { text?: string };
        if (typeof content.text === 'string') {
          return content.text.trim();
        }
      }

      return null;
    };

    try {
      const response = await fetchWithTimeout('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${deepseekKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: buildMessages(sanitizedPrompt, generationContext, contextString),
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('DeepSeek enhance error:', errorData);
        return NextResponse.json(
          { error: 'Failed to enhance prompt' },
          { status: response.status }
        );
      }

      const data = await response.json();
      const enhancedPrompt = extractContent(data.choices?.[0]?.message?.content) || sanitizedPrompt;

      return NextResponse.json({
        enhancedPrompt,
        originalPrompt: sanitizedPrompt,
      });
    } catch (error) {
      console.error('DeepSeek enhance request failed:', error);
      return NextResponse.json(
        { error: 'Prompt enhancement temporarily unavailable. Please try again shortly.' },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
