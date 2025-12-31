import {
  useAuthError,
  useAuthLoading,
  useClearError,
  useEmailLogin,
  useIsAuthenticated,
  useSignInWithGoogle,
} from '@/store/auth-store';
import type { UseLoginReturn } from '@/types/login';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const isExternalUrl = (value: string) => /^https?:\/\//i.test(value);

export function useLogin(): UseLoginReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isLoading = useAuthLoading();
  const error = useAuthError();
  const isAuthenticated = useIsAuthenticated();
  const emailLogin = useEmailLogin();
  const clearError = useClearError();
  const signInWithGoogle = useSignInWithGoogle();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

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

  // Auto redirect after successful login
  useEffect(() => {
    if (isAuthenticated) {
      const { relative } = getRedirectTarget();
      router.push(relative);
    }
  }, [isAuthenticated, router, getRedirectTarget]);

  // Handle social login
  const handleSocialLogin = async (_provider: 'google') => {
    try {
      clearError();
      const { localized } = getRedirectTarget();
      await signInWithGoogle(localized);
    } catch (error) {
      console.error('Social login error:', error);
    }
  };

  // Handle email login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const result = await emailLogin(formData.email, formData.password);
    if (result.success) {
      const { relative } = getRedirectTarget();
      router.push(relative);
    }
  };

  // Clear error
  const handleClearError = () => {
    clearError();
  };

  return {
    formData,
    setFormData,
    isLoading,
    error,
    isAuthenticated,
    handleEmailLogin,
    handleSocialLogin,
    handleClearError,
    getRedirectUrl: () => getRedirectTarget().localized,
  };
}
