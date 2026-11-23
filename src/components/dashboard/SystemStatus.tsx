"use client";

import React from "react";
import { Server, AlertTriangle } from "lucide-react";
import { useSystemStatus } from "./hooks/useDashboard";

interface ServiceStatus {
  name: string;
  status: string;
  latency?: string;
}

export default function SystemStatus() {
  const { data, isLoading, isError } = useSystemStatus();
  const services: ServiceStatus[] = data?.services ?? [];
  const isOk = (s: ServiceStatus) => s.status.toLowerCase() === "connected";
  const degradedCount = services.filter((s) => !isOk(s)).length;

  return (
    <div className="p-5 sm:p-6 rounded-xl bg-[#0C0F10] border border-[#1B2227] font-raleway h-full flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[#E7C042]" />
            <h3 className="text-base font-bold text-white tracking-tight">System status</h3>
          </div>

          {services.length > 0 &&
            (degradedCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-md bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-xs font-semibold text-[#F59E0B] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                {degradedCount} service{degradedCount > 1 ? "s" : ""} degraded
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-md bg-[#0E2922] border border-[#10B981]/30 text-xs font-semibold text-[#10B981] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                All systems normal
              </span>
            ))}
        </div>

        {services.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#718090]">
            {isLoading ? "Checking services…" : isError ? "Could not load system status." : "No services reported."}
          </div>
        ) : (
          <div className="divide-y divide-[#1B2227]">
            {services.map((item) => (
              <div key={item.name} className="py-3 flex items-center justify-between gap-4 text-xs sm:text-sm">
                <span className="font-semibold text-white tracking-tight">{item.name}</span>
                <div className="flex items-center gap-3">
                  {isOk(item) ? (
                    <span className="px-2 py-0.5 rounded-md bg-[#0E2922] border border-[#10B981]/30 text-xs font-semibold text-[#10B981] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      Connected
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-xs font-semibold text-[#F59E0B] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                      {item.status}
                    </span>
                  )}
                  <span className="text-xs text-[#5B6675] font-nunito w-14 text-right">{item.latency ?? "—"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {data?.notice?.message && (
        <div className="mt-4 p-3 rounded-lg bg-[#D7A43A]/10 border border-[#D7A43A]/20 flex items-start gap-2.5 text-xs text-[#D1D5DB]">
          <AlertTriangle className="w-4 h-4 text-[#E7C042] shrink-0 mt-0.5" />
          <span className="leading-relaxed">{data.notice.message}</span>
        </div>
      )}
    </div>
  );
}
