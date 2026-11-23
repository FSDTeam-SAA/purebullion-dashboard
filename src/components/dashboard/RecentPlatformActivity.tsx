"use client";

import React from "react";
import { Activity } from "lucide-react";
import { useRecentPlatformActivity } from "./hooks/useDashboard";

interface ActivityItem {
  _id: string;
  actorName: string;
  detail: string;
  timeAgo: string;
}

export default function RecentPlatformActivity() {
  const { data, isLoading, isError } = useRecentPlatformActivity({ page: 1, limit: 5 });
  const items: ActivityItem[] = data?.items ?? [];

  return (
    <div className="p-5 sm:p-6 rounded-xl bg-[#0C0F10] border border-[#1B2227] font-raleway h-full flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-[#E7C042]" />
          <h3 className="text-base font-bold text-white tracking-tight">Recent platform activity</h3>
        </div>

        {items.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#718090]">
            {isLoading ? "Loading activity…" : isError ? "Could not load activity." : "No platform activity yet."}
          </div>
        ) : (
          <div className="divide-y divide-[#1B2227]">
            {items.map((item) => (
              <div key={item._id} className="py-3.5 flex items-center justify-between gap-4 px-2">
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{item.actorName}</div>
                  <div className="text-xs text-[#8E9CA8] truncate">{item.detail}</div>
                </div>
                <span className="text-xs text-[#5B6675] font-nunito shrink-0">{item.timeAgo}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
