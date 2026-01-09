'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { LoginForm } from '@/components/blocks/login/login-form';
import { useLogin } from '@/hooks/use-login';

/**
 * Sign In Page - Editorial Minimal Design
 */

function SigninPageContent() {
  const loginData = useLogin();

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10 relative overflow-hidden"
      style={{ backgroundColor: '#fafaf9' }}
    >
      {/* Decorative elements */}
      <div
        className="absolute top-20 right-[10%] w-64 h-64 rounded-full opacity-10 animate-float"
        style={{ backgroundColor: '#ff6b35' }}
      />
      <div
        className="absolute bottom-20 left-[5%] w-48 h-48 rounded-full opacity-10 animate-float"
        style={{ backgroundColor: '#2ec4b6', animationDelay: '2s' }}
      />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(#1a1a2e 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="flex w-full max-w-sm flex-col gap-6 relative z-10">
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
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10"
      style={{ backgroundColor: '#fafaf9' }}
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2"
          style={{ borderColor: '#ff6b35', borderTopColor: 'transparent' }}
        />
        <p className="text-sm" style={{ color: '#666' }}>{t('loading')}</p>
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
