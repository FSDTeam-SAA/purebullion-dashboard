"use client";

import React from "react";
import { Shield, KeyRound } from "lucide-react";

interface SecurityCardProps {
  onOpenChangePassword: () => void;
}

export default function SecurityCard({ onOpenChangePassword }: SecurityCardProps) {
  return (
    <div className="p-5 sm:p-6 lg:p-7 rounded-xl bg-[#0C0F10] border border-[#1B2227] font-raleway shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-[#1B2227]">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-[#E7C042]" />
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Security
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-md bg-[#182026] border border-[#2B353E] text-xs font-medium text-[#718090]">
            2 Today
          </span>
          <button
            type="button"
            className="text-xs text-[#8E9CA8] hover:text-[#E7C042] transition-colors font-medium"
          >
            View all →
          </button>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[#1B2227]">
        {/* Password Row */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#182026] border border-[#2B353E] text-[#E7C042] shrink-0 mt-0.5">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                Password
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenChangePassword}
            className="px-4 py-2 rounded-lg bg-[#182026] hover:bg-[#222C35] border border-[#2B353E] hover:border-[#E7C042]/50 text-xs font-semibold text-white hover:text-[#E7C042] transition-all cursor-pointer self-start sm:self-auto shrink-0"
          >
            Change password
          </button>
        </div>

      </div>
    </div>
  );
}
