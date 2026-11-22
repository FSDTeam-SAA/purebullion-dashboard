"use client";

import React from "react";
import { DollarSign } from "lucide-react";
import { useIsClient } from "@/hooks/useIsClient";
import { useRevenueOverview } from "./hooks/useDashboard";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
} from "recharts";

const fallbackData = [
  { period: "P1", value: 72 },
  { period: "P2", value: 99 },
  { period: "P3", value: 82 },
  { period: "P4", value: 111 },
  { period: "P5", value: 105 },
  { period: "P6", value: 137 },
  { period: "P7", value: 123 },
  { period: "P8", value: 150 },
  { period: "P9", value: 130 },
  { period: "P10", value: 161 },
  { period: "P11", value: 148 },
  { period: "P12", value: 174 },
];

export default function RevenueOverviewChart() {
  const isMounted = useIsClient();
  const { data: revenueData } = useRevenueOverview();
  const rev = revenueData as any;

  const chartData = rev?.chartData?.length
    ? rev.chartData
    : rev?.monthlyBreakdown?.length
    ? rev.monthlyBreakdown.map((item: any, idx: number) => ({ period: `P${idx + 1}`, value: item.revenue || item.value }))
    : fallbackData;
  const totalRev = rev?.totalRevenue
    ? String(rev.totalRevenue)
    : "$184,620";
  const changeBadge = rev?.change || "↑ 9.8%";

  return (
    <div className="p-5 sm:p-6 rounded-xl bg-[#0C0F10] border border-[#1B2227] flex flex-col justify-between font-raleway h-full shadow-xs">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-4 h-4 text-[#E7C042]" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Revenue overview
          </h3>
        </div>

        {/* Total revenue & badge */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs text-[#8E9CA8] uppercase tracking-wider mb-0.5">
              Total revenue
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {totalRev}
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-[#0E2922] border border-[#10B981]/30 text-xs font-bold text-[#10B981] flex items-center gap-1">
            {changeBadge}
          </span>
        </div>
      </div>

      {/* Bar Chart Canvas */}
      <div className="w-full min-w-0 h-[180px] sm:h-[190px]">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={chartData} margin={{ top: 10, right: 4, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E7C042" stopOpacity={1} />
                  <stop offset="100%" stopColor="#C9B83F" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#121719] border border-[#2B353E] px-2.5 py-1.5 rounded-md text-xs text-white shadow-lg">
                        <span className="text-[#8E9CA8]">Revenue: </span>
                        <span className="font-bold text-[#E7C042]">
                          ${((payload[0].value as number) * 1060).toLocaleString()}
                        </span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="value"
                fill="url(#revenueGradient)"
                radius={[4, 4, 0, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full bg-[#121719]/40 rounded-lg animate-pulse" />
        )}
      </div>

      {/* Footer Metrics */}
      <div className="grid grid-cols-2 gap-4 pt-4 mt-2 border-t border-[#1B2227]">
        <div>
          <div className="text-xs text-[#8E9CA8] mb-0.5">Successful payments</div>
          <div className="text-base font-bold text-white tracking-tight">3,282</div>
        </div>
        <div>
          <div className="text-xs text-[#8E9CA8] mb-0.5">Failed payments</div>
          <div className="text-base font-bold text-[#EF4444] tracking-tight">42</div>
        </div>
      </div>
    </div>
  );
}
