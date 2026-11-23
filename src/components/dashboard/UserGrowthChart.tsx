"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import { useIsClient } from "@/hooks/useIsClient";
import { useUserGrowth } from "./hooks/useDashboard";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface Series {
  name: string;
  data: number[];
}

export default function UserGrowthChart() {
  const isMounted = useIsClient();
  const { data, isLoading, isError } = useUserGrowth();

  const labels: string[] = data?.labels ?? [];
  const series: Series[] = data?.series ?? [];
  const newUsers = series.find((s) => /new/i.test(s.name))?.data ?? [];
  const activeUsers = series.find((s) => /active/i.test(s.name))?.data ?? [];

  const chartData = labels.map((date, i) => ({ date, newUsers: newUsers[i] ?? 0, active: activeUsers[i] ?? 0 }));

  return (
    <div className="p-5 sm:p-6 rounded-xl bg-[#0C0F10] border border-[#1B2227] flex flex-col justify-between font-raleway h-full shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#E7C042]" />
            <h3 className="text-base font-bold text-white tracking-tight">User growth</h3>
          </div>
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
        {data?.growthRate && (
          <span className="px-2 py-0.5 rounded-md bg-[#0E2922] border border-[#10B981]/30 text-xs font-semibold text-[#10B981] w-fit">
            {data.growthRate}
          </span>
        )}
      </div>

      <div className="w-full min-w-0 h-[240px] sm:h-[260px]">
        {!isMounted || isLoading ? (
          <div className="w-full h-full bg-[#121719]/40 rounded-lg animate-pulse" />
        ) : isError || chartData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-[#718090]">
            {isError ? "Could not load user growth." : "No user growth data yet."}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E7C042" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#E7C042" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1C242B" vertical={false} />
              <XAxis dataKey="date" stroke="#5B6675" tickLine={false} axisLine={{ stroke: "#1C242B" }} tick={{ fill: "#718090", fontSize: 11 }} />
              <YAxis stroke="#5B6675" tickLine={false} axisLine={false} allowDecimals={false} tick={{ fill: "#718090", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#11161B", borderColor: "#222C35", borderRadius: "8px", color: "#FFFFFF", fontSize: "12px" }}
                itemStyle={{ color: "#E7C042" }}
              />
              <Area type="monotone" dataKey="newUsers" name="New users" stroke="#5A6B7E" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" />
              <Area type="monotone" dataKey="active" name="Active users" stroke="#E7C042" strokeWidth={2.5} fill="url(#activeGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
