'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToastMessages } from '@/hooks/use-toast-messages';
import { cn } from '@/lib/utils';
import {
  useAuthError,
  useAuthLoading,
  useClearError,
  useEmailSignup,
  useIsAuthenticated,
  useSetError,
  useSignInWithGoogle,
  useSignOut,
} from '@/store/auth-store';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Signup Form - Editorial Minimal Design
 * Colors: Coral Orange (#ff6b35), Teal (#2ec4b6)
 * Typography: Instrument Serif (headlines), DM Sans (body)
 */

const MIN_PASSWORD_LENGTH = 8;
const isExternalUrl = (value: string) => /^https?:\/\//i.test(value);

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toastMessages = useToastMessages();
  const t = useTranslations();

  const isLoading = useAuthLoading();
  const error = useAuthError();
  const isAuthenticated = useIsAuthenticated();
  const emailSignup = useEmailSignup();
  const clearError = useClearError();
  const signInWithGoogle = useSignInWithGoogle();
  const signOut = useSignOut();
  const setError = useSetError();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [, setShowChangeEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [, setChangeEmailStatus] = useState<string | null>(null);

  // Redirect email verification back to signup with a flag so AuthProvider refreshes session
  const verificationCallbackPath = '/signup?authCallback=verified';
  const verificationCallbackUrl =
    typeof window !== 'undefined'
      ? new URL(verificationCallbackPath, window.location.origin).toString()
      : verificationCallbackPath;

  const getRedirectTarget = useCallback(() => {
    const callbackUrl = searchParams.get('callbackUrl');
    if (!callbackUrl) {
      return { localized: '/', relative: '/' };
    }
    if (isExternalUrl(callbackUrl)) {
      return { localized: callbackUrl, relative: callbackUrl };
    }
    const normalized = callbackUrl.startsWith('/') ? callbackUrl : `/${callbackUrl}`;
    return { localized: normalized, relative: normalized };
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated && !showVerificationNotice) {
      const { relative } = getRedirectTarget();
      router.replace(relative);
    }
  }, [isAuthenticated, showVerificationNotice, router, getRedirectTarget]);

  const handleSocialLogin = async () => {
    try {
      clearError();
      const { localized } = getRedirectTarget();
      await signInWithGoogle(localized);
    } catch (error) {
      console.error('Social login error:', error);
      toastMessages.error.socialLoginFailed();
    }
  };

  // Email registration handling
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validate password match
    if (password !== confirmPassword) {
      setError(t('signup.passwordMismatch'));
      return;
    }

    const result = await emailSignup(email, password, name, verificationCallbackUrl);
    if (result.success) {
      // Clear form data
      setSignupEmail(email);
      setResendStatus(null);
      setChangeEmailStatus(null);
      setShowChangeEmail(false);
      setNewEmail('');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      try {
        window.localStorage.setItem(
          'viecom:verification-email',
          JSON.stringify({ email, ts: Date.now() })
        );
      } catch {
        // Ignore storage failures (privacy mode, etc.)
      }
      setShowVerificationNotice(true);
    } else {
      if (result.error) {
        setError(result.error);
      }
    }
  };

  const handleResendVerification = async () => {
    if (!signupEmail || resendCooldown > 0) return;
    setResendStatus(null);

    try {
      const response = await fetch('/api/auth/send-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupEmail,
          callbackURL: verificationCallbackUrl,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || t('signup.resendFailed'));
      }

      setResendStatus(t('signup.resendSuccess'));
      setResendCooldown(30);
    } catch (error) {
      setResendStatus(
        error instanceof Error ? error.message : t('signup.resendFailed')
      );
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChangeEmail = async () => {
    if (!newEmail) {
      setChangeEmailStatus(t('signup.changeEmailInvalid'));
      return;
    }

    setChangeEmailStatus(null);

    try {
      const response = await fetch('/api/auth/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newEmail,
          callbackURL: verificationCallbackUrl,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || t('signup.changeEmailFailed'));
      }

      setSignupEmail(newEmail);
      setShowChangeEmail(false);
      setNewEmail('');
      setChangeEmailStatus(t('signup.changeEmailSuccess'));
      setResendCooldown(30);
    } catch (error) {
      setChangeEmailStatus(
        error instanceof Error ? error.message : t('signup.changeEmailFailed')
      );
    }
  };

  const handleOpenGmail = () => {
    window.open('https://mail.google.com', '_blank');
  };

  const handleOpenOutlook = () => {
    window.open('https://outlook.live.com', '_blank');
  };

  const handleOpenQQMail = () => {
    window.open('https://mail.qq.com', '_blank');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/signin');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  return (
    <div
      className={cn('flex w-full flex-col gap-6', className)}
      style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
      {...props}
    >
      <AlertDialog
        open={showVerificationNotice}
        onOpenChange={(open) => {
          if (open) {
            setShowVerificationNotice(true);
          }
        }}
      >
        <AlertDialogContent className="bg-white max-w-md rounded-[1.5rem]">
          <AlertDialogHeader className="text-center pb-4">
            {/* Illustration */}
            <div className="flex justify-center mb-6">
              <div className="relative w-40 h-40">
                {/* Teal rounded organic shape */}
                <div
                  className="absolute top-2 left-4 w-28 h-32 rounded-tl-full rounded-bl-full rounded-tr-[60%] rounded-br-[40%] opacity-80"
                  style={{ backgroundColor: '#2ec4b6' }}
                />
                {/* Dark square */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: '#1a1a2e' }}
                >
                  {/* Orange circle with face */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#ff6b35' }}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex gap-1.5 mb-1.5">
                        <div className="w-2 h-2 bg-white rounded-sm"></div>
                        <div className="w-2 h-2 bg-white rounded-sm"></div>
                      </div>
                      <div className="w-6 h-3 border-2 border-white border-t-0 rounded-b-full"></div>
                    </div>
                  </div>
                </div>
                {/* Teal dots at corners */}
                <div className="absolute top-2 left-2 w-3 h-3 rounded-sm" style={{ backgroundColor: '#2ec4b6' }} />
                <div className="absolute top-2 right-2 w-3 h-3 rounded-sm" style={{ backgroundColor: '#2ec4b6' }} />
                <div className="absolute bottom-2 left-2 w-3 h-3 rounded-sm" style={{ backgroundColor: '#ff6b35' }} />
                <div className="absolute bottom-2 right-2 w-3 h-3 rounded-sm" style={{ backgroundColor: '#ff6b35' }} />
              </div>
            </div>
            <AlertDialogTitle
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a1a2e' }}
            >
              {t('signup.checkInbox')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base" style={{ color: '#666' }}>
              {t('signup.emailVerificationMessage', {
                email: signupEmail || t('signup.yourEmail'),
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Email client buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-gray-300 bg-white text-gray-900 hover:bg-gray-50 justify-start"
              onClick={handleOpenGmail}
            >
              {/* Gmail Official Icon - Google G Logo */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="mr-3 h-5 w-5"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-semibold">{t('signup.openGmail')}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-gray-300 bg-white text-gray-900 hover:bg-gray-50 justify-start"
              onClick={handleOpenOutlook}
            >
              {/* Outlook Official Icon - Blue Envelope with White O */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="mr-3 h-5 w-5"
              >
                <path
                  fill="#0078D4"
                  d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                />
                <circle fill="white" cx="12" cy="12" r="5" />
                <path
                  fill="#0078D4"
                  d="M12 8c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
                />
              </svg>
              <span className="font-semibold">{t('signup.openOutlook')}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-gray-300 bg-white text-gray-900 hover:bg-gray-50 justify-start"
              onClick={handleOpenQQMail}
            >
              {/* QQ Mail Official Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="mr-3 h-5 w-5"
              >
                <path
                  fill="#12B7F5"
                  d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                />
                <path
                  fill="#12B7F5"
                  d="M4 6v12h16V8l-8 5-8-5V6z"
                  opacity="0.3"
                />
              </svg>
              <span className="font-semibold">{t('signup.openQQMail')}</span>
            </Button>
          </div>

          {/* Helper links */}
          <div className="space-y-2 text-sm text-gray-600 text-center">
            <p>
              {t('signup.noEmailInInbox')}{' '}
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={!signupEmail || resendCooldown > 0}
                className="text-blue-600 underline hover:text-blue-700 disabled:text-gray-400 disabled:no-underline"
              >
                {resendCooldown > 0
                  ? t('signup.resendIn', { seconds: resendCooldown })
                  : t('signup.resendIt')}
              </button>
            </p>
            <p>
              {t('signup.wrongAddress')}{' '}
              <button
                type="button"
                onClick={handleLogout}
                className="text-blue-600 underline hover:text-blue-700"
              >
                {t('signup.logOut')}
              </button>{' '}
              {t('signup.logOutToSignIn')}
            </p>
          </div>

          {resendStatus && (
            <div className="mt-4 rounded-md bg-blue-50 px-3 py-2 text-blue-700 text-sm text-center">
              {resendStatus}
            </div>
          )}

          {/* Close button */}
          <div className="mt-6 flex justify-end">
            <AlertDialogCancel asChild>
              <Button
                type="button"
                className="rounded-xl font-semibold transition-all btn-teal"
              >
                {t('common.close')}
              </Button>
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      {!showVerificationNotice && (
        <>
          {/* Logo */}
          <div className="text-center mb-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: '#ff6b35' }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span
                className="text-lg font-bold tracking-tight"
                style={{ color: '#1a1a2e' }}
              >
                FuturAI
              </span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl mb-2 font-display text-dark">
                {t('signup.title') || 'Create your account'}
              </h1>
              <p className="text-sm text-muted">
                {t('signup.signUpWithAccount')}
              </p>
            </div>
            <form onSubmit={handleEmailSignup} data-testid="signup-form">
              <div className="grid gap-5">
                {/* Error message display */}
                {error && (
                  <div className="rounded-xl px-4 py-3 text-sm bg-primary-light text-primary">
                    {error}
                    <button
                      type="button"
                      onClick={clearError}
                      className="ml-2 underline hover:no-underline"
                    >
                      {t('common.close')}
                    </button>
                  </div>
                )}

                {/* Google login */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl py-6 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                  onClick={() => handleSocialLogin()}
                  disabled={isLoading}
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
                  {isLoading ? t('common.signingUp') : t('signup.signUpWithGoogle')}
                </Button>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 font-medium text-light">
                      {t('common.orContinueWith') || 'or'}
                    </span>
                  </div>
                </div>

                {/* Name field */}
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-dark">{t('signup.name')}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('signup.name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="name"
                    data-testid="name-input"
                    className="rounded-xl border-slate-200 py-5 focus:border-[#ff6b35] focus:ring-[#ff6b35]/20"
                  />
                </div>

                {/* Email field */}
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-dark">{t('signup.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('signup.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="email"
                    data-testid="email-input"
                    className="rounded-xl border-slate-200 py-5 focus:border-[#ff6b35] focus:ring-[#ff6b35]/20"
                  />
                </div>

                {/* Password field */}
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-dark">{t('signup.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={MIN_PASSWORD_LENGTH}
                    placeholder={t('signup.passwordHint', { count: MIN_PASSWORD_LENGTH })}
                    autoComplete="new-password"
                    data-testid="password-input"
                    className="rounded-xl border-slate-200 py-5 focus:border-[#ff6b35] focus:ring-[#ff6b35]/20"
                  />
                </div>

                {/* Confirm Password field */}
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword" className="text-dark">{t('signup.confirmPassword')}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={MIN_PASSWORD_LENGTH}
                    placeholder={t('signup.passwordHint', { count: MIN_PASSWORD_LENGTH })}
                    autoComplete="new-password"
                    data-testid="confirm-password-input"
                    className="rounded-xl border-slate-200 py-5 focus:border-[#ff6b35] focus:ring-[#ff6b35]/20"
                  />
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full rounded-xl py-6 font-semibold transition-all active:scale-[0.98] btn-coral"
                  disabled={
                    isLoading ||
                    !email ||
                    !name ||
                    !password ||
                    !confirmPassword ||
                    password.length < MIN_PASSWORD_LENGTH ||
                    password !== confirmPassword
                  }
                  data-testid="signup-button"
                >
                  {isLoading ? t('common.signingUp') : (t('signup.submit') || 'Create account')}
                </Button>

                {/* Sign in link */}
                <div className="text-center text-sm text-muted">
                  {t('signup.haveAccount')}{' '}
                  <a
                    href="/signin"
                    className="font-semibold underline underline-offset-4 text-primary"
                  >
                    {t('signup.signinLink')}
                  </a>
                </div>
              </div>
            </form>
          </div>
        </>
      )}

    </div>
  );
}
