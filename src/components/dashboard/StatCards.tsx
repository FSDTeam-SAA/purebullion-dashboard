"use client";

import React from "react";
import { Users, Crown, Activity, Bell } from "lucide-react";
import { useDashboardKpis } from "./hooks/useDashboard";

interface Kpi {
  label: string;
  value: string;
  growth?: string;
  sparkline?: number[];
}

const CARDS: { key: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "totalUsers", icon: Users },
  { key: "subscriptionRevenue", icon: Crown },
  { key: "activeSignals", icon: Activity },
  { key: "openAlerts", icon: Bell },
];

const TITLES: Record<string, string> = {
  totalUsers: "Total Users",
  subscriptionRevenue: "Subscription Revenue",
  activeSignals: "Active Signals",
  openAlerts: "Open Alerts",
};

/** Turns real data points into an SVG polyline path (viewBox 200x35). */
function sparklinePath(points?: number[]): string | null {
  if (!points || points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  return points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 200;
      const y = 33 - ((p - min) / span) * 30;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function StatCards() {
  const { data, isLoading, isError } = useDashboardKpis();
  const kpis = data as Record<string, Kpi> | undefined;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 font-raleway select-none">
      {CARDS.map(({ key, icon: Icon }) => {
        const kpi = kpis?.[key];
        const path = sparklinePath(kpi?.sparkline);
        return (
          <div
            key={key}
            className="p-5 rounded-xl bg-[#0C0F10] border border-[#1B2227] hover:border-[#2E3A45] transition-all flex flex-col justify-between relative overflow-hidden group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#718090]">{kpi?.label ?? TITLES[key]}</span>
              <Icon className="w-4 h-4 text-[#5B6675] group-hover:text-white transition-colors" />
            </div>

            <div className="flex items-end justify-between mt-3 mb-1">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none">
                  {kpi ? kpi.value : isLoading ? "…" : "—"}
                </span>
                <div className="mt-2.5 min-h-4">
                  {kpi?.growth && <span className="text-xs font-semibold text-[#10B981]">{kpi.growth}</span>}
                  {isError && <span className="text-xs text-[#EF4444]">Could not load</span>}
                </div>
              </div>

              {path && (
                <div className="w-24 sm:w-28 h-9 shrink-0">
                  <svg viewBox="0 0 200 35" className="w-full h-full overflow-visible" fill="none">
                    <defs>
                      <linearGradient id={`spark-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={`${path} L200,35 L0,35 Z`} fill={`url(#spark-${key})`} />
                    <path d={path} stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
