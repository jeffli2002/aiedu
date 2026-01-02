'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth-store';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EmailVerifiedPage() {
  const router = useRouter();
  const { isAuthenticated, user, refreshSession, initialize } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkAndRedirect = async () => {
      try {
        // Force refresh session to get latest auth state after email verification
        await refreshSession();
        
        // Also initialize to ensure auth state is up to date
        await initialize(true);
        
        // Wait a bit for state to update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if user is now authenticated
        const currentState = useAuthStore.getState();
        if (currentState.isAuthenticated && currentState.user) {
          // User is authenticated, redirect to homepage
          router.replace('/');
          return;
        }
        
        // If not authenticated yet, retry a few times
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          setTimeout(checkAndRedirect, 1000);
        } else {
          setIsChecking(false);
          setHasError(true);
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          setTimeout(checkAndRedirect, 1000);
        } else {
          setIsChecking(false);
          setHasError(true);
        }
      }
    };

    checkAndRedirect();
  }, [router, refreshSession, initialize, retryCount]);

  // Also check when auth state changes
  useEffect(() => {
    if (isAuthenticated && user && !isChecking) {
      router.replace('/');
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
