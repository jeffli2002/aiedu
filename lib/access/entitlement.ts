import { env } from '@/env';
import { paymentRepository } from '@/server/db/repositories/payment-repository';

function parseAdminEmails(): Set<string> {
  const raw = env.ADMIN_EMAILS || '';
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  );
}

/**
 * Returns true if user is entitled to full premium content.
 * Criteria:
 * - Admin email OR
 * - Has an active/trialing/past_due subscription (provider: stripe/creem)
 */
export async function isEntitledForPremium(userId: string, userEmail?: string | null): Promise<boolean> {
  try {
    const admins = parseAdminEmails();
    if (userEmail && admins.has(userEmail.toLowerCase())) {
      return true;
    }

    const active = await paymentRepository.findActiveSubscriptionByUserId(userId);
    return Boolean(active);
  } catch {
    // On error, fall back to not entitled
    return false;
  }
}

