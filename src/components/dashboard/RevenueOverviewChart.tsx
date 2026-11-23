"use client";

import React from "react";
import { DollarSign } from "lucide-react";
import { useIsClient } from "@/hooks/useIsClient";
import { useRevenueOverview } from "./hooks/useDashboard";
import { ResponsiveContainer, BarChart, Bar, Tooltip } from "recharts";

export default function RevenueOverviewChart() {
  const isMounted = useIsClient();
  const { data, isLoading, isError } = useRevenueOverview();

  const bars: { label: string; value: number }[] = data?.bars ?? [];
  const payments = data?.paymentsSummary;

  return (
    <div className="p-5 sm:p-6 rounded-xl bg-[#0C0F10] border border-[#1B2227] flex flex-col justify-between font-raleway h-full shadow-xs">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-4 h-4 text-[#E7C042]" />
          <h3 className="text-base font-bold text-white tracking-tight">Revenue overview</h3>
        </div>

        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs text-[#8E9CA8] uppercase tracking-wider mb-0.5">Total revenue</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {data?.totalRevenueFormatted ?? (isLoading ? "…" : "—")}
            </div>
          </div>
          {data?.growthRate && (
            <span className="px-2.5 py-1 rounded-md bg-[#0E2922] border border-[#10B981]/30 text-xs font-bold text-[#10B981]">
              {data.growthRate}
            </span>
          )}
        </div>
      </div>

      <div className="w-full min-w-0 h-[180px] sm:h-[190px]">
        {!isMounted || isLoading ? (
          <div className="w-full h-full bg-[#121719]/40 rounded-lg animate-pulse" />
        ) : isError || bars.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-[#718090]">
            {isError ? "Could not load revenue." : "No revenue data yet."}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={bars} margin={{ top: 10, right: 4, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E7C042" stopOpacity={1} />
                  <stop offset="100%" stopColor="#C9B83F" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0].payload as { label: string; value: number };
                  return (
                    <div className="bg-[#121719] border border-[#2B353E] px-2.5 py-1.5 rounded-md text-xs text-white shadow-lg">
                      <span className="text-[#8E9CA8]">{item.label}: </span>
                      <span className="font-bold text-[#E7C042]">${item.value.toLocaleString()}</span>
                    </div>
                  );
                }}
              />
              <Bar dataKey="value" fill="url(#revenueGradient)" radius={[4, 4, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 mt-2 border-t border-[#1B2227]">
        <div>
          <div className="text-xs text-[#8E9CA8] mb-0.5">Successful payments</div>
          <div className="text-base font-bold text-white tracking-tight">{payments?.successfulPaymentsFormatted ?? "—"}</div>
        </div>
        <div>
          <div className="text-xs text-[#8E9CA8] mb-0.5">Failed payments</div>
          <div className="text-base font-bold text-[#EF4444] tracking-tight">{payments?.failedPaymentsFormatted ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}
