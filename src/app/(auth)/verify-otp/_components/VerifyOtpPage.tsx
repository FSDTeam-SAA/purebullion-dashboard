'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import AuthCardLayout from '../../_components/AuthCardLayout';
import { authService } from '@/services/auth.service';
import { getErrorMessage } from '@/services/apiClient';

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  const displayEmail = emailParam || 'you@gmail.com';

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    const digit = cleaned.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const numbers = pastedData.replace(/\D/g, '').slice(0, 6);

    if (!numbers) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = numbers[i] || '';
    }
    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex((char) => !char);
    const targetIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[targetIndex]?.focus();
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);

    try {
      const res = await authService.forgotPassword({ email: displayEmail });
      setResendCooldown(60);
      toast.success(
        res.data?.message || res.message || 'A new verification code has been sent.'
      );
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      toast.error('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.verifyEmailOtp({
        email: displayEmail,
        otp: code,
      });

      const resetToken = res.data?.resetToken;
      if (!resetToken) {
        throw new Error('Verification failed: No reset token received.');
      }

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('fg_reset_token', resetToken);
        sessionStorage.setItem('fg_reset_email', displayEmail);
      }

      toast.success('Email verified successfully!');
      router.push(`/reset-password?email=${encodeURIComponent(displayEmail)}`);
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const isComplete = otp.every((digit) => digit !== '');

  return (
    <AuthCardLayout
      title="Verify your email"
      subtitle={`we sent a 6-digit code to ${displayEmail}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6 font-raleway">
        {/* 6 OTP Boxes */}
        <div className="flex items-center justify-center gap-2 sm:gap-3.5 my-2">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              className="w-12 h-14 sm:w-16 sm:h-16 text-center text-2xl sm:text-3xl font-normal rounded-xl border border-white/20 bg-black/40 text-white outline-none transition-all focus:border-[#E7C042] focus:ring-1 focus:ring-[#E7C042]/50 font-raleway"
            />
          ))}
        </div>

        {/* Resend Link */}
        <div className="flex items-center justify-center text-sm sm:text-base text-white/90">
          <span>Didn&apos;t receive it ?</span>{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending}
            className="gold-gradient-text font-semibold hover:underline transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ml-1.5"
          >
            {isResending
              ? 'Sending...'
              : resendCooldown > 0
              ? `Resend (${resendCooldown}s)`
              : 'Resend code'}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !isComplete}
          className="w-full py-3.5 px-4 rounded-lg gold-gradient-btn text-black font-semibold text-base transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-raleway mt-4"
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </AuthCardLayout>
  );
}
