"use client";

import React from "react";
import Link from "next/link";
import { Activity, ChevronRight } from "lucide-react";

interface ActivityItem {
  id: string;
  name: string;
  action: string;
  time: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    name: "Liam Morgan",
    action: "subscription activated · Plan B",
    time: "2 min ago",
  },
  {
    id: "2",
    name: "Amara Cole",
    action: "subscription activated · Plan B",
    time: "14 min ago",
  },
  {
    id: "3",
    name: "Signal Engine",
    action: "subscription activated · Plan B",
    time: "32 min ago",
  },
  {
    id: "4",
    name: "Moderation",
    action: "subscription activated · Plan B",
    time: "1 hr ago",
  },
  {
    id: "5",
    name: "Moderation",
    action: "subscription activated · Plan B",
    time: "1 hr ago",
  },
];

export default function RecentPlatformActivity() {
  return (
    <div className="p-5 sm:p-6 rounded-xl bg-[#0C0F10] border border-[#1B2227] font-raleway h-full flex flex-col justify-between shadow-xs">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#E7C042]" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Recent platform activity
            </h3>
          </div>

          <Link
            href="/dashboard/activity"
            className="text-xs text-[#8E9CA8] hover:text-[#E7C042] transition-colors font-medium"
          >
            View audit trail →
          </Link>
        </div>

        {/* Activity List */}
        <div className="divide-y divide-[#1B2227]">
          {activities.map((item) => (
            <div
              key={item.id}
              className="py-3.5 flex items-center justify-between gap-4 hover:bg-[#121719]/40 px-2 rounded-lg transition-colors cursor-pointer group"
            >
              <div className="min-w-0">
                <div className="text-sm font-bold text-white group-hover:text-[#E7C042] transition-colors truncate">
                  {item.name}
                </div>
                <div className="text-xs text-[#8E9CA8] truncate">
                  {item.action}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-[#5B6675] font-nunito">
                  {item.time}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#414E59] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
