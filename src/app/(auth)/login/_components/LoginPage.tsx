'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import AuthCardLayout from '../../_components/AuthCardLayout';
import { userService } from '@/services/user.service';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  const messageParam = searchParams.get('message');

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (errorParam === 'AccessDenied' || messageParam) {
      toast.error(
        messageParam
          ? decodeURIComponent(messageParam)
          : 'Access denied. Only administrators can access the dashboard.'
      );
    }
  }, [errorParam, messageParam]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Please enter both email and password.');
      return;
    }
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error || 'Invalid email or password.');
        setIsLoading(false);
        return;
      }

      // Sync fresh JWT access token, permissions, and role to localStorage
      try {
        const session = await getSession();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sessionUser = session?.user as any;
        const token = sessionUser?.accessToken;
        if (token && token !== 'mock-jwt-token') {
          localStorage.setItem('accessToken', token);
        }
        if (Array.isArray(sessionUser?.permissions) && sessionUser.permissions.length > 0) {
          localStorage.setItem(
            'adminPermissions',
            JSON.stringify(sessionUser.permissions)
          );
        }
        if (sessionUser?.role) {
          localStorage.setItem('adminRole', sessionUser.role);
        }

        // If permissions not yet loaded in session, fetch user profile directly
        if (!sessionUser?.permissions || sessionUser.permissions.length === 0) {
          try {
            const profileRes = await userService.getProfile();
            const profile = profileRes?.data;
            if (Array.isArray(profile?.permissions) && profile.permissions.length > 0) {
              localStorage.setItem(
                'adminPermissions',
                JSON.stringify(profile.permissions)
              );
            }
            if (profile?.role) {
              localStorage.setItem('adminRole', profile.role);
            }
          } catch {
            // ignore profile fetch fallback
          }
        }
      } catch {
        // ignore
      }

      toast.success('Login successful! Redirecting...');
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred during login.');
      setIsLoading(false);
    }
  };

  return (
    <AuthCardLayout
      title="Welcome back"
      subtitle="Please enter your email & password to access your account."
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 text-left font-raleway">
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

        {/* Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-base font-normal text-white"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-white text-sm font-raleway">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-white/60 bg-transparent text-[#A48226] focus:ring-0 focus:outline-none accent-[#A48226] cursor-pointer"
            />
            <span>Remember me</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-sm font-semibold gold-gradient-text hover:brightness-110 transition-all font-raleway"
          >
            Forgot Password
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 rounded-lg gold-gradient-btn text-black font-semibold text-base transition-all shadow-md active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer font-raleway mt-4"
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>

        {/* Bottom Link */}
        {/* <p className="text-center text-base text-[#A2ABA8] pt-4 font-nunito">
          Don’t have an account?{' '}
          <Link
            href="/login"
            className="gold-gradient-text font-semibold hover:underline transition-all ml-1"
          >
            Create account
          </Link>
        </p> */}
      </form>
    </AuthCardLayout>
  );
}
