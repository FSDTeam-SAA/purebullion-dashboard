"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

const ranges = ["Today", "7 Days", "30 Days", "90 Days", "Custom"];

export default function DateRangeExport() {
  const [selectedRange, setSelectedRange] = useState("30 Days");

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3 font-raleway select-none">
      {/* Date Filter Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0C0F10] border border-[#1B2227]">
        {ranges.map((range) => {
          const isSelected = selectedRange === range;
          return (
            <button
              key={range}
              type="button"
              onClick={() => setSelectedRange(range)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer",
                isSelected
                  ? "bg-[#182026] text-white shadow-xs font-semibold"
                  : "text-[#718090] hover:text-white hover:bg-white/5"
              )}
            >
              {range}
            </button>
          );
        })}
      </div>

      {/* Gold Export Button */}
      <button
        type="button"
        onClick={() => {}}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gold-gradient-btn text-black text-xs font-semibold shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Export</span>
      </button>
    </div>
  );
}
