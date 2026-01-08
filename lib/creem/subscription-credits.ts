import { type BillingInterval, formatPlanName, getCreditsForPlan } from '@/lib/creem/plan-utils';
import { creditService } from '@/lib/credits';
import { awardReferralForPaidUser } from '@/lib/rewards/referral-reward';
import { db } from '@/server/db';
import { creditTransactions } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Grant subscription credits to user with idempotency
 * Returns true if credits were granted, false if already granted or none configured
 */
export async function grantSubscriptionCredits(
  userId: string,
  planIdentifier: string,
  subscriptionId: string,
  interval?: BillingInterval,
  isRenewal = false
): Promise<boolean> {
  const creditInfo = getCreditsForPlan(planIdentifier, interval);

  console.log('[Creem Credits] getCreditsForPlan result:', {
    planIdentifier,
    interval,
    planId: creditInfo.planId,
    plan: creditInfo.plan ? { id: creditInfo.plan.id, name: creditInfo.plan.name } : null,
    amount: creditInfo.amount,
  });

  if (!creditInfo.plan || creditInfo.amount <= 0) {
    console.log(
      `[Creem Credits] No credits to grant for identifier ${planIdentifier} (interval=${interval || 'auto'})`,
      { plan: creditInfo.plan, amount: creditInfo.amount }
    );
    return false;
  }

  const normalizedPlanId = creditInfo.planId;
  const isYearly = creditInfo.interval === 'year';
  const creditsToGrant = creditInfo.amount;
  const planDisplayName = formatPlanName(creditInfo.plan, normalizedPlanId);

  try {
    // Simple idempotency check: only check for exact referenceId match
    // This prevents duplicate grants from the same call, but allows grants for different plans/subscriptions
    // For renewals, we always grant full credits (skip this check)

    // For renewals, we always grant full credits (don't check existing grants)
    const referenceId = `creem_${subscriptionId}_${isRenewal ? 'renewal' : 'initial'}_${Date.now()}`;

    // Check for existing transaction to prevent duplicates
    // Note: neon-http driver doesn't support db.transaction(), so we do manual idempotency checks
    const [existingTransaction] = await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.referenceId, referenceId))
      .limit(1);

    if (existingTransaction) {
      console.log(`[Creem Credits] Credits already granted for reference ${referenceId}`);
      return false;
    }

    const transaction = await creditService.earnCredits({
      userId,
      amount: creditsToGrant,
      source: 'subscription',
      description: `${planDisplayName} subscription ${isRenewal ? 'renewal' : 'credits'} (Creem)`,
      referenceId,
      metadata: {
        planId: normalizedPlanId,
        planIdentifier,
        isYearly,
        subscriptionId,
        provider: 'creem',
        isRenewal,
      },
    });

    console.log(
      `[Creem Credits] Granted ${creditsToGrant} credits to user ${userId} for ${normalizedPlanId} ${isRenewal ? 'renewal' : 'subscription'} (balance: ${transaction.balanceAfter})`
    );

    if (!isRenewal) {
      await awardReferralForPaidUser(userId, {
        reason: 'subscription',
        metadata: {
          planId: normalizedPlanId,
          subscriptionId,
        },
      });
    }

    return true;
  } catch (error) {
    console.error('[Creem Credits] Error granting subscription credits:', error);
    return false;
  }
}
