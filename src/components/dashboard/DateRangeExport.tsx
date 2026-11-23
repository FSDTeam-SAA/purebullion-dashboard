"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DashboardTimeframe, useUIStore } from "@/store/ui.store";
import { getErrorMessage } from "@/services/apiClient";
import { dashboardApi } from "./api/dashboard.api";

const ranges: { label: string; value: DashboardTimeframe }[] = [
  { label: "Today", value: "today" },
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
];

export default function DateRangeExport() {
  const timeframe = useUIStore((s) => s.dashboardTimeframe);
  const setTimeframe = useUIStore((s) => s.setDashboardTimeframe);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const { filename, content } = await dashboardApi.exportCsv(timeframe);
      const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(getErrorMessage(err) || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3 font-raleway select-none">
      <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0C0F10] border border-[#1B2227]">
        {ranges.map((range) => {
          const isSelected = timeframe === range.value;
          return (
            <button
              key={range.value}
              type="button"
              onClick={() => setTimeframe(range.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer",
                isSelected ? "bg-[#182026] text-white shadow-xs font-semibold" : "text-[#718090] hover:text-white hover:bg-white/5"
              )}
            >
              {range.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleExport}
        disabled={exporting}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gold-gradient-btn text-black text-xs font-semibold shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>{exporting ? "Exporting…" : "Export"}</span>
      </button>
    </div>
  );
}
