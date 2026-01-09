'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn, isMobile, isWebView } from '@/lib/utils';
import type { LoginFormProps } from '@/types/login';
import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Login Form - Editorial Minimal Design
 * Colors: Coral Orange (#ff6b35), Teal (#2ec4b6)
 * Typography: Instrument Serif (headlines), DM Sans (body)
 */

export function LoginForm({
  className,
  formData,
  setFormData,
  isLoading,
  error,
  onEmailLogin,
  onSocialLogin,
  onClearError,
  ...props
}: LoginFormProps & React.ComponentProps<'div'>) {
  const t = useTranslations();
  const [isInWebView, setIsInWebView] = useState(false);
  const [showWebViewWarning, setShowWebViewWarning] = useState(false);
  const [showVerificationBanner, setShowVerificationBanner] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const searchParams = useSearchParams();

  const isEmailNotVerified =
    error?.toLowerCase().includes('email not verified') ||
    error?.toLowerCase().includes('email_not_verified');

  useEffect(() => {
    const inWebView = isWebView() && isMobile();
    setIsInWebView(inWebView);
  }, []);

  useEffect(() => {
    const verifyParam = searchParams.get('verification');
    try {
      const stored = window.localStorage.getItem('viecom:verification-email');
      if (!stored && !verifyParam) return;
      const parsed = stored ? JSON.parse(stored) : null;
      if (parsed?.email) {
        setVerificationEmail(parsed.email);
      }
      setShowVerificationBanner(true);
    } catch {
      if (verifyParam) {
        setShowVerificationBanner(true);
      }
    }
  }, [searchParams]);

  const handleResendVerification = async () => {
    const targetEmail = formData.email || verificationEmail;
    if (!targetEmail) {
      setResendStatus('Please enter your email address to resend the confirmation.');
      return;
    }
    setIsResending(true);
    setResendStatus(null);
    try {
      const callbackURL = new URL('/signin?authCallback=verified', window.location.origin).toString();
      const response = await fetch('/api/auth/send-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, callbackURL }),
        credentials: 'include',
      });
      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || 'Failed to resend verification email');
      }
      setResendStatus('Verification email sent. Please check your inbox.');
    } catch (err) {
      setResendStatus(err instanceof Error ? err.message : 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  const handleSocialLogin = (provider: 'google') => {
    if (isInWebView) {
      setShowWebViewWarning(true);
      setTimeout(() => setShowWebViewWarning(false), 8000);
      return;
    }
    onSocialLogin(provider);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
  };

  return (
    <div
      className={cn('flex flex-col gap-6', className)}
      style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
      {...props}
    >
      {/* Logo */}
      <div className="text-center mb-4">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <Image
            src="/FuturAI_logo.png"
            alt="FuturAI logo"
            width={160}
            height={40}
            className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
          />
          <span className="sr-only">FuturAI</span>
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl mb-2 font-display text-dark">
            {t('signin.welcomeBack')}
          </h1>
          <p className="text-sm text-muted">
            {t('signin.signInWithAccountDesc')}
          </p>
        </div>

        <form onSubmit={onEmailLogin} data-testid="login-form">
          <div className="grid gap-5">
            {/* Verification banner */}
            {showVerificationBanner && (
              <div className="rounded-xl px-4 py-3 text-sm bg-secondary-light text-secondary">
                <p className="font-semibold">{t('signin.checkEmailToContinue')}</p>
                <p className="mt-1 opacity-80">
                  {t('signin.emailConfirmationMessage', {
                    email: verificationEmail || t('signin.yourInbox'),
                  })}
                </p>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="rounded-xl px-4 py-3 text-sm bg-primary-light text-primary">
                {error}
                <button
                  type="button"
                  onClick={onClearError}
                  className="ml-2 underline hover:no-underline"
                >
                  {t('common.close')}
                </button>
              </div>
            )}

            {/* Email not verified */}
            {isEmailNotVerified && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-dark">
                <p className="font-semibold">{t('signin.needNewConfirmation')}</p>
                <p className="mt-1">{t('signin.resendVerificationMessage')}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="rounded-xl border-slate-200"
                  >
                    {isResending ? t('signin.sending') : t('signin.resendConfirmationEmail')}
                  </Button>
                  {resendStatus && <span className="text-muted">{resendStatus}</span>}
                </div>
              </div>
            )}

            {/* WebView warning */}
            {showWebViewWarning && (
              <div
                className="flex items-start gap-2 rounded-xl px-4 py-3 text-sm"
                style={{ backgroundColor: 'rgba(255, 107, 53, 0.1)', color: '#ff6b35' }}
              >
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold">{t('signin.unableToSignIn')}</p>
                  <p className="mt-1 opacity-80">{t('signin.googleSignInNotSupported')}</p>
                  <ul className="mt-1 list-inside list-disc space-y-1 opacity-80">
                    <li>{t('signin.useOpenInBrowser')}</li>
                    <li>{t('signin.orSignInWithEmail')}</li>
                  </ul>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 rounded-xl"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert(t('signin.urlCopied'));
                    }}
                  >
                    {t('signin.copyUrlToOpenInBrowser')}
                  </Button>
                </div>
              </div>
            )}

            {/* Google login */}
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl py-6 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              data-testid="google-login-button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="mr-2 h-5 w-5"
                role="img"
                aria-label="Google"
              >
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              {isLoading ? t('signin.signingIn') : t('signin.signInWithGoogle')}
            </Button>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 font-medium text-light">
                  {t('signin.orUseEmail')}
                </span>
              </div>
            </div>

            {/* Email field */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-dark">{t('signin.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleEmailChange}
                required
                disabled={isLoading}
                autoComplete="email"
                data-testid="email-input"
                className="rounded-xl border-slate-200 py-5 focus:border-[#ff6b35] focus:ring-[#ff6b35]/20"
              />
            </div>

            {/* Password field */}
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-dark">{t('signin.password')}</Label>
                <a
                  href="/reset-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline text-primary"
                >
                  {t('signin.forgotPassword')}
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handlePasswordChange}
                required
                disabled={isLoading}
                autoComplete="current-password"
                data-testid="password-input"
                className="rounded-xl border-slate-200 py-5 focus:border-[#ff6b35] focus:ring-[#ff6b35]/20"
              />
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full rounded-xl py-6 font-semibold transition-all active:scale-[0.98] btn-coral"
              disabled={isLoading || !formData.email || !formData.password}
              data-testid="login-button"
            >
              {isLoading ? t('signin.signingIn') : t('signin.submit')}
            </Button>

            {/* Sign up link */}
            <div className="text-center text-sm text-muted">
              {t('signin.dontHaveAccount')}{' '}
              <a
                href="/signup"
                className="font-semibold underline underline-offset-4 text-primary"
              >
                {t('signin.signupLink')}
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
