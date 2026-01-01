import { creemService } from '@/lib/creem/creem-service';

export interface CreateSubscriptionParams {
  userId: string;
  priceId: string;
  trialPeriodDays?: number;
  metadata?: Record<string, string>;
}

export interface UpdateSubscriptionParams {
  priceId?: string;
  cancelAtPeriodEnd?: boolean;
  metadata?: Record<string, string>;
}

export class CreemProvider {
  /**
   * Create a new subscription
   */
  async createSubscription(params: CreateSubscriptionParams) {
    const { userId, priceId, trialPeriodDays, metadata } = params;

    // Use creemService to create subscription via checkout
    // For direct subscription creation, we'll use the checkout flow
    const result = await creemService.createCheckoutSessionWithProductKey({
      userId,
      userEmail: metadata?.email || '',
      productKey: priceId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/settings/billing?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/settings/billing?canceled=true`,
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to create subscription',
      };
    }

    return {
      success: true,
      checkoutUrl: result.url,
      sessionId: result.sessionId,
    };
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string) {
    const result = await creemService.getSubscription(subscriptionId);
    return result.subscription || null;
  }

  /**
   * Update subscription
   */
  async updateSubscription(subscriptionId: string, params: UpdateSubscriptionParams) {
    const { cancelAtPeriodEnd, metadata } = params;

    if (typeof cancelAtPeriodEnd === 'boolean') {
      const result = await creemService.setCancelAtPeriodEnd(subscriptionId, cancelAtPeriodEnd);
      return {
        success: result.success,
        subscription: result.subscription,
        error: result.error,
      };
    }

    // For other updates, you may need to implement additional methods in creemService
    return {
      success: false,
      error: 'Update not supported',
    };
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string) {
    const result = await creemService.cancelSubscription(subscriptionId);
    return result.success;
  }
}


