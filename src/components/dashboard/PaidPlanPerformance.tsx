"use client";

import React from "react";
import Link from "next/link";
import { CreditCard } from "lucide-react";
import { usePaidPlanPerformance } from "./hooks/useDashboard";

interface PlanItem {
  name: string;
  sharePercentage: number;
  activeSubscribers: number;
  activeSubscribersFormatted?: string;
  revenue: string;
}

export default function PaidPlanPerformance() {
  const { data, isLoading, isError } = usePaidPlanPerformance();
  const plans: PlanItem[] = data?.plans ?? [];

  return (
    <div className="p-5 sm:p-6 rounded-xl bg-[#0C0F10] border border-[#1B2227] font-raleway shadow-xs">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#E7C042]" />
          <h3 className="text-base font-bold text-white tracking-tight">Paid plan performance</h3>
        </div>
        <Link href="/subscriptions" className="text-xs text-[#8E9CA8] hover:text-[#E7C042] transition-colors font-medium">
          Subscription details →
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#718090]">
          {isLoading ? "Loading plans…" : isError ? "Could not load plan performance." : "No paid plans yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className="p-4 sm:p-5 rounded-lg bg-[#121719]/60 border border-[#1B2227] flex flex-col justify-between gap-4 hover:border-[#2B353E] transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-[#181F24] border border-[#2B353E] text-xs font-semibold text-[#D1D5DB]">{plan.name}</span>
                <span className="text-2xl font-extrabold text-white tracking-tight">{plan.sharePercentage}%</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-[#8E9CA8]">Active subscribers</span>
                  <span className="font-bold text-white">{plan.activeSubscribersFormatted ?? plan.activeSubscribers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-[#8E9CA8]">Revenue</span>
                  <span className="font-bold text-white">{plan.revenue}</span>
                </div>
              </div>
              <div className="w-full bg-[#181F24] rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-[#D5AB29] to-[#E7C042] h-full rounded-full transition-all duration-500" style={{ width: `${plan.sharePercentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
