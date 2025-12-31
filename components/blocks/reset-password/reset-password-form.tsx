'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Loader2, Mail, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type StatusState = {
  type: 'success' | 'error';
  message: string;
} | null;

const MIN_PASSWORD_LENGTH = 8;

export function ResetPasswordForm({ className }: { className?: string }) {
  const { t } = useTranslation();
  const tr = (key: string, options?: Record<string, unknown>) =>
    tr(`resetPassword.${key}`, options as never);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const tokenError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<StatusState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  const isResetMode = useMemo(() => Boolean(token && !tokenError), [token, tokenError]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRedirectTo(`${window.location.origin}${window.location.pathname}`);
    }
  }, []);

  const handleRequestLink = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!redirectTo) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          redirectTo,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || data?.error || 'Failed to send reset email.');
      }

      setStatus({
        type: 'success',
        message: data?.message || tr('requestSuccess'),
      });
      setEmail('');
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : tr('requestError'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setStatus({
        type: 'error',
        message: tr('passwordTooShort', { count: MIN_PASSWORD_LENGTH }),
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({
        type: 'error',
        message: tr('passwordMismatch'),
      });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPassword,
          token,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || data?.error || 'Failed to reset password.');
      }

      setStatus({
        type: 'success',
        message: tr('resetSuccess'),
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : tr('resetError'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatus = () => {
    if (!status) return null;
    const Icon = status.type === 'success' ? ShieldCheck : ShieldAlert;

    return (
      <div
        className={cn(
          'flex items-start gap-3 rounded-lg border px-4 py-3 text-sm',
          status.type === 'success'
            ? 'border-green-200 bg-green-50 text-green-800'
            : 'border-red-200 bg-red-50 text-red-700'
        )}
      >
        <Icon className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <p>{status.message}</p>
      </div>
    );
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-semibold">
          {isResetMode ? tr('titleReset') : tr('titleRequest')}
        </CardTitle>
        <CardDescription>
          {isResetMode ? tr('descriptionReset') : tr('descriptionRequest')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {tokenError === 'INVALID_TOKEN' && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 text-sm">
            <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <div>
              <p className="font-medium">{tr('tokenErrorTitle')}</p>
              <p className="text-amber-700">{tr('tokenErrorBody')}</p>
            </div>
          </div>
        )}

        {renderStatus()}

        {!isResetMode && (
          <form className="space-y-5" onSubmit={handleRequestLink}>
            <div className="space-y-2">
              <Label htmlFor="reset-email">{tr('emailLabel')}</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder={tr('emailPlaceholder')}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={isSubmitting || !redirectTo}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting || !email}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tr('sendingLink')}
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {tr('sendLink')}
                </>
              )}
            </Button>
          </form>
        )}

        {isResetMode && (
          <form className="space-y-5" onSubmit={handleResetPassword}>
            <div className="space-y-2">
              <Label htmlFor="new-password">{tr('newPasswordLabel')}</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength={MIN_PASSWORD_LENGTH}
                placeholder={tr('newPasswordPlaceholder')}
                required
              />
              <p className="text-muted-foreground text-xs">
                {tr('passwordHint', { count: MIN_PASSWORD_LENGTH })}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{tr('confirmPasswordLabel')}</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={MIN_PASSWORD_LENGTH}
                placeholder={tr('confirmPasswordPlaceholder')}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tr('updatingPassword')}
                </>
              ) : (
                tr('updatePassword')
              )}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-muted-foreground">
          {tr('rememberText')}{' '}
          <Link href="/signin" className="text-primary underline-offset-4 hover:underline">
            {tr('backToLogin')}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
