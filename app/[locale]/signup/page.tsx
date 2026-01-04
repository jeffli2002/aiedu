'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SignupForm } from '@/components/blocks/signup/signup-form';

function SignupPageContent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignupForm />
      </div>
    </div>
  );
}

function LoadingFallback() {
  const t = useTranslations('common');
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-gray-500 text-sm">{t('loading')}</p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SignupPageContent />
    </Suspense>
  );
}
