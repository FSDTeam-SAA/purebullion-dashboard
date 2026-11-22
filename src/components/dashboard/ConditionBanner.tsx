"use client";

import React from "react";
import { useMarketConditions } from "./hooks/useDashboard";

export default function ConditionBanner() {
  const { data: conditions } = useMarketConditions();

  const status = conditions?.status || "Risk-On";
  const title = (conditions as any)?.summary || conditions?.regime || "Conditions favour long setups";
  const description =
    conditions?.description ||
    "Breadth 2.1:1 · index trend intact above the 50-day · VIX 14.62, contained. The model is permitted to publish long and short signals; short publication threshold is raised.";
  const score = conditions?.score ?? 72;

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#0C0F10] border border-[#1B2227] flex flex-col md:flex-row md:items-center justify-between gap-4 font-raleway shadow-xs">
      {/* Left side: Badge & Text */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-4 min-w-0">
        {/* Risk-On pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E2922] border border-[#10B981]/40 text-[#10B981] text-xs font-semibold shrink-0 w-fit">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>{status}</span>
        </div>

        {/* Headline & details */}
        <div className="flex flex-col text-left min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
            {title}
          </h2>
          <p className="text-xs text-[#718090] mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Right side: Condition score */}
      <div className="flex flex-col items-start md:items-end shrink-0 pl-1 md:pl-4 border-t md:border-t-0 md:border-l border-[#1B2227] pt-2 md:pt-0">
        <span className="text-[11px] font-medium text-[#718090] tracking-wider uppercase">
          Condition score
        </span>
        <span className="text-2xl sm:text-3xl font-extrabold text-[#E7C042] leading-none mt-1">
          {score}
        </span>
      </div>
    </div>
  );
}
