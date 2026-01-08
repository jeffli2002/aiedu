'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { creditsConfig } from '@/config/credits.config';
import { paymentConfig } from '@/config/payment.config';
import { useSubscription } from '@/hooks/use-subscription';
import { useAuthStore } from '@/store/auth-store';
import { formatDistance } from 'date-fns';
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Coins,
  CreditCard,
  History,
  ImageIcon,
  RefreshCw,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Dashboard Page - Editorial Minimal Design
 * Colors: Coral Orange (#ff6b35), Teal (#2ec4b6)
 * Typography: Instrument Serif (headlines), DM Sans (body)
 */

export const dynamic = 'force-dynamic';

interface CreditBalance {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  frozenBalance: number;
  availableBalance: number;
}

interface QuotaUsage {
  storage: {
    used: number;
    limit: number;
    isUnlimited: boolean;
  };
  imageGeneration?: {
    daily: {
      used: number;
      limit: number;
      isUnlimited: boolean;
    };
    monthly: {
      used: number;
      limit: number;
      isUnlimited: boolean;
    };
  };
  videoGeneration?: {
    daily: {
      used: number;
      limit: number;
      isUnlimited: boolean;
    };
    monthly: {
      used: number;
      limit: number;
      isUnlimited: boolean;
    };
  };
  imageExtraction?: {
    daily: {
      used: number;
      limit: number;
      isUnlimited: boolean;
    };
    monthly: {
      used: number;
      limit: number;
      isUnlimited: boolean;
    };
  };
}

interface CreditTransaction {
  id: string;
  type: 'earn' | 'spend' | 'refund' | 'admin_adjust' | 'freeze' | 'unfreeze';
  amount: number;
  source: 'subscription' | 'api_call' | 'admin' | 'storage' | 'bonus';
  description?: string;
  balanceAfter: number;
  createdAt: Date;
}

const formatDateDisplay = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

function DashboardPageContent() {
  const t = useTranslations('dashboard');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tg = (key: string, options?: Record<string, unknown>) => t(key as any, options as any);

  const {
    isAuthenticated,
    user,
    isInitialized: authInitialized,
    isLoading: authLoading,
  } = useAuthStore();
  const router = useRouter();
  const [creditBalance, setCreditBalance] = useState<CreditBalance | null>(null);
  const [, setQuotaUsage] = useState<QuotaUsage | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshAttempts, setAutoRefreshAttempts] = useState(0);
  const { planId, loading: subLoading, upcomingPlan } = useSubscription();

  const scheduledPlanDetails = useMemo(() => {
    if (!upcomingPlan || !upcomingPlan.planId || !upcomingPlan.interval) {
      return null;
    }
    const plan = paymentConfig.plans.find((p) => p.id === upcomingPlan.planId);
    if (!plan) {
      return null;
    }
    const price =
      upcomingPlan.interval === 'year' ? (plan.yearlyPrice ?? null) : (plan.price ?? null);
    const credits =
      upcomingPlan.interval === 'year'
        ? (plan.credits.monthly ?? 0) * 12
        : (plan.credits.monthly ?? 0);
    return {
      planName: plan.name,
      interval: upcomingPlan.interval,
      price,
      credits,
      takesEffectAt: upcomingPlan.takesEffectAt || null,
    };
  }, [upcomingPlan]);

  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch credit balance
      const balanceResponse = await fetch('/api/credits/balance', {
        credentials: 'include',
        cache: 'no-store',
      });
      if (balanceResponse.ok) {
        const balanceData = await balanceResponse.json();
        if (balanceData.success && balanceData.data) {
          setCreditBalance(balanceData.data);
        }
      }

      // Fetch quota usage
      const quotaResponse = await fetch('/api/credits/quota', {
        credentials: 'include',
        cache: 'no-store',
      });
      if (quotaResponse.ok) {
        const quotaData = await quotaResponse.json();
        if (quotaData.success && quotaData.data) {
          setQuotaUsage(quotaData.data);
        }
      }

      // Fetch credit history
      const historyResponse = await fetch('/api/credits/history?limit=10', {
        credentials: 'include',
        cache: 'no-store',
      });
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        if (historyData.success && historyData.data) {
          setTransactions(historyData.data);
        }
      }

      // Subscription info is provided by useSubscription hook
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authInitialized) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }

    fetchDashboardData();
  }, [authInitialized, isAuthenticated, router, fetchDashboardData]);

  useEffect(() => {
    if (
      planId === 'free' ||
      !creditBalance ||
      creditBalance.totalEarned > 0 ||
      autoRefreshAttempts >= 3
    ) {
      return;
    }

    const timer = setTimeout(() => {
      setAutoRefreshAttempts((prev) => prev + 1);
      void fetchDashboardData();
    }, 2500);

    return () => clearTimeout(timer);
  }, [planId, creditBalance, autoRefreshAttempts, fetchDashboardData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earn':
        return <ArrowUpRight className="h-4 w-4" style={{ color: '#2ec4b6' }} />;
      case 'spend':
        return <ArrowDownRight className="h-4 w-4" style={{ color: '#ff6b35' }} />;
      case 'refund':
        return <ArrowUpRight className="h-4 w-4" style={{ color: '#2ec4b6' }} />;
      default:
        return <RefreshCw className="h-4 w-4" style={{ color: '#999' }} />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earn':
        return 'text-[#2ec4b6]';
      case 'spend':
        return 'text-[#ff6b35]';
      case 'refund':
        return 'text-[#2ec4b6]';
      default:
        return 'text-[#666]';
    }
  };

  // These functions are defined but not currently used
  // const shouldShowQuota = (quota?: { used: number; limit: number; isUnlimited: boolean }) => {
  //   if (!quota) return false;
  //   if (quota.isUnlimited) return true;
  //   const limit = quota.limit ?? 0;
  //   const used = quota.used ?? 0;
  //   return limit > 0 || used > 0;
  // };

  // const calculateUsagePercent = (quota?: { used: number; limit: number }) => {
  //   if (!quota || !quota.limit || quota.limit <= 0) return 0;
  //   return Math.min(100, ((quota.used || 0) / quota.limit) * 100);
  // };

  const imageCredits = creditsConfig.consumption.imageGeneration['nano-banana'];
  const videoCredits = creditsConfig.consumption.videoGeneration['sora-2-720p-15s'];

  if (authLoading || isLoading || subLoading) {
    return (
      <div
        className="container mx-auto py-8"
        style={{ backgroundColor: '#fafaf9', fontFamily: '"DM Sans", system-ui, sans-serif' }}
      >
        <div className="flex items-center justify-center py-12">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2"
            style={{ borderColor: '#ff6b35', borderTopColor: 'transparent' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto max-w-7xl space-y-6 py-12 px-4 relative"
      style={{ backgroundColor: '#fafaf9', fontFamily: '"DM Sans", system-ui, sans-serif' }}
    >
      {/* Decorative elements */}
      <div
        className="absolute top-10 right-[5%] w-32 h-32 rounded-full opacity-10 animate-float pointer-events-none"
        style={{ backgroundColor: '#ff6b35' }}
      />
      <div
        className="absolute bottom-20 left-[3%] w-24 h-24 rounded-full opacity-10 animate-float pointer-events-none"
        style={{ backgroundColor: '#2ec4b6', animationDelay: '2s' }}
      />

      <div className="flex items-center justify-between relative z-10">
        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: '#ff6b35' }} />
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#1a1a2e' }}>
              {tg('dashboardTag')}
            </span>
          </div>
          <h1
            className="text-3xl mb-2"
            style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
          >
            {tg('title')}
          </h1>
          <p style={{ color: '#666' }}>
            {tg('welcome')}, {user?.name || user?.email}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="rounded-xl btn-outline-coral"
        >
          <RefreshCw className={`mr-2 h-4 w-4 text-primary ${isRefreshing ? 'animate-spin' : ''}`} />
          {tg('refresh')}
        </Button>
      </div>

      {scheduledPlanDetails && (
        <Alert
          className="rounded-[1.5rem] border shadow-sm relative z-10"
          style={{ backgroundColor: 'rgba(46, 196, 182, 0.1)', borderColor: 'rgba(46, 196, 182, 0.3)' }}
        >
          <AlertTitle className="flex items-center gap-2 text-lg font-bold" style={{ color: '#1a1a2e' }}>
            <TrendingUp className="h-5 w-5" style={{ color: '#2ec4b6' }} />
            {tg('planUpgradeScheduled', { planName: scheduledPlanDetails.planName })}
          </AlertTitle>
          <AlertDescription className="mt-2 text-base" style={{ color: '#4a4a4a' }}>
            <p className="font-semibold mb-2">
              {tg('upgradeScheduledDesc', { planName: scheduledPlanDetails.planName })}
            </p>
            <p className="mb-3">
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-lg"
                style={{ backgroundColor: 'rgba(46, 196, 182, 0.2)', color: '#1a1a2e' }}
              >
                <Calendar className="h-4 w-4" />
                {formatDateDisplay(scheduledPlanDetails.takesEffectAt)}
              </span>
            </p>
            <div className="space-y-1 text-sm">
              <p>
                {tg('billingCycle')}
                <span className="font-medium">
                  {scheduledPlanDetails.interval === 'year' ? tg('yearly') : tg('monthly')}
                </span>
              </p>
              <p>
                {tg('price')}
                <span className="font-medium">
                  {scheduledPlanDetails.price
                    ? `$${scheduledPlanDetails.price.toFixed(2)}`
                    : tg('standardRate')}
                </span>
              </p>
              <p>
                {tg('creditsPerCycle')}
                <span className="font-medium">{scheduledPlanDetails.credits}</span>
              </p>
            </div>
            <p className="mt-3 pt-3 text-sm" style={{ borderTopColor: 'rgba(46, 196, 182, 0.3)', borderTopWidth: '1px' }}>
              {tg('currentPlanRemains', {
                planName: planId === 'proplus' ? 'Pro+' : planId === 'pro' ? 'Pro' : 'Free',
              })}
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Credit Balance Cards + Subscription */}
      <div className="grid gap-4 md:grid-cols-4 relative z-10">
        <Card className="rounded-[1.5rem] border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="font-medium text-sm" style={{ color: '#1a1a2e' }}>{tg('subscriptionPlan')}</CardTitle>
              <CardDescription className="text-xs" style={{ color: '#999' }}>
                {planId === 'free' ? tg('free') : tg('paid')}
              </CardDescription>
            </div>
            <div className="rounded-xl p-2" style={{ backgroundColor: 'rgba(255, 107, 53, 0.1)' }}>
              <CreditCard className="h-4 w-4" style={{ color: '#ff6b35' }} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <p
                className="text-2xl font-bold capitalize"
                style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
              >
                {planId === 'proplus' ? 'Pro Plus' : planId === 'pro' ? 'Pro' : 'Free'}
              </p>
              <Badge
                className="rounded-lg"
                style={{
                  backgroundColor: planId === 'free' ? 'rgba(102, 102, 102, 0.1)' : 'rgba(46, 196, 182, 0.1)',
                  color: planId === 'free' ? '#666' : '#2ec4b6'
                }}
              >
                {planId === 'free' ? tg('free') : tg('paid')}
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button
                variant="ghost"
                className="w-full whitespace-normal text-center rounded-xl hover:bg-slate-50 text-muted"
                asChild
              >
                <Link href="/settings/billing">{tg('manageSubscription')}</Link>
              </Button>
              <Button
                className="w-full rounded-xl font-semibold transition-all btn-teal"
                asChild
              >
                <Link href="/pricing">{tg('upgradeNow')}</Link>
              </Button>
              <Button
                className="w-full rounded-xl sm:col-span-2 font-semibold transition-all btn-teal-light"
                asChild
              >
                <Link href="/pricing#credit-packs">{tg('buyCredits')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem] border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm" style={{ color: '#1a1a2e' }}>{tg('availableCredits')}</CardTitle>
            <Coins className="h-4 w-4" style={{ color: '#ff6b35' }} />
          </CardHeader>
          <CardContent>
            <div
              className="font-bold text-2xl"
              style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
            >
              {creditBalance?.availableBalance ?? 0}
            </div>
            <p className="text-xs" style={{ color: '#999' }}>
              {tg('creditsEstimate', {
                images: Math.floor((creditBalance?.availableBalance ?? 0) / imageCredits),
                videos: Math.floor((creditBalance?.availableBalance ?? 0) / videoCredits),
              })}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem] border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm" style={{ color: '#1a1a2e' }}>{tg('totalEarned')}</CardTitle>
            <TrendingUp className="h-4 w-4" style={{ color: '#2ec4b6' }} />
          </CardHeader>
          <CardContent>
            <div
              className="font-bold text-2xl"
              style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
            >
              {creditBalance?.totalEarned ?? 0}
            </div>
            <p className="text-xs" style={{ color: '#999' }}>{tg('cumulativeEarned')}</p>
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem] border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm" style={{ color: '#1a1a2e' }}>{tg('totalSpent')}</CardTitle>
            <TrendingDown className="h-4 w-4" style={{ color: '#ff6b35' }} />
          </CardHeader>
          <CardContent>
            <div
              className="font-bold text-2xl"
              style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
            >
              {creditBalance?.totalSpent ?? 0}
            </div>
            <p className="text-xs" style={{ color: '#999' }}>{tg('cumulativeSpent')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Credit Transaction History */}
      <Card className="rounded-[1.5rem] border-slate-100 bg-white shadow-sm relative z-10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2" style={{ color: '#1a1a2e' }}>
              <Calendar className="h-5 w-5" style={{ color: '#ff6b35' }} />
              {tg('transactionHistory')}
            </CardTitle>
            <CardDescription style={{ color: '#999' }}>{tg('recentActivityDesc')}</CardDescription>
          </div>
          <Link href="/credits/history">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl btn-outline-coral"
            >
              {tg('viewAll')}
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="py-8 text-center" style={{ color: '#999' }}>
              <History className="mx-auto mb-2 h-8 w-8" />
              <p>{tg('noTransactions')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition-all hover:border-slate-200 hover:shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-medium text-sm" style={{ color: '#1a1a2e' }}>
                        {transaction.description || `${transaction.type} - ${transaction.source}`}
                      </p>
                      <p className="text-xs" style={{ color: '#999' }}>
                        {formatDistance(new Date(transaction.createdAt), new Date(), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'spend' ? '-' : '+'}
                      {transaction.amount}
                    </p>
                    <p className="text-xs" style={{ color: '#999' }}>
                      {tg('balance', { balance: transaction.balanceAfter })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 relative z-10">
        <Card className="p-6 rounded-[1.5rem] border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm mb-1" style={{ color: '#999' }}>{tg('quickActions')}</p>
              <p
                className="text-lg font-semibold"
                style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
              >
                {tg('generateImage')}
              </p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255, 107, 53, 0.1)' }}>
              <ImageIcon className="h-6 w-6" style={{ color: '#ff6b35' }} />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/image-generation">
              <Button
                className="w-full rounded-xl font-semibold transition-all active:scale-[0.98] btn-coral"
                size="sm"
              >
                {tg('generateImage')}
              </Button>
            </Link>
            <Link href="/video-generation">
              <Button
                variant="outline"
                className="w-full rounded-xl transition-colors btn-outline-teal"
                size="sm"
              >
                {tg('generateVideo')}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div
          className="container mx-auto py-8"
          style={{ backgroundColor: '#fafaf9', fontFamily: '"DM Sans", system-ui, sans-serif' }}
        >
          <div className="flex items-center justify-center py-12">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2"
              style={{ borderColor: '#ff6b35', borderTopColor: 'transparent' }}
            />
          </div>
        </div>
      }
    >
      <DashboardPageContent />
    </Suspense>
  );
}

