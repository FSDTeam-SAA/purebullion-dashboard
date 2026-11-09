'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import AuthCardLayout from '../../_components/AuthCardLayout';
import { authService } from '@/services/auth.service';
import { getErrorMessage } from '@/services/apiClient';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');

  const [email] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('fg_reset_email') || emailParam || '';
    }
    return emailParam || '';
  });

  const [resetToken] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return (
        sessionStorage.getItem('fg_reset_token') ||
        searchParams.get('token') ||
        ''
      );
    }
    return searchParams.get('token') || '';
  });

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!resetToken) {
      toast.warning('No active reset token found. Please verify your OTP code first.');
    }
  }, [resetToken]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!resetToken) {
      const msg = 'Reset token is missing or expired. Please verify OTP again.';
      setError(msg);
      toast.error(msg);
      router.push('/forgot-password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please check again.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.resetPassword({
        email,
        newPassword: password,
        resetToken,
      });

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('fg_reset_token');
        sessionStorage.removeItem('fg_reset_email');
      }

      toast.success(
        res.data?.message || res.message || 'Password reset successfully! Please sign in.'
      );
      router.push('/login');
    } catch (err) {
      console.error('Reset password error:', err);
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCardLayout
      title="Reset Password?"
      subtitle="Please enter a new password for your account. Use a strong password to keep your account secure."
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 text-left font-raleway">
        {/* New Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-base font-normal text-white"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="********************"
              className="w-full px-4 py-3 pr-11 rounded-lg border border-[#A48226]/80 bg-black/40 text-white placeholder:text-[#C8C8C8] text-base outline-none transition-all focus:border-[#F8E392] focus:ring-1 focus:ring-[#F8E392]/50 font-raleway tracking-wider"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C8C8C8] hover:text-white transition-colors cursor-pointer p-0.5"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 stroke-[1.75]" />
              ) : (
                <Eye className="w-5 h-5 stroke-[1.75]" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-base font-normal text-white"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="********************"
              className="w-full px-4 py-3 pr-11 rounded-lg border border-[#A48226]/80 bg-black/40 text-white placeholder:text-[#C8C8C8] text-base outline-none transition-all focus:border-[#F8E392] focus:ring-1 focus:ring-[#F8E392]/50 font-raleway tracking-wider"
            />
            <button
              type="button"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C8C8C8] hover:text-white transition-colors cursor-pointer p-0.5"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5 stroke-[1.75]" />
              ) : (
                <Eye className="w-5 h-5 stroke-[1.75]" />
              )}
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-sm text-red-400 font-medium">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 rounded-lg gold-gradient-btn text-black font-semibold text-base transition-all shadow-md active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer font-raleway mt-4"
        >
          {isLoading ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </AuthCardLayout>
  );
}
