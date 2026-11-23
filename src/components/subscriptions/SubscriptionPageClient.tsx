"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, CircleDollarSign, Eye, Plus, Search, Trash2, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import TablePagination, { PageMeta } from "@/components/shared/TablePagination";
import { useDebouncedValue } from "@/components/shared/useDebouncedValue";
import { usePage } from "@/components/shared/usePage";
import {
  useSubscribers,
  useSubscriptionStats,
  useSubscriptionPlans,
  useDeleteSubscriber,
  useCreatePlan,
  useUpdatePlan,
  useDeletePlan,
} from "./hooks/useSubscriptions";

type SubscriberStatus = "Active" | "Expired" | "Cancelled" | "Suspended";
type Subscriber = {
  id: string;
  name: string;
  company: string;
  plan: string;
  started: string;
  renewal: string;
  amount: string;
  status: SubscriberStatus;
};

const filters = ["All", "Active", "Suspended", "Expired", "Cancelled"] as const;
const PAGE_SIZE = 10;
const STATUS_LABEL: Record<string, SubscriberStatus> = {
  ACTIVE: "Active",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
  SUSPENDED: "Suspended",
};
const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function SubscriptionPageClient() {
  const [billing, setBilling] = useState("Monthly");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");
  const search = useDebouncedValue(query.trim());
  const [showAdd, setShowAdd] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingPlan, setEditingPlan] = useState<any | null>(null);

  const [page, setPage] = usePage(`${filter}|${search}`);

  const { data: stats } = useSubscriptionStats();
  const { data: plansData, isLoading: plansLoading } = useSubscriptionPlans();
  const { data: subscribersData, isLoading: subsLoading, isError: subsError } = useSubscribers({
    status: filter === "All" ? undefined : filter,
    search: search || undefined,
    page,
    limit: PAGE_SIZE,
  });
  const deleteMutation = useDeleteSubscriber();
  const deletePlanMutation = useDeletePlan();

  const meta: PageMeta | undefined = subscribersData?.meta;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const visible: Subscriber[] = (subscribersData?.data?.subscribers ?? []).map((s: any) => ({
    id: String(s._id),
    name: s.user?.name ?? "—",
    company: s.company || s.user?.email || "—",
    plan: s.plan?.name ?? "—",
    started: fmtDate(s.startedOn),
    renewal: fmtDate(s.renewalDate || s.endDate),
    amount: typeof s.amount === "number" ? `$${s.amount}` : "—",
    status: STATUS_LABEL[String(s.status).toUpperCase()] ?? "Suspended",
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activePlans = (Array.isArray(plansData) ? plansData : []).map((p: any) => {
    const isYearly = billing === "Yearly";
    const amount = isYearly ? p.yearlyPrice : p.monthlyPrice;
    return {
      id: String(p._id),
      name: p.name as string,
      price: typeof amount === "number" ? `$${amount}` : "—",
      billingPeriod: isYearly ? "/Year" : "/Month",
      description: (p.description as string) || "",
      monthlyPrice: p.monthlyPrice as number,
      yearlyPrice: p.yearlyPrice as number,
      features: (Array.isArray(p.benefits) ? p.benefits : []) as string[],
    };
  });

  const totalSubs = stats?.totalSubscribers !== undefined ? Number(stats.totalSubscribers).toLocaleString() : "—";
  const subRevenue = stats?.formattedRevenue ?? "—";

  return (
    <div className="space-y-5 pb-8 font-raleway">
      <section className="grid gap-4 md:grid-cols-2">
        <MetricCard label="Active Subscribers" value={totalSubs} change={stats?.subscribersGrowth} icon={<Users className="h-4 w-4" />} />
        <MetricCard label="Subscription Revenue" value={subRevenue} change={stats?.revenueGrowth} icon={<CircleDollarSign className="h-4 w-4" />} />
      </section>

      <section className="flex flex-col gap-4 border-b border-[#3A4143] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-white">Subscription Plans</h2>
        <button onClick={() => setShowAdd(true)} className="gold-gradient-btn inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm">
          <Plus className="h-4 w-4" /> Add New Plan
        </button>
      </section>

      <div className="flex justify-center">
        <div className="rounded-full border border-[#3B3B36] bg-[#171918] p-1 text-[10px]">
          {["Monthly", "Yearly"].map((option) => (
            <button key={option} onClick={() => setBilling(option)} className={cn("rounded-full px-3 py-1.5 transition-colors", billing === option ? "bg-[#A48226] text-white shadow" : "text-[#D1D5D5] hover:text-white")}>
              {option}
            </button>
          ))}
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        {!activePlans.length && (
          <p className="col-span-full py-8 text-center text-sm text-[#718090]">{plansLoading ? "Loading plans…" : "No subscription plans yet."}</p>
        )}
        {activePlans.map((plan, index) => (
          <article key={plan.id} className={cn("min-h-[220px] rounded-lg border p-4", index === 1 ? "border-[#8D6F22] bg-gradient-to-br from-[#1B1D1B] to-[#211E14]" : "border-[#495053] bg-[#272D2F]")}>
            <h3 className="text-base font-bold text-white">{plan.name}</h3>
            <p className="mt-1 h-9 text-[11px] leading-[1.35] text-[#D5D8D7]">{plan.description}</p>
            <div className="mt-2 flex items-baseline gap-1">
              <strong className="text-xl text-white">{plan.price}</strong>
              <span className="rounded bg-[#80680f] px-1.5 py-0.5 text-[9px] text-[#F3D357]">{plan.billingPeriod}</span>
            </div>
            <ul className="mt-4 space-y-2 text-[11px] text-[#F2F4F3]">
              {plan.features.map((feature, i) => (
                <li key={`${feature}-${i}`} className="flex gap-1.5"><CheckCircle2 className="mt-px h-3 w-3 shrink-0 text-[#D8DCDD]" />{feature}</li>
              ))}
            </ul>
            <div className="mt-6 flex justify-center gap-2">
              <button onClick={() => setEditingPlan(plan)} className="rounded bg-[#1E3B72] px-2 py-1 text-[9px] text-[#6F9DFF]">✎ Edit</button>
              <button
                onClick={() => { if (window.confirm(`Delete the ${plan.name} plan?`)) deletePlanMutation.mutate(plan.id); }}
                className="rounded bg-[#552024] px-2 py-1 text-[9px] text-[#FF5E66]"
              >
                ♙ Delete
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-xl border border-[#1B2227] bg-[#0C0F10] shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#1B2227] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <h2 className="text-lg font-bold text-white">Subscribers</h2>
            <div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-[#101619] p-1">
              {filters.map((item) => (
                <button key={item} onClick={() => setFilter(item)} className={cn("rounded-md px-3 py-1.5 text-xs font-semibold transition-all", filter === item ? "tab-gold-active text-white shadow-xs" : "text-[#8E9CA8] hover:bg-white/5 hover:text-white")}>{item}</button>
              ))}
            </div>
          </div>
          <label className="flex w-full items-center gap-2 rounded-lg border border-[#1B2227] bg-[#0C0F10] px-3 py-2 text-xs transition-all focus-within:border-[#E7C042]/70 lg:w-64">
            <Search className="h-4 w-4 text-[#5B6675]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email or company..." className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-[#5B6675]" />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[930px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#1B2227] bg-[#171D1F] text-[11px] font-bold uppercase tracking-wider text-[#8E9CA8]">
                {["Subscribers", "Company", "Plan", "Started On", "Renewal", "Amount", "Status", "Action"].map((h) => <th key={h} className="px-4 py-3.5 sm:px-6">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2227] text-xs sm:text-sm">
              {visible.length ? visible.map((s) => (
                <tr key={s.id} className="group transition-colors hover:bg-[#121719]/60">
                  <td className="whitespace-nowrap px-4 py-4 font-bold tracking-tight text-white sm:px-6"><Link href={`/subscriptions/${s.id}`} className="hover:text-[#E7C042]">{s.name}</Link></td>
                  <td className="whitespace-nowrap px-4 py-4 font-nunito text-[#8E9CA8] sm:px-6">{s.company}</td>
                  <td className="whitespace-nowrap px-4 py-4 sm:px-6"><PlanBadge plan={s.plan} /></td>
                  <td className="whitespace-nowrap px-4 py-4 font-nunito text-[#8E9CA8] sm:px-6">{s.started}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-nunito text-[#8E9CA8] sm:px-6">{s.renewal}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-white sm:px-6">{s.amount}</td>
                  <td className="whitespace-nowrap px-4 py-4 sm:px-6"><StatusBadge status={s.status} /></td>
                  <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/subscriptions/${s.id}`} aria-label="View subscriber" className="rounded-md p-1.5 text-[#8E9CA8] transition-colors hover:bg-[#182026] hover:text-[#E7C042]"><Eye className="h-4 w-4" /></Link>
                      <button
                        onClick={() => { if (window.confirm(`Delete the subscription for ${s.name}?`)) deleteMutation.mutate(s.id); }}
                        aria-label="Delete subscriber"
                        className="rounded-md p-1.5 text-[#8E9CA8] transition-colors hover:bg-[#2E1417] hover:text-[#EF4444]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={8} className="py-12 text-center text-sm text-[#718090]">{subsLoading ? "Loading subscribers…" : subsError ? "Could not load subscribers." : "No subscribers found."}</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <TablePagination meta={meta} onPageChange={setPage} />
      </section>

      {showAdd && <PlanModal close={() => setShowAdd(false)} />}
      {editingPlan && <PlanModal plan={editingPlan} close={() => setEditingPlan(null)} />}
    </div>
  );
}

function MetricCard({ label, value, change, icon }: { label: string; value: string; change?: string; icon: React.ReactNode }) {
  return (
    <article className="relative min-h-[95px] overflow-hidden rounded-lg border-l border-[#A48226] bg-[#050708] p-4 shadow-lg">
      <div className="flex max-w-[65%] justify-between gap-2 text-[10px] text-white"><span>{label}</span><span className="text-[#D5D7D7]">{icon}</span></div>
      <strong className="mt-1 block text-xl text-white">{value}</strong>
      {change && <span className="mt-1 inline-block rounded bg-emerald-500/10 px-1.5 py-1 text-[9px] text-emerald-400">{change}</span>}
    </article>
  );
}
function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    Essential: "border-[#2B353E] bg-[#182026] text-[#D1D5DB]",
    Professional: "border-[#E7C042]/30 bg-[#E7C042]/10 text-[#E7C042]",
    Elite: "border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#60A5FA]",
  };
  return <span className={cn("rounded border px-2.5 py-1 text-xs font-semibold", styles[plan] ?? styles.Essential)}>{plan}</span>;
}
function StatusBadge({ status }: { status: SubscriberStatus }) {
  const styles: Record<SubscriberStatus, string> = {
    Active: "border-[#10B981]/30 bg-[#0E2922] text-[#10B981]",
    Expired: "border-[#2B353E] bg-[#182026] text-[#8E9CA8]",
    Cancelled: "border-[#EF4444]/30 bg-[#2E1417] text-[#EF4444]",
    Suspended: "border-[#E7C042]/30 bg-[#E7C042]/10 text-[#E7C042]",
  };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold", styles[status])}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PlanModal({ close, plan }: { close: () => void; plan?: any }) {
  const isEdit = Boolean(plan);
  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();
  const [title, setTitle] = useState<string>(plan?.name ?? "");
  const [subtitle, setSubtitle] = useState<string>(plan?.description ?? "");
  const [monthly, setMonthly] = useState<string>(plan?.monthlyPrice !== undefined ? String(plan.monthlyPrice) : "");
  const [yearly, setYearly] = useState<string>(plan?.yearlyPrice !== undefined ? String(plan.yearlyPrice) : "");
  const [benefits, setBenefits] = useState<string[]>(Array.isArray(plan?.features) ? plan.features : []);
  const [newBenefit, setNewBenefit] = useState("");

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };
  const updateBenefit = (index: number, value: string) => setBenefits(benefits.map((b, i) => (i === index ? value : b)));

  const monthlyNum = parseFloat(monthly);
  const yearlyNum = parseFloat(yearly);
  const valid = title.trim().length > 0 && subtitle.trim().length > 0 && monthlyNum >= 0 && yearlyNum >= 0;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid) return;
    const payload = {
      name: title.trim(),
      description: subtitle.trim(),
      monthlyPrice: monthlyNum,
      yearlyPrice: yearlyNum,
      benefits: benefits.map((b) => b.trim()).filter(Boolean),
    };
    if (isEdit) updatePlanMutation.mutate({ id: String(plan.id), payload });
    else createPlanMutation.mutate(payload);
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030506]/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={isEdit ? "Edit subscription plan" : "Add subscription plan"}>
      <form onSubmit={handleSubmit} className="max-h-[92vh] w-full max-w-[640px] overflow-y-auto rounded-2xl bg-[#252D2F] p-4 shadow-2xl sm:p-6">
        <div className="flex items-center justify-between border-b border-[#B69942]/20 pb-3">
          <h3 className="text-lg font-bold text-white">{isEdit ? `Edit ${plan?.name} Plan` : "Add New Subscription Plan"}</h3>
          <button type="button" onClick={close} className="rounded-full text-[#A9A39A] hover:text-white" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-3 space-y-3">
          <Field label="Plan Title" value={title} onChange={setTitle} />
          <Field label="Plan Description" value={subtitle} onChange={setSubtitle} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Monthly price (USD)" value={monthly} placeholder="e.g. 49" onChange={setMonthly} />
            <Field label="Yearly price (USD)" value={yearly} placeholder="e.g. 490" onChange={setYearly} />
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={newBenefit}
            onChange={(e) => setNewBenefit(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addBenefit(); } }}
            placeholder="Enter a new benefit"
            className="min-w-0 flex-1 rounded-lg border border-[#4B5658] bg-[#202728] px-3 py-2 text-sm text-white outline-none focus:border-[#C29A21]"
          />
          <button type="button" onClick={addBenefit} className="gold-gradient-btn inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs"><Plus className="h-3.5 w-3.5" /> Add Benefit</button>
        </div>
        <div className="mt-3 space-y-2">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 rounded-sm border border-[#879092] px-2 py-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#E7C042]" />
              <input value={benefit} onChange={(e) => updateBenefit(index, e.target.value)} className="min-w-0 flex-1 bg-transparent text-xs text-[#E2E4E3] outline-none" />
              <button type="button" onClick={() => setBenefits(benefits.filter((_, i) => i !== index))} className="text-[#F05058]" aria-label="Remove benefit"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={close} className="rounded-lg bg-[#F2F5FA] px-4 py-3 text-xs font-medium text-[#171A1B]">Cancel</button>
          <button type="submit" disabled={!valid} className="gold-gradient-btn rounded-lg px-4 py-3 text-xs font-medium disabled:opacity-50">{isEdit ? "Save Changes" : "Add Plan"}</button>
        </div>
      </form>
    </div>
  );
}
function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="block text-xs text-white">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1.5 w-full rounded-lg border border-transparent bg-[#596165] px-3 py-2.5 text-sm font-semibold text-white outline-none placeholder:text-[#C9CFCF] focus:border-[#C29A21]" />
    </label>
  );
}
