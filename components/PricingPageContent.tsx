'use client';

import { useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BadgePercent,
  BookOpen,
  Check,
  Coins,
  Crown,
  Sparkles,
  Ticket
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { paymentConfig } from '@/config/payment.config';
import { useCreemPayment } from '@/hooks/use-creem-payment';
import { useSubscription } from '@/hooks/use-subscription';
import { useAuthStore } from '@/store/auth-store';
import {
  calculateGenerationCapacity,
  formatCapacityRange,
  getYearlySavings
} from '@/lib/utils/pricing-calculator';
import { withLocalePath } from '@/i18n/locale-utils';
import { toast } from 'sonner';

const COPY = {
  en: {
    heroTag: 'Training Access + Credits',
    heroTitle: 'Unlock full lessons, keep your credits flexible.',
    heroSubtitle:
      'Subscribers get unrestricted access to every training video and PDF. Free users can read all PDFs online and preview the first 20% of every video.',
    accessTitle: 'Access Rules',
    accessFreePdf: 'Free users: full PDF library (online-only)',
    accessFreeVideo: 'Free users: 20% video preview',
    accessSubscriber: 'Subscribers: full videos + PDFs',
    accessNote: 'All content is online-only to protect creators.',
    subscribeTitle: 'Subscription',
    subscribeSubtitle: 'Unlimited training + monthly credits for AI creation.',
    monthly: 'Monthly',
    yearly: 'Yearly',
    perMonth: '/mo',
    perYear: '/yr',
    save: 'Save {percentage}%',
    mostPopular: 'Most popular',
    currentPlan: 'Current plan',
    startFree: 'Start free',
    upgradeTo: 'Upgrade to {plan}',
    signInToPurchase: 'Sign in to purchase',
    creditsPerMonth: '{credits} credits / month',
    creditsPerYear: '{credits} credits / year',
    signupBonus: '{credits} credits sign-up bonus',
    capacityHint: '{range} for AI generations',
    packsTitle: 'One-time credit packs',
    packsSubtitle: 'Top up credits without a subscription. Credits never expire.',
    packCta: 'Buy pack',
    packUnavailable: 'Unavailable',
    packNote: 'No subscription required',
    featurePdf: 'Full PDF lesson library (online-only)',
    featureVideoPreview: 'Video previews (first 20%)',
    featureUnlimited: 'Unlimited training videos + PDFs',
    featureEverythingFree: 'Everything in Free plan',
    featureEverythingPro: 'Everything in Pro',
    checkoutError: 'Checkout failed. Please try again.',
  },
  zh: {
    heroTag: '订阅解锁 + 积分灵活',
    heroTitle: '解锁完整课程，同时灵活使用积分。',
    heroSubtitle:
      '订阅用户可无限制观看所有课程视频并阅读PDF。免费用户可在线阅读全部PDF，视频可试听前20%。',
    accessTitle: '访问规则',
    accessFreePdf: '免费用户：PDF 全库在线阅读',
    accessFreeVideo: '免费用户：视频可试听 20%',
    accessSubscriber: '订阅用户：完整视频 + PDF',
    accessNote: '所有内容仅支持在线阅读/观看以保护版权。',
    subscribeTitle: '订阅会员',
    subscribeSubtitle: '全量课程 + 每月积分用于 AI 创作。',
    monthly: '月付',
    yearly: '年付',
    perMonth: '/月',
    perYear: '/年',
    save: '省 {percentage}%',
    mostPopular: '最受欢迎',
    currentPlan: '当前方案',
    startFree: '免费开始',
    upgradeTo: '升级到 {plan}',
    signInToPurchase: '登录后购买',
    creditsPerMonth: '{credits} 积分 / 月',
    creditsPerYear: '{credits} 积分 / 年',
    signupBonus: '注册赠送 {credits} 积分',
    capacityHint: '可用于 {range} AI 生成',
    packsTitle: '一次性积分包',
    packsSubtitle: '无需订阅即可补充积分，积分永久有效。',
    packCta: '购买积分包',
    packUnavailable: '暂不可用',
    packNote: '无需订阅',
    featurePdf: 'PDF 全库在线阅读',
    featureVideoPreview: '视频可试听 20%',
    featureUnlimited: '完整课程视频 + PDF',
    featureEverythingFree: '包含免费版全部功能',
    featureEverythingPro: '包含 Pro 版全部功能',
    checkoutError: '支付发起失败，请稍后重试。',
  },
};

const featureMap = (copy: typeof COPY.en) => ({
  'Full PDF lesson library (online-only)': copy.featurePdf,
  'Video previews (first 20%)': copy.featureVideoPreview,
  'Unlimited training videos + PDFs': copy.featureUnlimited,
  'Everything in Free plan': copy.featureEverythingFree,
  'Everything in Pro': copy.featureEverythingPro,
});

export default function PricingPageContent() {
  const locale = useLocale();
  const lang = locale === 'zh' ? 'zh' : 'en';
  const copy = COPY[lang];
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { planId, interval, loading: subscriptionLoading } = useSubscription();
  const { createCheckoutSession, isLoading } = useCreemPayment();
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('year');
  const [activeCheckout, setActiveCheckout] = useState<string | null>(null);

  const plans = useMemo(() => {
    const map = featureMap(copy);
    return paymentConfig.plans.map((plan) => {
      const credits =
        billingInterval === 'year'
          ? plan.credits.yearly || plan.credits.monthly * 12
          : plan.credits.monthly;
      const capacity = credits > 0 ? calculateGenerationCapacity(credits) : null;
      const capacityLabel = capacity
        ? lang === 'zh'
          ? `最多 ${capacity.images.nanoBanana} 张图片或 ${capacity.videos.sora2_720p_10s} 个视频`
          : formatCapacityRange(capacity)
        : null;
      const features = plan.features
        .filter((feature) => !/batch generation/i.test(feature))
        .filter((_, index) => index !== 0)
        .map((feature) => map[feature as keyof typeof map] || feature);

      return {
        ...plan,
        credits,
        capacity: capacityLabel,
        features,
      };
    });
  }, [billingInterval, copy, lang]);

  const handlePlanCheckout = async (planIdToBuy: 'pro' | 'proplus') => {
    if (!isAuthenticated) {
      router.push(withLocalePath('/signin', lang));
      return;
    }

    try {
      setActiveCheckout(planIdToBuy);
      await createCheckoutSession({
        planId: planIdToBuy,
        interval: billingInterval,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.checkoutError);
    } finally {
      setActiveCheckout(null);
    }
  };

  const handlePackCheckout = async (packId: string, productKey?: string) => {
    if (!isAuthenticated) {
      router.push(withLocalePath('/signin', lang));
      return;
    }

    if (!productKey) {
      toast.error(copy.packUnavailable);
      return;
    }

    try {
      setActiveCheckout(packId);
      await createCheckoutSession({
        productKey,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.checkoutError);
    } finally {
      setActiveCheckout(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-light)] text-[var(--color-text-secondary)]">
      <Navbar />

      <main className="pt-28 pb-24">
        <section className="relative overflow-hidden px-6 lg:px-12">
          <div className="absolute inset-0">
            <div className="absolute -top-24 right-[10%] h-56 w-56 rounded-full bg-[#2ec4b6]/10 blur-3xl" />
            <div className="absolute bottom-10 left-[6%] h-72 w-72 rounded-full bg-[#ff6b35]/10 blur-[110px]" />
            <div className="absolute inset-0 bg-pattern" />
          </div>

          <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-light)] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-text-primary)]">
                <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
                {copy.heroTag}
              </div>

              <h1
                className="text-4xl leading-tight md:text-5xl lg:text-6xl"
                style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
              >
                {copy.heroTitle}
              </h1>

              <p className="max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)]">
                {copy.heroSubtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link href={withLocalePath('/training', lang)} className="btn-primary">
                  {lang === 'zh' ? '浏览课程' : 'Browse training'}
                </Link>
                <Link href={withLocalePath('/signup', lang)} className="btn-secondary">
                  {lang === 'zh' ? '注册免费账号' : 'Create a free account'}
                </Link>
              </div>
            </div>

            <div className="relative overflow-visible rounded-[2.5rem] border border-[var(--color-border-light)] bg-white/95 p-8 pt-12 shadow-2xl">
              <div className="absolute -top-4 right-6 z-10 rounded-full bg-[#1a1a2e] px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                {copy.accessTitle}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2ec4b6]/10 text-[#2ec4b6]">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {copy.accessSubscriber}
                  </p>
                  <p className="text-xs text-[var(--color-text-light)]">{copy.accessNote}</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {[copy.accessFreePdf, copy.accessFreeVideo, copy.accessSubscriber].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-light)] px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)]"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--color-primary)]">
                      <Check className="h-4 w-4" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-3 rounded-2xl bg-[#1a1a2e] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                <Ticket className="h-4 w-4 text-[#ff6b35]" />
                {lang === 'zh' ? '订阅即刻生效' : 'Instant access on subscribe'}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-7xl px-6 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#2ec4b6]">
                {copy.subscribeTitle}
              </p>
              <h2
                className="mt-3 text-3xl md:text-4xl"
                style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
              >
                {copy.subscribeSubtitle}
              </h2>
            </div>

            <div className="flex rounded-full border border-[var(--color-border)] bg-white p-1 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setBillingInterval('month')}
                className={`rounded-full px-5 py-2 transition-all ${
                  billingInterval === 'month'
                    ? 'bg-[#1a1a2e] text-white'
                    : 'text-[var(--color-text-muted)]'
                }`}
              >
                {copy.monthly}
              </button>
              <button
                type="button"
                onClick={() => setBillingInterval('year')}
                className={`rounded-full px-5 py-2 transition-all ${
                  billingInterval === 'year'
                    ? 'bg-[#1a1a2e] text-white'
                    : 'text-[var(--color-text-muted)]'
                }`}
              >
                {copy.yearly}
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const isCurrent =
                !subscriptionLoading &&
                planId === plan.id &&
                ((interval || 'month') === billingInterval || plan.id === 'free');
              const isPopular = plan.popular;
              const displayPrice =
                billingInterval === 'year' && plan.yearlyPrice ? plan.yearlyPrice : plan.price;
              const monthlyEquivalent =
                billingInterval === 'year' && plan.yearlyPrice
                  ? plan.yearlyPrice / 12
                  : plan.price;
              const savings =
                billingInterval === 'year' && plan.yearlyPrice && plan.price > 0
                  ? getYearlySavings(plan.price, plan.yearlyPrice)
                  : null;

              const creditsLabel =
                plan.id === 'free'
                  ? copy.signupBonus.replace('{credits}', `${plan.credits.onSignup || 0}`)
                  : billingInterval === 'year'
                    ? copy.creditsPerYear.replace('{credits}', `${plan.credits}`)
                    : copy.creditsPerMonth.replace('{credits}', `${plan.credits}`);
              const capacityHint =
                plan.id !== 'free' && plan.capacity
                  ? copy.capacityHint.replace('{range}', plan.capacity)
                  : null;

              const ctaLabel = plan.id === 'free'
                ? isCurrent
                  ? copy.currentPlan
                  : copy.startFree
                : isCurrent
                  ? copy.currentPlan
                  : isAuthenticated
                    ? copy.upgradeTo.replace('{plan}', plan.name)
                    : copy.signInToPurchase;

              return (
                <div
                  key={plan.id}
                  className={`relative flex h-full flex-col rounded-[2.5rem] border bg-white p-8 shadow-sm transition-all ${
                    isPopular
                      ? 'border-[#2ec4b6] shadow-2xl'
                      : 'border-[var(--color-border-light)]'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#2ec4b6] px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                      {copy.mostPopular}
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-[#1a1a2e]">{plan.name}</h3>
                      <p className="text-sm text-[var(--color-text-light)]">{plan.description}</p>
                    </div>
                    {plan.id === 'proplus' ? (
                      <Crown className="h-7 w-7 text-[#ff6b35]" />
                    ) : plan.id === 'pro' ? (
                      <BadgePercent className="h-7 w-7 text-[#2ec4b6]" />
                    ) : (
                      <Sparkles className="h-7 w-7 text-[#1a1a2e]" />
                    )}
                  </div>

                  <div className="mt-8 border-y border-dashed border-[var(--color-border)] py-6">
                    {plan.price === 0 ? (
                      <div className="text-4xl font-semibold text-[#1a1a2e]">
                        {lang === 'zh' ? '免费' : 'Free'}
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-semibold text-[#1a1a2e]">
                            ${monthlyEquivalent.toFixed(2)}
                          </span>
                          <span className="text-sm text-[var(--color-text-light)]">
                            {copy.perMonth}
                          </span>
                        </div>
                        {billingInterval === 'year' && plan.yearlyPrice && (
                          <div className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#2ec4b6]">
                            ${displayPrice} {copy.perYear} ·{' '}
                            {copy.save.replace('{percentage}', `${savings?.percentage || 0}`)}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#2ec4b6]">
                      <Coins className="h-4 w-4" />
                      {creditsLabel}
                    </div>
                    {capacityHint && (
                      <p className="mt-2 text-xs text-[var(--color-text-light)]">{capacityHint}</p>
                    )}
                  </div>

                  <ul className="mt-6 space-y-3 text-sm text-[var(--color-text-secondary)]">
                    {plan.features.map((feature) => (
                      <li key={`${plan.id}-${feature}`} className="flex items-start gap-2">
                        <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff6b35]/10 text-[#ff6b35]">
                          <Check className="h-3 w-3" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    {plan.id === 'free' ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (!isCurrent) {
                            router.push(withLocalePath('/signup', lang));
                          }
                        }}
                        disabled={isCurrent}
                        className={`w-full rounded-full border px-5 py-3 text-sm font-semibold transition-all ${
                          isCurrent
                            ? 'border-slate-200 text-slate-400'
                            : 'border-[var(--color-border)] text-[#1a1a2e] hover:border-[#ff6b35] hover:text-[#ff6b35]'
                        }`}
                      >
                        {ctaLabel}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePlanCheckout(plan.id as 'pro' | 'proplus')}
                        disabled={isCurrent || isLoading}
                        className={`w-full rounded-full px-5 py-3 text-sm font-semibold text-white transition-all ${
                          isCurrent
                            ? 'bg-slate-300 text-slate-600'
                            : 'bg-[#1a1a2e] hover:bg-[#0f0f1a]'
                        }`}
                      >
                        {activeCheckout === plan.id && isLoading ? '...' : ctaLabel}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="credit-packs" className="mx-auto mt-24 max-w-7xl px-6 lg:px-12">
          <div className="rounded-[2.5rem] border border-[var(--color-border-light)] bg-white p-10 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#ff6b35]">
                  {copy.packsTitle}
                </p>
                <h2
                  className="mt-3 text-3xl md:text-4xl"
                  style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
                >
                  {copy.packsSubtitle}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-light)]">
                <Ticket className="h-4 w-4 text-[#2ec4b6]" />
                {copy.packNote}
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
              {paymentConfig.creditPacks.map((pack) => {
                const perCredit = (pack.price / pack.credits).toFixed(2);
                return (
                  <div
                    key={pack.id}
                    className={`relative flex h-full flex-col rounded-[2rem] border p-6 ${
                      pack.popular ? 'border-[#ff6b35] shadow-xl' : 'border-[var(--color-border)]'
                    }`}
                  >
                    {pack.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#1a1a2e] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                        {pack.badge}
                      </div>
                    )}

                    <div className="text-3xl font-semibold text-[#1a1a2e]">${pack.price}</div>
                    <p className="mt-1 text-sm text-[var(--color-text-light)]">
                      {pack.credits.toLocaleString()} {lang === 'zh' ? '积分' : 'credits'}
                    </p>
                    <div className="mt-4 rounded-xl bg-[var(--color-light)] px-3 py-2 text-xs text-[var(--color-text-muted)]">
                      ${perCredit} / {lang === 'zh' ? '积分' : 'credit'}
                    </div>

                    <div className="mt-auto pt-6">
                      <button
                        type="button"
                        onClick={() => handlePackCheckout(pack.id, pack.creemProductKey)}
                        disabled={isLoading || !pack.creemProductKey}
                        className={`w-full rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all ${
                          pack.creemProductKey
                            ? 'bg-[#ff6b35] hover:bg-[#e55a2b]'
                            : 'bg-slate-300 text-slate-500'
                        }`}
                      >
                        {activeCheckout === pack.id && isLoading ? '...' : copy.packCta}
                      </button>
                      {!pack.creemProductKey && (
                        <p className="mt-3 text-center text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-light)]">
                          {copy.packUnavailable}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
