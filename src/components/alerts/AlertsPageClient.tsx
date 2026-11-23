"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import TablePagination, { PageMeta } from "@/components/shared/TablePagination";
import { useDebouncedValue } from "@/components/shared/useDebouncedValue";
import { usePage } from "@/components/shared/usePage";
import { useAlertHistory, useAlertTemplates } from "./hooks/useAlerts";

const filters = ["All", "Notification History", "Templates"] as const;
type Filter = (typeof filters)[number];
const TAB_PARAM: Record<Filter, string> = {
  All: "all",
  "Notification History": "notification-history",
  Templates: "templates",
};

type AlertRow = {
  id: string;
  type: string;
  recipient: string;
  channel: string;
  status: "Active" | "Suspended";
  sent: string;
  delivered: string;
  read: string;
};

const PAGE_SIZE = 10;

export default function AlertsPageClient() {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const search = useDebouncedValue(query.trim());

  const [page, setPage] = usePage(`${filter}|${search}`);

  const isTemplates = filter === "Templates";
  const history = useAlertHistory({
    tab: TAB_PARAM[filter],
    search: search || undefined,
    page,
    limit: PAGE_SIZE,
  });
  const templates = useAlertTemplates();

  const body = history.data?.data;
  const meta: PageMeta | undefined = history.data?.meta;

  const rows: AlertRow[] = (body?.logs ?? []).map((l: any) => ({
    id: String(l._id),
    type: l.type ?? "—",
    recipient: l.recipient ?? "—",
    channel: l.channel ?? "—",
    status: l.status === "suspended" ? "Suspended" : "Active",
    sent: l.timeAgo ?? "—",
    delivered: l.delivered != null ? String(l.delivered) : "—",
    read: l.read != null ? String(l.read) : "—",
  }));

  const templateRows: any[] = (Array.isArray(templates.data) ? templates.data : []).filter((t: any) =>
    `${t.title ?? ""} ${t.content ?? ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const isLoading = isTemplates ? templates.isLoading : history.isLoading;
  const isError = isTemplates ? templates.isError : history.isError;
  const total = meta?.total;

  return (
    <div className="space-y-5 pb-8 font-raleway">
      <section className="overflow-hidden rounded-xl border border-[#1B2227] bg-[#0C0F10] shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#1B2227] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-[#101619] p-1">
            {filters.map((item) => (
              <button key={item} onClick={() => setFilter(item)} className={cn("rounded-md px-3 py-1.5 text-xs font-semibold transition-all", filter === item ? "tab-gold-active text-white shadow-xs" : "text-[#8E9CA8] hover:bg-white/5 hover:text-white")}>
                {item}
              </button>
            ))}
          </div>
          <label className="flex w-full items-center gap-2 rounded-lg border border-[#1B2227] bg-[#0C0F10] px-3 py-2 text-xs transition-all focus-within:border-[#E7C042]/70 lg:w-64">
            <Search className="h-4 w-4 text-[#5B6675]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-[#5B6675]" />
          </label>
        </div>

        {!isTemplates && (
          <div className="grid gap-4 border-b border-[#1B2227] p-4 md:grid-cols-3">
            <Metric title="Total notifications" value={total !== undefined ? total.toLocaleString() : "—"} />
            <Metric title="Active on this page" value={isLoading ? "—" : String(rows.filter((r) => r.status === "Active").length)} />
            <Metric title="Suspended on this page" value={isLoading ? "—" : String(rows.filter((r) => r.status === "Suspended").length)} />
          </div>
        )}

        <div className="overflow-x-auto">
          {isTemplates ? (
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#1B2227] bg-[#171D1F] text-[11px] font-bold uppercase tracking-wider text-[#8E9CA8]">
                  {["Title", "Content", "Category", "Channel"].map((h) => <th key={h} className="px-4 py-3.5 sm:px-6">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2227] text-xs sm:text-sm">
                {templateRows.length ? templateRows.map((t) => (
                  <tr key={t._id} className="hover:bg-[#121719]/60">
                    <td className="px-4 py-4 font-bold text-white sm:px-6">{t.title}</td>
                    <td className="max-w-[360px] truncate px-4 py-4 font-nunito text-[#8E9CA8] sm:px-6">{t.content}</td>
                    <td className="px-4 py-4 text-[#D1D5DB] sm:px-6">{t.category ?? "—"}</td>
                    <td className="px-4 py-4 text-[#D1D5DB] sm:px-6">{t.channel ?? "—"}</td>
                  </tr>
                )) : <EmptyRow cols={4} loading={isLoading} error={isError} what="templates" />}
              </tbody>
            </table>
          ) : (
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#1B2227] bg-[#171D1F] text-[11px] font-bold uppercase tracking-wider text-[#8E9CA8]">
                  {["Type", "Recipient", "Channel", "Status", "Sent", "Delivered", "Read"].map((h) => <th key={h} className="px-4 py-3.5 sm:px-6">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2227] text-xs sm:text-sm">
                {rows.length ? rows.map((a) => (
                  <tr key={a.id} className="transition-colors hover:bg-[#121719]/60">
                    <td className="whitespace-nowrap px-4 py-4 font-bold text-white sm:px-6">{a.type}</td>
                    <td className="whitespace-nowrap px-4 py-4 font-nunito text-[#8E9CA8] sm:px-6">{a.recipient}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-[#D1D5DB] sm:px-6">{a.channel}</td>
                    <td className="whitespace-nowrap px-4 py-4 sm:px-6"><Status status={a.status} /></td>
                    <td className="whitespace-nowrap px-4 py-4 text-[#8E9CA8] sm:px-6">{a.sent}</td>
                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-white sm:px-6">{a.delivered}</td>
                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-white sm:px-6">{a.read}</td>
                  </tr>
                )) : <EmptyRow cols={7} loading={isLoading} error={isError} what="alerts" />}
              </tbody>
            </table>
          )}
        </div>
        {!isTemplates && <TablePagination meta={meta} onPageChange={setPage} />}
      </section>
    </div>
  );
}

function EmptyRow({ cols, loading, error, what }: { cols: number; loading: boolean; error: boolean; what: string }) {
  return (
    <tr>
      <td colSpan={cols} className="py-12 text-center text-sm text-[#718090]">
        {loading ? `Loading ${what}…` : error ? `Could not load ${what}.` : `No ${what} found.`}
      </td>
    </tr>
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
function Status({ status }: { status: AlertRow["status"] }) {
  const styles = {
    Active: "border-[#10B981]/30 bg-[#0E2922] text-[#10B981]",
    Suspended: "border-[#EF4444]/30 bg-[#2E1417] text-[#EF4444]",
  };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold", styles[status])}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span>;
}
