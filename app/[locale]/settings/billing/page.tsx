import type { Locale } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import BillingClient, { type BillingPlan } from '@/components/billing/BillingClient';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { paymentConfig } from '@/config/payment.config';

function BillingContent() {
  const plans: BillingPlan[] = paymentConfig.plans
    .filter((plan) => plan.id === 'pro' || plan.id === 'proplus')
    .map((plan) => ({
      id: plan.id as 'pro' | 'proplus',
      name: plan.name,
      description: plan.description,
      price: plan.price,
      yearlyPrice: plan.yearlyPrice,
      features: plan.features,
      popular: plan.popular,
      creditsPerInterval: {
        month: plan.credits.monthly ?? 0,
        year: plan.credits.yearly ?? (plan.credits.monthly ?? 0) * 12,
      },
    }));

  return <BillingClient plans={plans} />;
}

export default function BillingPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-[var(--color-light)]">
      <Navbar />
      <main className="pt-28 pb-24 px-6 lg:px-12">
        <Suspense
          fallback={<div className="container mx-auto max-w-5xl px-4 py-10">Loading...</div>}
        >
          <BillingContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
