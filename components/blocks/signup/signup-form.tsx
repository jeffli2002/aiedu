'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
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
import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const MIN_PASSWORD_LENGTH = 8;
const isExternalUrl = (value: string) => /^https?:\/\//i.test(value);

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toastMessages = useToastMessages();
  const { t } = useTranslation();

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
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [changeEmailStatus, setChangeEmailStatus] = useState<string | null>(null);

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

  const handleSocialLogin = async (_provider: 'google') => {
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
      setError(t('signup.passwordMismatch') || 'Passwords do not match');
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
      } catch (_storageError) {
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
        throw new Error(detail || 'Failed to resend verification email');
      }

      setResendStatus('Verification email sent. Please check your inbox.');
      setResendCooldown(30);
    } catch (error) {
      setResendStatus(
        error instanceof Error ? error.message : 'Failed to resend verification email'
      );
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail) {
      setChangeEmailStatus('Please enter a valid email address.');
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
        throw new Error(detail || 'Failed to change email');
      }

      setSignupEmail(newEmail);
      setShowChangeEmail(false);
      setNewEmail('');
      setChangeEmailStatus('Email updated. Please check your inbox for confirmation.');
      setResendCooldown(30);
    } catch (error) {
      setChangeEmailStatus(error instanceof Error ? error.message : 'Failed to change email');
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
    <div className={cn('flex w-full flex-col gap-6', className)} {...props}>
      <AlertDialog
        open={showVerificationNotice}
        onOpenChange={(open) => {
          if (open) {
            setShowVerificationNotice(true);
          }
        }}
      >
        <AlertDialogContent className="bg-white max-w-md">
          <AlertDialogHeader className="text-center pb-4">
            {/* Illustration */}
            <div className="flex justify-center mb-6">
              <div className="relative w-40 h-40">
                {/* Teal/mint green rounded organic shape (stylized 'n') */}
                <div className="absolute top-2 left-4 w-28 h-32 bg-teal-300 rounded-tl-full rounded-bl-full rounded-tr-[60%] rounded-br-[40%] opacity-80"></div>
                {/* Dark green square */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-green-600 rounded-lg flex items-center justify-center shadow-lg">
                  {/* Orange circle with face */}
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex gap-1.5 mb-1.5">
                        <div className="w-2 h-2 bg-white rounded-sm"></div>
                        <div className="w-2 h-2 bg-white rounded-sm"></div>
                      </div>
                      <div className="w-6 h-3 border-2 border-white border-t-0 rounded-b-full"></div>
                    </div>
                  </div>
                </div>
                {/* Purple dots at corners */}
                <div className="absolute top-2 left-2 w-3 h-3 bg-purple-500 rounded-sm"></div>
                <div className="absolute top-2 right-2 w-3 h-3 bg-purple-500 rounded-sm"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 bg-purple-500 rounded-sm"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 bg-purple-500 rounded-sm"></div>
              </div>
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-gray-900 mb-4">
              Check your inbox
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-gray-700">
              Click on the link we sent to{' '}
              <span className="font-semibold text-gray-900">{signupEmail || 'your email'}</span> to
              finish your account setup.
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
              {/* Gmail Official Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="mr-3 h-5 w-5"
              >
                <path
                  fill="#EA4335"
                  d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
                />
                <path
                  fill="#4285F4"
                  d="M5.455 4.64L0 7.5v11.866c0 .904.732 1.636 1.636 1.636h3.819V11.73L5.455 4.64z"
                />
                <path
                  fill="#34A853"
                  d="M12 16.64l6.545-4.91V4.64L12 9.548 5.455 4.64v7.18L12 16.64z"
                />
                <path
                  fill="#FBBC04"
                  d="M24 5.457v-2.91c0-2.023-2.309-3.178-3.927-1.964L18.545 4.64 12 9.548l-6.545-4.91L3.927 1.636C2.309.422 0 1.577 0 3.6v1.857l5.455 3.273L12 9.548l6.545-4.91L24 5.457z"
                />
              </svg>
              <span className="font-semibold">Open Gmail</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-gray-300 bg-white text-gray-900 hover:bg-gray-50 justify-start"
              onClick={handleOpenOutlook}
            >
              {/* Outlook Official Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="mr-3 h-5 w-5"
              >
                <path
                  fill="#0078D4"
                  d="M7.5 7c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-9zm0 1.5h9c.3 0 .5.2.5.5v6c0 .3-.2.5-.5.5h-9c-.3 0-.5-.2-.5-.5v-6c0-.3.2-.5.5-.5z"
                />
                <path
                  fill="#0078D4"
                  d="M12 10.5l-2.5 2.5h1.5v2h2v-2h1.5l-2.5-2.5z"
                />
                <circle fill="#0078D4" cx="12" cy="12" r="1" opacity="0.3" />
              </svg>
              <span className="font-semibold">Open Outlook</span>
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
                  d="M12 11L4 6h16l-8 5zm0 2l8-5v10H4V8l8 5z"
                  opacity="0.6"
                />
              </svg>
              <span className="font-semibold">Open QQ Mail</span>
            </Button>
          </div>

          {/* Helper links */}
          <div className="space-y-2 text-sm text-gray-600 text-center">
            <p>
              No email in your inbox or spam folder?{' '}
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={!signupEmail || resendCooldown > 0}
                className="text-blue-600 underline hover:text-blue-700 disabled:text-gray-400 disabled:no-underline"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Let's resend it."}
              </button>
            </p>
            <p>
              Wrong address?{' '}
              <button
                type="button"
                onClick={handleLogout}
                className="text-blue-600 underline hover:text-blue-700"
              >
                Log out
              </button>{' '}
              to sign in with a different email.
            </p>
          </div>

          {resendStatus && (
            <div className="mt-4 rounded-md bg-blue-50 px-3 py-2 text-blue-700 text-sm text-center">
              {resendStatus}
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
      {!showVerificationNotice && (
        <Card className="w-full bg-white shadow-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-900 mb-2">
              {t('signup.title') || 'Log in or create an account to collaborate'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {t('signup.signUpWithAccount')}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleEmailSignup} data-testid="signup-form">
              <div className="grid gap-6">
                {/* Error message display */}
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600 text-sm">
                    {error}
                    <button
                      type="button"
                      onClick={clearError}
                      className="ml-2 underline hover:no-underline"
                    >
                      Close
                    </button>
                  </div>
                )}

                {/* Social login buttons */}
                <div className="flex flex-col gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 border-gray-300 bg-white text-gray-900 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
                    onClick={() => handleSocialLogin('google')}
                    disabled={isLoading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      className="mr-2 h-5 w-5"
                      role="img"
                      aria-label="Google"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                    </svg>
                    {isLoading ? t('common.signingUp') : t('signup.signUpWithGoogle')}
                  </Button>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex-1 border-t border-gray-200" />
                  <span className="text-gray-500">{t('common.orContinueWith') || 'or'}</span>
                  <div className="flex-1 border-t border-gray-200" />
                </div>

                {/* Email password registration */}
                <div className="grid gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                      {t('signup.name')}
                    </Label>
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
                      className="h-11 bg-gray-50 border-gray-300"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                      {t('signup.email')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      autoComplete="email"
                      data-testid="email-input"
                      className="h-11 bg-gray-50 border-gray-300"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                      {t('signup.password')}
                    </Label>
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
                      className="h-11 bg-gray-50 border-gray-300"
                    />
                    <p className="text-gray-500 text-xs">
                      {t('signup.passwordHint', { count: MIN_PASSWORD_LENGTH })}
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword" className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                      {t('signup.confirmPassword')}
                    </Label>
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
                      className="h-11 bg-gray-50 border-gray-300"
                    />
                  </div>
                  <Button
                    type="submit"
                    className={cn(
                      'w-full h-11 font-medium',
                      password.length >= MIN_PASSWORD_LENGTH &&
                        password === confirmPassword &&
                        email &&
                        name &&
                        !isLoading
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                    )}
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
                    {isLoading ? t('common.signingUp') : (t('signup.submit') || 'Continue with email')}
                  </Button>
                </div>

                <div className="text-center text-sm">
                  {t('signup.haveAccount')}{' '}
                  <a href="/signin" className="underline underline-offset-4">
                    {t('signup.signinLink')}
                  </a>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
