"use client";

import React from "react";
import { Users, Crown, Activity, Bell } from "lucide-react";
import { useDashboardKpis } from "./hooks/useDashboard";

interface StatItem {
  id: string;
  title: string;
  value: string;
  changeBadge?: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  sparklinePath: string;
}

const defaultStats: StatItem[] = [
  {
    id: "total-users",
    title: "Total Users",
    value: "12,482",
    changeBadge: "+ 8.4% this month",
    icon: Users,
    sparklinePath: "M0,28 Q20,25 35,28 T70,20 T105,22 T140,10 T175,12 T200,2",
  },
  {
    id: "subscription-revenue",
    title: "Subscription Revenue",
    value: "$102,400",
    changeBadge: "+ 8.4% this month",
    icon: Crown,
    sparklinePath: "M0,26 Q25,28 45,22 T90,24 T135,16 T170,18 T200,4",
  },
  {
    id: "active-signals",
    title: "Active Signals",
    value: "24",
    subtitle: "published to members",
    icon: Activity,
    sparklinePath: "M0,25 Q30,22 55,26 T100,18 T145,20 T175,10 T200,2",
  },
  {
    id: "open-alerts",
    title: "Open Alerts",
    value: "142",
    subtitle: "across all platform",
    icon: Bell,
    sparklinePath: "M0,28 Q25,24 50,26 T95,20 T140,22 T170,12 T200,3",
  },
];

export default function StatCards() {
  const { data: kpis } = useDashboardKpis();

  const stats = defaultStats.map((stat) => {
    if (!kpis) return stat;
    const kpiData = kpis as any;
    if (stat.id === "total-users" && kpiData.totalUsers) {
      return {
        ...stat,
        value: String(kpiData.totalUsers.value ?? stat.value),
        changeBadge: kpiData.totalUsers.growth || kpiData.totalUsers.change || stat.changeBadge,
      };
    }
    if (stat.id === "subscription-revenue" && kpiData.subscriptionRevenue) {
      return {
        ...stat,
        value: String(kpiData.subscriptionRevenue.value ?? stat.value),
        changeBadge: kpiData.subscriptionRevenue.growth || kpiData.subscriptionRevenue.change || stat.changeBadge,
      };
    }
    if (stat.id === "active-signals" && kpiData.activeSignals) {
      return {
        ...stat,
        value: String(kpiData.activeSignals.value ?? stat.value),
        subtitle: kpiData.activeSignals.subtitle || stat.subtitle,
      };
    }
    if (stat.id === "open-alerts" && kpiData.openAlerts) {
      return {
        ...stat,
        value: String(kpiData.openAlerts.value ?? stat.value),
        subtitle: kpiData.openAlerts.subtitle || stat.subtitle,
      };
    }
    return stat;
  });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 font-raleway select-none">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.id}
            className="p-5 rounded-xl bg-[#0C0F10] border border-[#1B2227] hover:border-[#2E3A45] transition-all flex flex-col justify-between relative overflow-hidden group shadow-xs"
          >
            {/* Top row: Title and Icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#718090]">
                {stat.title}
              </span>
              <Icon className="w-4 h-4 text-[#5B6675] group-hover:text-white transition-colors" />
            </div>

            {/* Middle row: Big Value & Sparkline */}
            <div className="flex items-end justify-between mt-3 mb-1">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none">
                  {stat.value}
                </span>

                <div className="mt-2.5">
                  {stat.changeBadge && (
                    <span className="text-xs font-semibold text-[#10B981]">
                      {stat.changeBadge}
                    </span>
                  )}
                  {stat.subtitle && (
                    <span className="text-xs text-[#718090] font-normal">
                      {stat.subtitle}
                    </span>
                  )}
                </div>
              </div>

              {/* Sparkline Graphic */}
              <div className="w-24 sm:w-28 h-9 shrink-0">
                <svg
                  viewBox="0 0 200 35"
                  className="w-full h-full overflow-visible"
                  fill="none"
                >
                  <defs>
                    <linearGradient
                      id={`spark-${stat.id}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Gradient area */}
                  <path
                    d={`${stat.sparklinePath} L200,35 L0,35 Z`}
                    fill={`url(#spark-${stat.id})`}
                  />

                  {/* Stroke wave */}
                  <path
                    d={stat.sparklinePath}
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
