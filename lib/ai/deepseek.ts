import { env } from '@/env';

export class DeepSeekService {
  private apiKey: string;

  constructor() {
    this.apiKey = env.DEEPSEEK_API_KEY || '';
  }

  /**
   * Enhance a prompt for image or video generation
   */
  async enhancePrompt(
    prompt: string,
    generationType: 'image' | 'video' = 'image',
    context?: {
      productSellingPoints?: string[];
      styleKeywords?: string[];
      colorPalette?: string[];
      brandTone?: string[];
    }
  ): Promise<string> {
    try {
      const contextInfo: string[] = [];

      if (context?.brandTone && context.brandTone.length > 0) {
        contextInfo.push(`Brand tone: ${context.brandTone.join(', ')}`);
      }

      if (context?.productSellingPoints && context.productSellingPoints.length > 0) {
        contextInfo.push(`Product selling points: ${context.productSellingPoints.join(', ')}`);
      }

      if (context?.styleKeywords && context.styleKeywords.length > 0) {
        contextInfo.push(`Style keywords: ${context.styleKeywords.join(', ')}`);
      }

      if (context?.colorPalette && context.colorPalette.length > 0) {
        contextInfo.push(`Color palette: ${context.colorPalette.join(', ')}`);
      }

      const contextString = contextInfo.length > 0 ? `\n\nContext:\n${contextInfo.join('\n')}` : '';

      const systemPrompt =
        generationType === 'image'
          ? 'You are an expert AI prompt engineer for creative educational content. Enhance prompts with vivid artistic direction, imaginative elements, and inspiring visuals for young learners and creators (ages 10-30) exploring AI creativity. Focus on wonder, innovation, and artistic expression. Only return the enhanced prompt text.'
          : 'You are an expert AI prompt engineer for educational video content. Enhance prompts with engaging motion, storytelling elements, and visually captivating sequences for young people exploring AI and digital creativity. Only return the enhanced prompt text.';

      if (!this.apiKey) {
        // In local/dev without key, return original prompt
        return prompt.trim();
      }
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: `Enhance this ${generationType} generation prompt:${contextString}\n\nPrompt: ${prompt.trim()}\n\nRespond with the enhanced prompt only.`,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('DeepSeek enhance error:', errorData);
        throw new Error('Failed to enhance prompt');
      }

      const data = await response.json();
      const enhancedPrompt = data.choices?.[0]?.message?.content?.trim() || prompt.trim();

      // Extract content if wrapped in markdown code blocks
      const codeBlockMatch = enhancedPrompt.match(/```[\w]*\n?([\s\S]*?)\n?```/);
      if (codeBlockMatch) {
        return codeBlockMatch[1].trim();
      }

      return enhancedPrompt;
    } catch (error) {
      console.error('DeepSeek enhance request failed:', error);
      throw error;
    }
  }
}

export const deepSeekService = new DeepSeekService();
