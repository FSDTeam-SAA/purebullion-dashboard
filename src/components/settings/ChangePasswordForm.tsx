'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { userService } from '@/services/user.service';
import { getErrorMessage } from '@/services/apiClient';
import { usePermissions } from '@/hooks/usePermissions';

export default function ChangePasswordForm() {
  const { isReadOnly } = usePermissions();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isReadOnly) {
      toast.error('Read-only accounts cannot change passwords.');
      return;
    }

    if (!currentPassword) {
      toast.error('Please enter your current password.');
      return;
    }

    if (!newPassword) {
      toast.error('Please enter a new password.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }

    if (newPassword === currentPassword) {
      toast.error('New password must be different from current password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await userService.changePassword({
        oldPassword: currentPassword,
        newPassword,
      });

      toast.success(response.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200">
        <h2 className="text-gray-900 text-xl font-bold tracking-tight">Change Password</h2>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-5">
          {/* Current Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="currentPassword"
              className="text-sky-900 text-base font-medium"
            >
              Password
            </label>         
            <div className="relative flex items-center">
              <input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="***********"
                className="w-full h-14 px-4 pr-12 bg-violet-50/70 border border-violet-100 rounded-xl text-neutral-800 placeholder:text-neutral-400 text-base focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 text-neutral-500 hover:text-neutral-700 p-1 cursor-pointer transition-colors"
                aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="newPassword"
              className="text-sky-900 text-base font-medium"
            >
              New Password
            </label>
            <div className="relative flex items-center">
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="***********"
                className="w-full h-14 px-4 pr-12 bg-violet-50/70 border border-violet-100 rounded-xl text-neutral-800 placeholder:text-neutral-400 text-base focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 text-neutral-500 hover:text-neutral-700 p-1 cursor-pointer transition-colors"
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirmPassword"
              className="text-sky-900 text-base font-medium"
            >
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="***********"
                className="w-full h-14 px-4 pr-12 bg-violet-50/70 border border-violet-100 rounded-xl text-neutral-800 placeholder:text-neutral-400 text-base focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 text-neutral-500 hover:text-neutral-700 p-1 cursor-pointer transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Card Footer with Save Changes Button */}
        <div className="p-5 border-t border-slate-200 flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting || isReadOnly}
            className="h-12 px-6 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-base font-medium rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>

          {isReadOnly && (
            <span className="text-xs text-amber-700 font-medium bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              Read-Only Mode: Password change is restricted.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
