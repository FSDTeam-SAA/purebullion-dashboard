import React from "react";
import DateRangeExport from "@/components/dashboard/DateRangeExport";
import StatCards from "@/components/dashboard/StatCards";
import ConditionBanner from "@/components/dashboard/ConditionBanner";
import UserGrowthChart from "@/components/dashboard/UserGrowthChart";
import RevenueOverviewChart from "@/components/dashboard/RevenueOverviewChart";
import PaidPlanPerformance from "@/components/dashboard/PaidPlanPerformance";
import RecentPlatformActivity from "@/components/dashboard/RecentPlatformActivity";
import SystemStatus from "@/components/dashboard/SystemStatus";

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6 pb-12 font-raleway">
      {/* Top Controls: Date range filter & Export button */}
      <DateRangeExport />

      {/* Row 1: Key Metric Cards (Total Users, Subscription Revenue, Active Signals, Open Alerts) */}
      <StatCards />

      {/* Row 2: Condition / Risk-On Banner */}
      <ConditionBanner />

      {/* Row 3: Charts (User Growth & Revenue Overview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <UserGrowthChart />
        </div>
        <div className="lg:col-span-4">
          <RevenueOverviewChart />
        </div>
      </div>

      {/* Row 4: Paid Plan Performance */}
      <PaidPlanPerformance />

      {/* Row 5: Recent Platform Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <RecentPlatformActivity />
        <SystemStatus />
      </div>
    </div>
  );
}
