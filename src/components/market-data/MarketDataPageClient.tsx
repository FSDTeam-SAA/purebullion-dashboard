"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useMarketDataIntegrations,
  useMarketDataStats,
} from "./hooks/useMarketData";

const filters = ["All", "Market Data", "News Feed", "AI", "Payments", "Email"] as const;
type Category = (typeof filters)[number];
type Service = { id: number | string; service: Exclude<Category, "All">; provider: string; connection: "Active" | "Suspended"; sync: string; dataStatus: string; latency: string; errors: string };
const defaultServices: Service[] = [
  { id: 1, service: "Market Data", provider: "Primary data provider", connection: "Active", sync: "18 sec ago", dataStatus: "Live", latency: "42 ms", errors: "None" },
  { id: 2, service: "Market Data", provider: "Primary data provider", connection: "Suspended", sync: "18 sec ago", dataStatus: "Live", latency: "42 ms", errors: "None" },
  { id: 3, service: "News Feed", provider: "News aggregation service", connection: "Active", sync: "18 sec ago", dataStatus: "Live", latency: "38 ms", errors: "None" },
  { id: 4, service: "AI", provider: "AI intelligence service", connection: "Active", sync: "12 sec ago", dataStatus: "Live", latency: "84 ms", errors: "None" },
  { id: 5, service: "Payments", provider: "Payment processor", connection: "Active", sync: "1 min ago", dataStatus: "Live", latency: "61 ms", errors: "None" },
  { id: 6, service: "Email", provider: "Email delivery provider", connection: "Suspended", sync: "3 min ago", dataStatus: "Delayed", latency: "42 ms", errors: "3" },
  { id: 7, service: "Market Data", provider: "Primary data provider", connection: "Active", sync: "18 sec ago", dataStatus: "Live", latency: "42 ms", errors: "None" },
  { id: 8, service: "News Feed", provider: "News aggregation service", connection: "Active", sync: "28 sec ago", dataStatus: "Live", latency: "38 ms", errors: "None" },
  { id: 9, service: "Market Data", provider: "Primary data provider", connection: "Active", sync: "18 sec ago", dataStatus: "Live", latency: "42 ms", errors: "None" },
];

