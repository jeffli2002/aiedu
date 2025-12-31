/**
 * Payment status types
 * Based on Stripe/Creem subscription statuses
 */
export type PaymentStatus =
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'paused';

/**
 * Payment type (subscription or one-time)
 */
export type PaymentType = 'subscription' | 'one_time';

/**
 * Payment interval for subscriptions
 */
export type PaymentInterval = 'month' | 'year';

/**
 * Payment record interface
 */
export interface PaymentRecord {
  id: string;
  provider: 'stripe' | 'creem';
  priceId: string;
  productId?: string | null;
  type: PaymentType;
  interval?: PaymentInterval | null;
  userId: string;
  customerId: string;
  subscriptionId?: string | null;
  status: PaymentStatus;
  periodStart?: Date | null;
  periodEnd?: Date | null;
  cancelAtPeriodEnd?: boolean | null;
  trialStart?: Date | null;
  trialEnd?: Date | null;
  scheduledPlanId?: string | null;
  scheduledInterval?: PaymentInterval | null;
  scheduledPeriodStart?: Date | null;
  scheduledPeriodEnd?: Date | null;
  scheduledAt?: Date | null;
  affiliateId?: string | null;
  affiliateCode?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

