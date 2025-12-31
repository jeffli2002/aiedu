import { env } from '@/env';

/**
 * Check if Creem payment is configured
 * Temporarily disabled - returns false to skip Creem integration
 */
export const isCreemConfigured = false; // Temporarily disabled

// Original implementation (commented out):
// export const isCreemConfigured = Boolean(
//   env.CREEM_API_KEY && env.CREEM_API_KEY.trim().length > 0
// );

