export type PaymentType = 'subscription' | 'one_time';
export type PaymentInterval = 'month' | 'year' | null;
export type PaymentStatus =
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'unpaid'
  | 'trialing'
  | 'paused'
  | 'incomplete'
  | 'incomplete_expired';

export interface PaymentRecord {
  id: string;
  priceId: string;
  productId?: string;
  type: PaymentType;
  interval?: PaymentInterval;
  userId: string;
  customerId: string;
  subscriptionId?: string;
  status: PaymentStatus;
  periodStart?: Date;
  periodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  trialStart?: Date;
  trialEnd?: Date;
  affiliateId?: string;
  affiliateCode?: string;
  scheduledPlanId?: string;
  scheduledInterval?: PaymentInterval;
  scheduledPeriodStart?: Date;
  scheduledPeriodEnd?: Date;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  provider?: 'stripe' | 'creem';
}

