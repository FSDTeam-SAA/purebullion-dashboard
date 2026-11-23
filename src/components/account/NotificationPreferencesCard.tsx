"use client";

import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from "./hooks/useAccount";

interface ToggleItem {
  id: string;
  key: string;
  label: string;
  enabled: boolean;
}

const initialToggles: ToggleItem[] = [
  { id: "new-signals", key: "newSignals", label: "New signals", enabled: false },
  { id: "signal-closed-1", key: "signalProximity", label: "Signal proximity", enabled: false },
  { id: "signal-closed-2", key: "signalClosed", label: "Signal closed", enabled: false },
  { id: "market-condition", key: "marketConditionChange", label: "Market condition change", enabled: false },
  { id: "watchlist-movers", key: "watchlistMovers", label: "Watchlist movers", enabled: false },
  { id: "community-replies", key: "communityReplies", label: "Community replies", enabled: false },
  { id: "daily-briefing", key: "dailyBriefingEmail", label: "Daily briefing email", enabled: false },
  { id: "weekly-wrap", key: "weeklyWrapEmail", label: "Weekly wrap email", enabled: false },
];

export default function NotificationPreferencesCard() {
  const { data: prefData } = useNotificationPreferences();
  const updatePrefMutation = useUpdateNotificationPreferences();

  const [toggles, setToggles] = useState<ToggleItem[]>(initialToggles);

  useEffect(() => {
    if (prefData?.toggles) {
      setToggles((prev) =>
        prev.map((t) => ({
          ...t,
          enabled: prefData.toggles[t.key as keyof typeof prefData.toggles] ?? t.enabled,
        }))
      );
    }
  }, [prefData]);

  const handleToggle = (id: string) => {
    if (!prefData) return;
    const next = toggles.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t));
    setToggles(next);

    const togglesPayload: Record<string, boolean> = {};
    next.forEach((item) => {
      togglesPayload[item.key] = item.enabled;
    });

    updatePrefMutation.mutate({
      toggles: togglesPayload as any,
    });
  };

  return (
    <div className="p-5 sm:p-6 lg:p-7 rounded-xl bg-[#0C0F10] border border-[#1B2227] font-raleway shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#1B2227]">
        <div>
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-[#E7C042]" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Notification preferences
            </h3>
          </div>
          <p className="text-xs text-[#8E9CA8] font-nunito mt-1">
            The same controls appear on the Alerts screen.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="px-2.5 py-1 rounded-md bg-[#182026] border border-[#2B353E] text-xs font-medium text-[#718090]">
            2 Today
          </span>
          <button
            type="button"
            className="text-xs text-[#8E9CA8] hover:text-[#E7C042] transition-colors font-medium"
          >
            View all →
          </button>
        </div>
      </div>

      {/* 2-Column Grid of Toggle Switches */}
      <div className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {toggles.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-lg bg-[#121719]/40 border border-[#1B2227] hover:border-[#2B353E] transition-all"
          >
            <span className="text-sm font-semibold text-white tracking-tight">
              {item.label}
            </span>

            {/* Custom Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={item.enabled}
              onClick={() => handleToggle(item.id)}
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out focus:outline-none",
                item.enabled
                  ? "bg-[#E7C042] border-[#E7C042]"
                  : "bg-[#182026] border-[#2B353E]"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full shadow-sm ring-0 transition duration-200 ease-in-out mt-[2px]",
                  item.enabled
                    ? "translate-x-4.5 bg-black"
                    : "translate-x-0.5 bg-[#8E9CA8]"
                )}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