export default function MarketDataPageClient() {
  const { data: integrationsData } = useMarketDataIntegrations();
  const { data: statsData } = useMarketDataStats();

  const [filter, setFilter] = useState<Category>("All");
  const [query, setQuery] = useState("");

  const serviceList: Service[] = useMemo(() => {
    if (integrationsData?.integrations && integrationsData.integrations.length > 0) {
      return integrationsData.integrations.map((item: any, idx: number) => ({
        id: item._id || item.id || idx + 1,
        service: (item.service || item.name || "Market Data") as Exclude<Category, "All">,
        provider: item.provider || item.description || "Primary provider",
        connection: (item.status === "suspended" ? "Suspended" : "Active") as Service["connection"],
        sync: item.lastSync ? new Date(item.lastSync).toLocaleTimeString() : "18 sec ago",
        dataStatus: item.dataStatus || "Live",
        latency: item.latency || "42 ms",
        errors: item.errorsToday ? String(item.errorsToday) : "None",
      }));
    }
    return defaultServices;
  }, [integrationsData]);

  const visible = useMemo(() => serviceList.filter((item: Service) => (filter === "All" || item.service === filter) && `${item.service} ${item.provider}`.toLowerCase().includes(query.toLowerCase())), [serviceList, filter, query]);

  const connectedCount = statsData?.connectedServices || "5 of 6";
  const avgLatency = statsData?.averageLatency || "84 ms";
  const errorsToday = statsData?.errorsToday !== undefined ? String(statsData.errorsToday) : "3";

  return <div className="space-y-5 pb-8 font-raleway">
    <section className="overflow-hidden rounded-xl border border-[#1B2227] bg-[#0C0F10] shadow-sm">
      <div className="flex flex-col gap-4 border-b border-[#1B2227] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between"><div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-[#101619] p-1">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={cn("rounded-md px-3 py-1.5 text-xs font-semibold transition-all", filter === item ? "tab-gold-active text-white shadow-xs" : "text-[#8E9CA8] hover:bg-white/5 hover:text-white")}>{item}</button>)}</div><label className="flex w-full items-center gap-2 rounded-lg border border-[#1B2227] bg-[#0C0F10] px-3 py-2 text-xs transition-all focus-within:border-[#E7C042]/70 lg:w-64"><Search className="h-4 w-4 text-[#5B6675]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search..." className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-[#5B6675]" /><kbd className="rounded border border-[#2B353E] bg-[#182026] px-1.5 py-0.5 text-[10px] text-[#8E9CA8]">⌘K</kbd></label></div>
      <div className="grid gap-4 border-b border-[#1B2227] p-4 md:grid-cols-3"><Metric title="Connected services" value={connectedCount} /><Metric title="Average latency" value={avgLatency} /><Metric title="Errors today" value={errorsToday} /></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[960px] border-collapse text-left"><thead><tr className="border-b border-[#1B2227] bg-[#171D1F] text-[11px] font-bold uppercase tracking-wider text-[#8E9CA8]">{["Service", "Provider", "Connection", "Last sync", "Data status", "Latency", "Recent errors"].map((head) => <th key={head} className="px-4 py-3.5 sm:px-6">{head}</th>)}</tr></thead><tbody className="divide-y divide-[#1B2227] text-xs sm:text-sm">{visible.length ? visible.map((item: Service) => <tr key={item.id} className="transition-colors hover:bg-[#121719]/60"><td className="whitespace-nowrap px-4 py-4 font-bold text-white sm:px-6">{item.service}</td><td className="whitespace-nowrap px-4 py-4 font-nunito text-[#8E9CA8] sm:px-6">{item.provider}</td><td className="whitespace-nowrap px-4 py-4 sm:px-6"><ConnectionBadge status={item.connection} /></td><td className="whitespace-nowrap px-4 py-4 font-nunito text-[#8E9CA8] sm:px-6">{item.sync}</td><td className="whitespace-nowrap px-4 py-4 text-[#D1D5DB] sm:px-6">{item.dataStatus}</td><td className="whitespace-nowrap px-4 py-4 text-[#8E9CA8] sm:px-6">{item.latency}</td><td className="whitespace-nowrap px-4 py-4 text-[#8E9CA8] sm:px-6">{item.errors}</td></tr>) : <tr><td colSpan={7} className="py-12 text-center text-sm text-[#718090]">No services found matching your search.</td></tr>}</tbody></table></div>
      <footer className="flex flex-col items-center justify-between gap-4 border-t border-[#1B2227] p-4 text-xs sm:flex-row sm:px-6"><span className="text-[#8E9CA8]">Showing <b className="text-white">1</b> to <b className="text-white">{visible.length}</b> of <b className="text-white">120</b> results</span><div className="flex items-center gap-1.5"><button className="rounded-md p-1.5 text-[#5B6675]"><ChevronLeft className="h-4 w-4" /></button><button className="tab-gold-active flex h-7 w-7 items-center justify-center rounded-md font-bold text-white">1</button>{[2, 3].map((page) => <button key={page} className="flex h-7 w-7 items-center justify-center rounded-md font-medium text-[#8E9CA8] hover:bg-[#182026] hover:text-white">{page}</button>)}<span className="px-1 text-[#5B6675]">…</span><button className="flex h-7 w-7 items-center justify-center rounded-md font-medium text-[#8E9CA8] hover:bg-[#182026] hover:text-white">17</button><button className="rounded-md p-1.5 text-[#8E9CA8] hover:bg-[#182026] hover:text-white"><ChevronRight className="h-4 w-4" /></button></div></footer>
    </section>
  </div>;
}
function Metric({ title, value }: { title: string; value: string }) { return <article className="rounded-lg border-l border-[#A48226] bg-[#050708] p-4"><p className="text-xs font-medium text-[#D1D5DB]">{title}</p><div className="mt-2 flex items-center justify-between"><strong className="text-2xl text-white">{value}</strong><span className="rounded bg-emerald-500/10 px-1.5 py-1 text-xs text-emerald-400">+ 8.4</span></div></article>; }
function ConnectionBadge({ status }: { status: Service["connection"] }) { const active = status === "Active"; return <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold", active ? "border-[#10B981]/30 bg-[#0E2922] text-[#10B981]" : "border-[#EF4444]/30 bg-[#2E1417] text-[#EF4444]")}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span>; }
