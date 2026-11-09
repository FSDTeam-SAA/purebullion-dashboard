'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AuthCardLayout from '../../_components/AuthCardLayout';
import { authService } from '@/services/auth.service';
import { getErrorMessage } from '@/services/apiClient';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error('Please enter your email address.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.forgotPassword({ email: trimmedEmail });
      toast.success(
        res.data?.message || res.message || 'Verification code sent to your email.'
      );
      router.push(`/verify-otp?email=${encodeURIComponent(trimmedEmail)}`);
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCardLayout
      title="Forgot Password?"
      subtitle="Enter your email and we’ll send you a code to reset your password"
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-left font-raleway">
        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-base font-normal text-white"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg border border-[#A48226]/80 bg-black/40 text-white placeholder:text-[#C8C8C8] text-base outline-none transition-all focus:border-[#F8E392] focus:ring-1 focus:ring-[#F8E392]/50 font-raleway"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 rounded-lg gold-gradient-btn text-black font-semibold text-base transition-all shadow-md active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer font-raleway mt-4"
        >
          {isLoading ? 'Sending Code...' : 'Continue'}
        </button>

        {/* Back to sign in link */}
        <p className="text-center text-base text-[#A2ABA8] pt-2 font-nunito">
          Remember your password?{' '}
          <Link
            href="/login"
            className="gold-gradient-text font-semibold hover:underline transition-all ml-1"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthCardLayout>
  );
}
