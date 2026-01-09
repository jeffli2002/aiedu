import { env } from '@/env';

/**
 * Check if Creem is configured
 */
export const isCreemConfigured: boolean = (() => {
  const apiKey = env.CREEM_API_KEY || process.env.CREEM_API_KEY;
  return Boolean(apiKey && apiKey.trim().length > 0);
})();

