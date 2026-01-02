'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useTranslation } from 'react-i18next';

interface OTPVerificationDialogProps {
  open: boolean;
  email: string;
  userName?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function OTPVerificationDialog({
  open,
  email,
  userName,
  onClose,
  onSuccess,
}: OTPVerificationDialogProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { refreshSession, initialize } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input when dialog opens
  useEffect(() => {
    if (open && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [open]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerify();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      const newOtp = [...otp];
      digits.forEach((digit, index) => {
        if (index < 6) {
          newOtp[index] = digit;
        }
      });
      setOtp(newOtp);
      setError(null);
      
      // Focus last input
      inputRefs.current[5]?.focus();
      
      // Auto-submit
      setTimeout(() => {
        handleVerify();
      }, 100);
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError(t('otp.invalidCode') || 'Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otpString,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t('otp.verificationFailed') || 'Verification failed');
        setIsLoading(false);
        return;
      }

      // Refresh session to get updated auth state
      await refreshSession();
      await initialize(true);

      // Wait a bit for state to update
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if user is authenticated
      const currentState = useAuthStore.getState();
      if (currentState.isAuthenticated && currentState.user) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.replace('/');
        }
      } else {
        // If not authenticated, redirect to signin
        router.replace('/signin');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError(t('otp.verificationError') || 'An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) {
      return;
    }

    setIsResending(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t('otp.resendFailed') || 'Failed to resend code');
        setIsResending(false);
        return;
      }

      // Reset OTP inputs
      setOtp(['', '', '', '', '', '']);
      setResendCooldown(60); // 60 seconds cooldown
      setIsResending(false);
      
      // Focus first input
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError(t('otp.resendError') || 'An error occurred. Please try again.');
      setIsResending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {t('otp.title') || 'Check your email to continue'}
          </DialogTitle>
          <DialogDescription className="text-base">
            {t('otp.description') || "We've sent a one-time password to your email. Please check your inbox at"}
            <br />
            <strong className="text-slate-900">{email}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* OTP Input */}
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-bold border-2 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                disabled={isLoading}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Resend */}
          <div className="text-center">
            {resendCooldown > 0 ? (
              <p className="text-sm text-slate-500">
                {t('otp.resendIn') || 'Resend in'} {resendCooldown}s
              </p>
            ) : (
              <Button
                type="button"
                variant="ghost"
                onClick={handleResend}
                disabled={isResending}
                className="text-sm"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('otp.sending') || 'Sending...'}
                  </>
                ) : (
                  t('otp.resend') || 'Resend code'
                )}
              </Button>
            )}
          </div>

          {/* Verify Button */}
          <Button
            type="button"
            onClick={handleVerify}
            disabled={isLoading || otp.some(digit => !digit)}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t('otp.verifying') || 'Verifying...'}
              </>
            ) : (
              t('otp.verify') || 'Verify'
            )}
          </Button>

          {/* Back Button */}
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="w-full"
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('otp.back') || 'Back'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

