"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import { useIsClient } from "@/hooks/useIsClient";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { date: "Feb 01", active: 520, newUsers: 710 },
  { date: "Feb 04", active: 580, newUsers: 720 },
  { date: "Feb 08", active: 690, newUsers: 700 },
  { date: "Feb 11", active: 750, newUsers: 740 },
  { date: "Feb 15", active: 890, newUsers: 790 },
  { date: "Feb 18", active: 940, newUsers: 830 },
  { date: "Feb 22", active: 1120, newUsers: 860 },
  { date: "Feb 25", active: 1180, newUsers: 890 },
  { date: "Mar 01", active: 1480, newUsers: 940 },
];

export default function UserGrowthChart() {
  const isMounted = useIsClient();

  return (
    <div className="p-5 sm:p-6 rounded-xl bg-[#0C0F10] border border-[#1B2227] flex flex-col justify-between font-raleway h-full shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#E7C042]" />
            <h3 className="text-base font-bold text-white tracking-tight">
              User growth
            </h3>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E7C042]" />
              <span className="text-[#8E9CA8]">Active users</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#5A6B7E]" />
              <span className="text-[#8E9CA8]">New users</span>
            </div>
          </div>
        </div>

        {/* Right action & trend */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-xs text-[#8E9CA8] hover:text-[#E7C042] transition-colors cursor-pointer"
          >
            View Report →
          </button>
          <span className="px-2 py-0.5 rounded-md bg-[#0E2922] border border-[#10B981]/30 text-xs font-semibold text-[#10B981]">
            +8.4%
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full min-w-0 h-[240px] sm:h-[260px]">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E7C042" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#E7C042" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1C242B"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                stroke="#5B6675"
                tickLine={false}
                axisLine={{ stroke: "#1C242B" }}
                tick={{ fill: "#718090", fontSize: 11 }}
              />

              <YAxis
                stroke="#5B6675"
                tickLine={false}
                axisLine={false}
                ticks={[0, 500, 1000, 1500]}
                domain={[0, 1500]}
                tick={{ fill: "#718090", fontSize: 11 }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#11161B",
                  borderColor: "#222C35",
                  borderRadius: "8px",
                  color: "#FFFFFF",
                  fontSize: "12px",
                }}
                itemStyle={{ color: "#E7C042" }}
              />

              {/* New Users Curve */}
              <Area
                type="monotone"
                dataKey="newUsers"
                stroke="#5A6B7E"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="transparent"
              />

              {/* Active Users Curve with Gold Gradient */}
              <Area
                type="monotone"
                dataKey="active"
                stroke="#E7C042"
                strokeWidth={2.5}
                fill="url(#activeGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full bg-[#121719]/40 rounded-lg animate-pulse" />
        )}
      </div>
    </div>
  );
}
