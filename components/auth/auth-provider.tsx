'use client';

import { useAuthStore } from '@/store/auth-store';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function AuthProviderContent() {
  const initialize = useAuthStore((state) => state.initialize);
  const refreshSession = useAuthStore((state) => state.refreshSession);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    initialize(true);
  }, [initialize]);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const authCallback = searchParams.get('authCallback');
    const cbParam = searchParams.get('callbackUrl');
    const target = cbParam && cbParam.startsWith('/') ? cbParam : '/training';

    if (code || state || authCallback) {
      const timer = setTimeout(async () => {
        await refreshSession();

        // If this is an auth callback (OAuth or verification) and we have a target, redirect
        if (authCallback) {
          const { isAuthenticated } = useAuthStore.getState();
          if (isAuthenticated) {
            router.replace(target);
            return;
          }
        }

        // Clean URL params if staying on the same page
        if (window.history.replaceState) {
          const url = new URL(window.location.href);
          url.searchParams.delete('code');
          url.searchParams.delete('state');
          url.searchParams.delete('authCallback');
          // keep callbackUrl in case pages want to use it later
          window.history.replaceState({}, '', url.toString());
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [searchParams, refreshSession, router]);

  return null;
}

/**
 * Hydrates auth state from the client without forcing the full layout to be a client component.
 */
export function AuthProvider() {
  return (
    <Suspense fallback={null}>
      <AuthProviderContent />
    </Suspense>
  );
}
