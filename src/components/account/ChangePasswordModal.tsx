"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, X } from "lucide-react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 font-raleway select-none">
      <div className="bg-[#0C0F10] border border-[#1B2227] rounded-xl max-w-md w-full p-6 shadow-2xl relative">
        {/* Header Section */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1B2227]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#E7C042]/10 border border-[#E7C042]/30 text-[#E7C042]">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Change password
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#8E9CA8] hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="pt-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-[#2E1417] border border-[#EF4444]/30 text-xs text-[#EF4444]">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-[#0E2922] border border-[#10B981]/30 text-xs text-[#10B981]">
              Password updated successfully!
            </div>
          )}

          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold text-[#8E9CA8] uppercase tracking-wider mb-1.5">
              Current password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#121719] border border-[#1B2227] hover:border-[#2B353E] focus:border-[#E7C042]/70 focus:outline-none rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-[#5B6675] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5B6675] hover:text-white transition-colors cursor-pointer"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-[#8E9CA8] uppercase tracking-wider mb-1.5">
              New password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#121719] border border-[#1B2227] hover:border-[#2B353E] focus:border-[#E7C042]/70 focus:outline-none rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-[#5B6675] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5B6675] hover:text-white transition-colors cursor-pointer"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-bold text-[#8E9CA8] uppercase tracking-wider mb-1.5">
              Confirm new password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#121719] border border-[#1B2227] hover:border-[#2B353E] focus:border-[#E7C042]/70 focus:outline-none rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-[#5B6675] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5B6675] hover:text-white transition-colors cursor-pointer"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#1B2227] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-transparent hover:bg-white/5 text-xs font-semibold text-[#8E9CA8] hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg gold-gradient-btn text-black text-xs font-bold shadow-md hover:brightness-105 active:scale-98 transition-all cursor-pointer"
            >
              Change password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
