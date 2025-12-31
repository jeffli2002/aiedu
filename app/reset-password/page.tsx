'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ResetPasswordForm } from '@/components/blocks/reset-password/reset-password-form';

function ResetPasswordPageContent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <ResetPasswordForm className="w-full" />
      </div>
    </div>
  );
}

function LoadingFallback() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-gray-500 text-sm">{t('common.loading')}</p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
