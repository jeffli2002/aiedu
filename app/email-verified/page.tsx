'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth-store';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EmailVerifiedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, refreshSession, initialize } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Check if there's a token or code in the URL (from Better Auth verification)
  const token = searchParams.get('token');
  const code = searchParams.get('code');

  useEffect(() => {
    const checkAndRedirect = async () => {
      try {
        // If there's a token or code, Better Auth is processing the verification
        // Wait a bit longer for it to complete
        const initialDelay = (token || code) ? 800 : 300;
        await new Promise(resolve => setTimeout(resolve, initialDelay));
        
        // Force refresh session to get latest auth state after email verification
        await refreshSession();
        
        // Also initialize to ensure auth state is up to date
        await initialize(true);
        
        // Wait a bit more for state to update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if user is now authenticated
        const currentState = useAuthStore.getState();
        if (currentState.isAuthenticated && currentState.user && currentState.user.emailVerified) {
          // User is authenticated and email is verified, redirect to homepage
          console.log('[Email Verified] User authenticated, redirecting to homepage');
          router.replace('/');
          return;
        }
        
        // If not authenticated yet, retry a few times with increasing delays
        if (retryCount < 5) {
          const delay = 1000 * (retryCount + 1); // 1s, 2s, 3s, 4s, 5s
          console.log(`[Email Verified] Retrying authentication check (attempt ${retryCount + 1}/5) in ${delay}ms`);
          setRetryCount(prev => prev + 1);
          setTimeout(checkAndRedirect, delay);
        } else {
          console.warn('[Email Verified] Failed to authenticate after 5 attempts');
          setIsChecking(false);
          setHasError(true);
        }
      } catch (error) {
        console.error('[Email Verified] Error checking authentication status:', error);
        if (retryCount < 5) {
          const delay = 1000 * (retryCount + 1);
          setRetryCount(prev => prev + 1);
          setTimeout(checkAndRedirect, delay);
        } else {
          setIsChecking(false);
          setHasError(true);
        }
      }
    };

    // Start checking immediately
    checkAndRedirect();
  }, [router, refreshSession, initialize, token, code]);

  // Also check when auth state changes (this is a backup check)
  useEffect(() => {
    if (isAuthenticated && user && user.emailVerified && !isChecking) {
      // Small delay to ensure state is stable
      const timer = setTimeout(() => {
        router.replace('/');
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, router, isChecking]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
              <CardTitle className="text-xl">Verifying your email...</CardTitle>
              <CardDescription>Please wait while we sign you in.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
              <CardTitle className="text-xl">Email verified</CardTitle>
              <CardDescription>
                Your email has been confirmed. You can now sign in to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                type="button" 
                className="w-full btn-primary" 
                onClick={() => router.replace('/signin')}
              >
                Go to sign in
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  setRetryCount(0);
                  setIsChecking(true);
                  setHasError(false);
                  refreshSession();
                }}
              >
                Retry auto sign in
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success state (should redirect, but show briefly)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle className="text-xl">Email verified!</CardTitle>
            <CardDescription>Redirecting you to the homepage...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
