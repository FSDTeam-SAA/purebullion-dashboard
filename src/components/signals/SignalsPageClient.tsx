"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import TablePagination, { PageMeta } from "@/components/shared/TablePagination";
import { useDebouncedValue } from "@/components/shared/useDebouncedValue";
import { usePage } from "@/components/shared/usePage";
import { useSignals } from "./hooks/useSignals";

const filters = ["All", "Performance", "Archived"] as const;
type Filter = (typeof filters)[number];
type Row = {
  id: string;
  signalId: string;
  ticker: string;
  company: string;
  direction: string;
  entry: string;
  target: string;
  status: string;
  performance: string;
  source: string;
};

const PAGE_SIZE = 10;

export default function SignalsPageClient() {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const search = useDebouncedValue(query.trim());

  const [page, setPage] = usePage(`${filter}|${search}`);

  const { data, isLoading, isError } = useSignals({
    tab: filter.toLowerCase(),
    search: search || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const meta: PageMeta | undefined = data?.meta;
  const rows: Row[] = (data?.data?.signals ?? []).map((s: any) => ({
    id: String(s._id),
    signalId: s.signalId ?? "—",
    ticker: s.ticker ?? "—",
    company: s.company ?? "—",
    direction: s.direction ?? "—",
    entry: s.entry ?? "—",
    target: s.target ?? "—",
    status: s.status ?? "—",
    performance: s.performance ?? "—",
    source: s.source ?? "—",
  }));

  return (
    <div className="space-y-5 pb-8 font-raleway">
      <section className="overflow-hidden rounded-xl border border-[#1B2227] bg-[#0C0F10] shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#1B2227] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-[#101619] p-1">
            {filters.map((item) => (
              <button key={item} onClick={() => setFilter(item)} className={cn("rounded-md px-3 py-1.5 text-xs font-semibold transition-all", filter === item ? "tab-gold-active text-white shadow-xs" : "text-[#8E9CA8] hover:bg-white/5 hover:text-white")}>{item}</button>
            ))}
          </div>
          <label className="flex w-full items-center gap-2 rounded-lg border border-[#1B2227] bg-[#0C0F10] px-3 py-2 text-xs transition-all focus-within:border-[#E7C042]/70 lg:w-64">
            <Search className="h-4 w-4 text-[#5B6675]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search ticker, company or ID..." className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-[#5B6675]" />
          </label>
        </div>

        <div className="grid gap-4 border-b border-[#1B2227] p-4 md:grid-cols-3">
          <Metric title={`${filter} signals`} value={meta ? meta.total.toLocaleString() : "—"} />
          <Metric title="Active on this page" value={isLoading ? "—" : String(rows.filter((r) => r.status === "Active").length)} />
          <Metric title="Suspended on this page" value={isLoading ? "—" : String(rows.filter((r) => r.status === "Suspended").length)} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#1B2227] bg-[#171D1F] text-[11px] font-bold uppercase tracking-wider text-[#8E9CA8]">
                {["Signal ID", "Ticker", "Company", "Direction", "Entry", "Target", "Status", "Performance", "Source"].map((h) => <th key={h} className="px-4 py-3.5 sm:px-6">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2227] text-xs sm:text-sm">
              {rows.length ? rows.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-[#121719]/60">
                  <td className="whitespace-nowrap px-4 py-4 text-[#8E9CA8] sm:px-6">{s.signalId}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-bold text-white sm:px-6">{s.ticker}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-nunito text-[#8E9CA8] sm:px-6">{s.company}</td>
                  <td className={cn("whitespace-nowrap px-4 py-4 font-semibold sm:px-6", s.direction === "Long" ? "text-[#10B981]" : "text-[#EF4444]")}>{s.direction}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-[#D1D5DB] sm:px-6">{s.entry}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-[#D1D5DB] sm:px-6">{s.target}</td>
                  <td className="whitespace-nowrap px-4 py-4 sm:px-6"><Status status={s.status} /></td>
                  <td className={cn("whitespace-nowrap px-4 py-4 font-semibold sm:px-6", s.performance.startsWith("-") ? "text-[#EF4444]" : "text-[#10B981]")}>{s.performance}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-[#8E9CA8] sm:px-6">{s.source}</td>
                </tr>
              )) : (
                <tr><td colSpan={9} className="py-12 text-center text-sm text-[#718090]">{isLoading ? "Loading signals…" : isError ? "Could not load signals." : "No signals found."}</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <TablePagination meta={meta} onPageChange={setPage} />
      </section>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <article className="rounded-lg border-l border-[#A48226] bg-[#050708] p-4">
      <p className="text-xs font-medium text-[#D1D5DB]">{title}</p>
      <strong className="mt-2 block text-2xl text-white">{value}</strong>
    </article>
  );
}
function Status({ status }: { status: string }) {
  const suspended = status === "Suspended";
  return <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold", suspended ? "border-[#EF4444]/30 bg-[#2E1417] text-[#EF4444]" : "border-[#10B981]/30 bg-[#0E2922] text-[#10B981]")}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span>;
}
