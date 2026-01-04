'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LoginForm } from '@/components/blocks/login/login-form';
import { useLogin } from '@/hooks/use-login';

function SigninPageContent() {
  const loginData = useLogin();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm
          formData={loginData.formData}
          setFormData={loginData.setFormData}
          isLoading={loginData.isLoading}
          error={loginData.error}
          onEmailLogin={loginData.handleEmailLogin}
          onSocialLogin={loginData.handleSocialLogin}
          onClearError={loginData.handleClearError}
        />
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

export default function SigninPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SigninPageContent />
    </Suspense>
  );
}
