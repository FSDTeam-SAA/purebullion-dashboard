"use client";

import React from "react";
import { Server, AlertTriangle } from "lucide-react";
import { useSystemStatus } from "./hooks/useDashboard";

interface ServiceStatus {
  name: string;
  status: "Connected" | "Degraded" | "Offline";
  latency: string;
}

const defaultServices: ServiceStatus[] = [
  { name: "Market data", status: "Connected", latency: "42 ms" },
  { name: "AI service", status: "Connected", latency: "61 ms" },
  { name: "News feed", status: "Degraded", latency: "184 ms" },
  { name: "Payment service", status: "Connected", latency: "89 ms" },
  { name: "Email / notifications", status: "Connected", latency: "97 ms" },
];

export default function SystemStatus() {
  const { data: statusResult } = useSystemStatus();

  const services: ServiceStatus[] = (statusResult as any)?.services?.length
    ? (statusResult as any).services.map((s: any) => ({
        name: s.name,
        status: (s.status === "degraded" ? "Degraded" : s.status === "offline" ? "Offline" : "Connected") as ServiceStatus["status"],
        latency: s.latency || "42 ms",
      }))
    : defaultServices;

  const degradedCount = services.filter((s: ServiceStatus) => s.status === "Degraded" || s.status === "Offline").length;
  return (
    <div className="p-5 sm:p-6 rounded-xl bg-[#0C0F10] border border-[#1B2227] font-raleway h-full flex flex-col justify-between shadow-xs">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[#E7C042]" />
            <h3 className="text-base font-bold text-white tracking-tight">
              System status
            </h3>
          </div>

          {degradedCount > 0 ? (
            <span className="px-2.5 py-0.5 rounded-md bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-xs font-semibold text-[#F59E0B] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
              {degradedCount} service{degradedCount > 1 ? "s" : ""} degraded
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-md bg-[#0E2922] border border-[#10B981]/30 text-xs font-semibold text-[#10B981] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              All systems normal
            </span>
          )}
        </div>

        {/* Services List */}
        <div className="divide-y divide-[#1B2227]">
          {services.map((item: ServiceStatus) => (
            <div
              key={item.name}
              className="py-3 flex items-center justify-between gap-4 text-xs sm:text-sm"
            >
              <span className="font-semibold text-white tracking-tight">
                {item.name}
              </span>

              <div className="flex items-center gap-3">
                {item.status === "Connected" ? (
                  <span className="px-2 py-0.5 rounded-md bg-[#0E2922] border border-[#10B981]/30 text-xs font-semibold text-[#10B981] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    Connected
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-xs font-semibold text-[#F59E0B] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                    Degraded
                  </span>
                )}
                <span className="text-xs text-[#5B6675] font-nunito w-12 text-right">
                  {item.latency}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Callout Box */}
      <div className="mt-4 p-3 rounded-lg bg-[#D7A43A]/10 border border-[#D7A43A]/20 flex items-start gap-2.5 text-xs text-[#D1D5DB]">
        <AlertTriangle className="w-4 h-4 text-[#E7C042] shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          News feed latency is elevated. No interruption to member services.
        </span>
      </div>
    </div>
  );
}
