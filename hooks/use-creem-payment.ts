'use client';

import { env } from '@/env';
import { withLocalePath } from '@/i18n/locale-utils';
import { useState } from 'react';

type PlanId = 'pro' | 'proplus';
type BillingInterval = 'month' | 'year';

interface CheckoutParams {
  planId?: PlanId;
  interval?: BillingInterval;
  productKey?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export function useCreemPayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolveBaseLang = () => {
    if (typeof window === 'undefined') {
      return 'zh';
    }

    const [firstSegment] = window.location.pathname.split('/').filter(Boolean);
    return firstSegment === 'en' || firstSegment === 'zh' ? firstSegment : 'zh';
  };

  const buildDefaultSuccessUrl = (origin: string) => {
    const lang = resolveBaseLang();
    return `${origin}${withLocalePath('/dashboard', lang)}?success=true`;
  };

  const buildDefaultCancelUrl = (origin: string) => {
    const lang = resolveBaseLang();
    return `${origin}${withLocalePath('/settings/billing', lang)}?canceled=true`;
  };

  const createCheckoutSession = async ({
    planId,
    interval = 'month',
    productKey,
    successUrl,
    cancelUrl,
  }: CheckoutParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const fallbackOrigin =
        typeof window !== 'undefined' ? window.location.origin : env.NEXT_PUBLIC_APP_URL;
      const resolvedSuccessUrl = successUrl || buildDefaultSuccessUrl(fallbackOrigin);
      const resolvedCancelUrl = cancelUrl || buildDefaultCancelUrl(fallbackOrigin);
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          planId,
          interval,
          productKey,
          successUrl: resolvedSuccessUrl,
          cancelUrl: resolvedCancelUrl,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (typeof window !== 'undefined' && data.url) {
        window.location.href = data.url as string;
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create checkout session';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const openCustomerPortal = async (returnUrl?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/creem/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(
          returnUrl
            ? { returnUrl }
            : typeof window !== 'undefined'
              ? { returnUrl: `${window.location.origin}/settings/billing` }
              : {}
        ),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Failed to open customer portal');
      }

      if (typeof window !== 'undefined') {
        window.location.href = data.url as string;
      }

      return data.url as string;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to open customer portal';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCheckoutSession,
    openCustomerPortal,
    isLoading,
    error,
  };
}
