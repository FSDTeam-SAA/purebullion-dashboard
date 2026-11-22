"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useSubscribers,
  useSubscriptionStats,
  useSubscriptionPlans,
  useDeleteSubscriber,
  useCreatePlan,
} from "./hooks/useSubscriptions";

type SubscriberStatus = "Active" | "Expired" | "Cancelled" | "Suspended";
type Subscriber = {
  id: number;
  name: string;
  company: string;
  plan: "Essential" | "Professional" | "Elite";
  started: string;
  renewal: string;
  amount: string;
  status: SubscriberStatus;
};

const subscribers: Subscriber[] = [
  { id: 1, name: "James Wilson", company: "james.wilson@gmail.com", plan: "Essential", started: "18 Jun 2026", renewal: "18 Jul 2026", amount: "$49", status: "Active" },
  { id: 2, name: "Jane Wilson", company: "jane.wilson@gmail.com", plan: "Essential", started: "18 Jun 2026", renewal: "18 Jul 2026", amount: "$49", status: "Active" },
  { id: 3, name: "Daniel Carter", company: "daniel.carter@gmail.com", plan: "Professional", started: "18 Jun 2026", renewal: "18 Jul 2026", amount: "$89", status: "Active" },
  { id: 4, name: "Daniel Carter", company: "daniel.carter@gmail.com", plan: "Essential", started: "18 Jun 2026", renewal: "18 Jul 2026", amount: "$49", status: "Expired" },
  { id: 5, name: "Marcus Chen", company: "priya.sharma@gmail.com", plan: "Elite", started: "18 Jun 2026", renewal: "18 Jul 2026", amount: "$149", status: "Expired" },
  { id: 6, name: "Daniel Carter", company: "daniel.carter@gmail.com", plan: "Professional", started: "18 Jun 2026", renewal: "2 min ago", amount: "$89", status: "Cancelled" },
];

const filters = ["All", "Active", "Suspended", "Expired", "Cancelled"] as const;
const plans = [
  { name: "Essential", price: "$49", description: "Perfect for exploring market data and tracking your favourite stocks.", features: ["Market overview", "Basic stock screener", "One personalized watchlist", "Basic market alerts"] },
  { name: "Professional", price: "$89", description: "Advanced intelligence and AI-powered research for active investors.", features: ["Advanced stock screener", "Unlimited watchlists", "AI-powered market analysis", "Premium research access", "Unlimited watchlists"] },
  { name: "Elite", price: "$149", description: "Complete market intelligence and exclusive access for serious investors.", features: ["Advanced AI research tools", "Exclusive market insights", "Priority community access", "Custom alert preferences"] },
];

function Trend({ type }: { type: "up" | "revenue" }) {
  const points = type === "up" ? "0,52 15,50 23,51 29,43 36,46 43,33 49,37 55,28 62,31 69,19 75,24 82,14 88,20 95,5" : "0,54 18,52 26,51 33,45 40,48 47,37 55,40 62,29 69,34 76,25 82,27 89,12 95,17";
  return <svg viewBox="0 0 96 58" className="h-14 w-28" aria-hidden="true"><polyline points={points} fill="none" stroke="#10B981" strokeWidth="1.4" /><path d="M0 57 L0 52" stroke="#10B981" strokeOpacity=".15" /></svg>;
}

export default function SubscriptionPageClient() {
  const { data: stats } = useSubscriptionStats();
  const { data: plansData } = useSubscriptionPlans();
  const { data: subscribersData } = useSubscribers();
  const deleteMutation = useDeleteSubscriber();

  const [billing, setBilling] = useState("Monthly");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingPlan, setEditingPlan] = useState<(typeof plans)[number] | null>(null);

  const subscriberList = useMemo(() => {
    if (subscribersData?.subscribers && subscribersData.subscribers.length > 0) {
      return subscribersData.subscribers.map((s: any, idx: number) => ({
        id: (s as any)._id || idx + 1,
        name: s.user?.name || s.name || "Subscriber",
        company: s.user?.email || s.company || s.email || "",
        plan: (s.plan?.name || s.plan || "Essential") as Subscriber["plan"],
        started: s.startDate ? new Date(s.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "18 Jun 2026",
        renewal: s.endDate ? new Date(s.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "18 Jul 2026",
        amount: s.price ? `$${s.price}` : "$49",
        status: (s.status === "Active" ? "Active" : s.status === "Expired" ? "Expired" : s.status === "Cancelled" ? "Cancelled" : "Suspended") as SubscriberStatus,
      }));
    }
    return subscribers;
  }, [subscribersData]);

  const activePlans = useMemo(() => {
    if (plansData && plansData.length > 0) {
      return plansData.map((p: any) => {
        const featureList: string[] =
          Array.isArray(p.benefits) && p.benefits.length > 0
            ? p.benefits
            : Array.isArray(p.features)
            ? p.features
            : typeof p.features === "object" && p.features !== null
            ? Object.keys(p.features).filter((k) => p.features[k] === true)
            : [];

        const isYearly = billing === "Yearly";
        const priceDisplay = isYearly
          ? (p.yearlyPrice ? `$${p.yearlyPrice}` : `$${(p.price || p.monthlyPrice || 49) * 10}`)
          : (p.monthlyPrice ? `$${p.monthlyPrice}` : `$${p.price || 49}`);

        return {
          id: p._id || p.id,
          name: p.name,
          price: priceDisplay,
          billingPeriod: isYearly ? "/Year" : "/Month",
          description: p.description || "",
          features:
            featureList.length > 0
              ? featureList
              : [
                  "Market overview",
                  "Basic stock screener",
                  "One personalized watchlist",
                  "Basic market alerts",
                ],
        };
      });
    }
    return plans.map((p) => ({
      ...p,
      price: billing === "Yearly" ? `$${parseInt(p.price.replace(/\D/g, "") || "49", 10) * 10}` : p.price,
      billingPeriod: billing === "Yearly" ? "/Year" : "/Month",
    }));
  }, [plansData, billing]);

  const visible = useMemo(() => subscriberList.filter((item: Subscriber) => {
    const matchesStatus = filter === "All" || item.status === filter;
    const term = query.toLowerCase();
    return matchesStatus && (!term || item.name.toLowerCase().includes(term) || item.company.toLowerCase().includes(term) || item.plan.toLowerCase().includes(term));
  }), [subscriberList, filter, query]);

  const totalSubs = stats?.totalSubscribers ? stats.totalSubscribers.toLocaleString() : "3,648";
  const subRevenue = stats?.subscriptionRevenue ? `$${(stats.subscriptionRevenue / 1000).toFixed(1)}K` : "$102.4K";

  return <div className="space-y-5 pb-8 font-raleway">
    <section className="grid gap-4 md:grid-cols-2">
      <MetricCard label="Total Subscribers" value={totalSubs} change="↑ +14.3%" icon={<Users className="h-4 w-4" />} trend="up" />
      <MetricCard label="Subscription Revenue" value={subRevenue} change="+ 8.4% this month" icon={<CircleDollarSign className="h-4 w-4" />} trend="revenue" />
    </section>

    <section className="border-b border-[#3A4143] pb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-2xl font-bold text-white tracking-tight">Subscription Plans</h2>
      <button onClick={() => setShowAdd(true)} className="gold-gradient-btn inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm">
        <Plus className="h-4 w-4" /> Add New Plan
      </button>
    </section>

    <div className="flex justify-center"><div className="rounded-full border border-[#3B3B36] bg-[#171918] p-1 text-[10px]">
      {["Monthly", "Yearly"].map((option) => <button key={option} onClick={() => setBilling(option)} className={cn("rounded-full px-3 py-1.5 transition-colors", billing === option ? "bg-[#A48226] text-white shadow" : "text-[#D1D5D5] hover:text-white")}>{option}</button>)}
    </div></div>

    <section className="grid gap-4 lg:grid-cols-3">
      {activePlans.map((plan: any, index: number) => <article key={plan.name} className={cn("min-h-[220px] rounded-lg border p-4", index === 1 ? "border-[#8D6F22] bg-gradient-to-br from-[#1B1D1B] to-[#211E14]" : "border-[#495053] bg-[#272D2F]")}>
        <h3 className="text-base font-bold text-white">{plan.name}</h3>
        <p className="mt-1 h-9 text-[11px] leading-[1.35] text-[#D5D8D7]">{plan.description}</p>
        <div className="mt-2 flex items-baseline gap-1"><strong className="text-xl text-white">{plan.price}</strong><span className="rounded bg-[#80680f] px-1.5 py-0.5 text-[9px] text-[#F3D357]">{plan.billingPeriod || (billing === "Yearly" ? "/Year" : "/Month")}</span></div>
        <ul className="mt-4 space-y-2 text-[11px] text-[#F2F4F3]">{(Array.isArray(plan.features) ? plan.features : []).map((feature: any, featureIndex: number) => <li key={`${feature}-${featureIndex}`} className="flex gap-1.5"><CheckCircle2 className="mt-px h-3 w-3 shrink-0 text-[#D8DCDD]" />{feature}</li>)}</ul>
        <div className="mt-6 flex justify-center gap-2"><button onClick={() => setEditingPlan(plan)} className="rounded bg-[#1E3B72] px-2 py-1 text-[9px] text-[#6F9DFF]">✎ Edit</button><button className="rounded bg-[#552024] px-2 py-1 text-[9px] text-[#FF5E66]">♙ Delete</button></div>
      </article>)}
    </section>

    <section className="overflow-hidden rounded-xl border border-[#1B2227] bg-[#0C0F10] shadow-sm">
      <div className="flex flex-col gap-4 border-b border-[#1B2227] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><h2 className="text-lg font-bold text-white">Active Subscribers</h2><div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-[#101619] p-1">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={cn("rounded-md px-3 py-1.5 text-xs font-semibold transition-all", filter === item ? "tab-gold-active text-white shadow-xs" : "text-[#8E9CA8] hover:bg-white/5 hover:text-white")}>{item}</button>)}</div></div><label className="flex w-full items-center gap-2 rounded-lg border border-[#1B2227] bg-[#0C0F10] px-3 py-2 text-xs transition-all focus-within:border-[#E7C042]/70 lg:w-64"><Search className="h-4 w-4 text-[#5B6675]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search..." className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-[#5B6675]" /><kbd className="rounded border border-[#2B353E] bg-[#182026] px-1.5 py-0.5 text-[10px] text-[#8E9CA8]">⌘K</kbd></label></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[930px] border-collapse text-left"><thead><tr className="border-b border-[#1B2227] bg-[#171D1F] text-[11px] font-bold uppercase tracking-wider text-[#8E9CA8]">{["Subscribers", "Company", "Plan", "Started On", "Renewal", "Amount", "Status", "Action"].map((head) => <th key={head} className="px-4 py-3.5 sm:px-6">{head}</th>)}</tr></thead><tbody className="divide-y divide-[#1B2227] text-xs sm:text-sm">{visible.length ? visible.map((subscriber: Subscriber) => <tr key={subscriber.id} className="group transition-colors hover:bg-[#121719]/60"><td className="whitespace-nowrap px-4 py-4 font-bold tracking-tight text-white sm:px-6"><Link href={`/subscriptions/${subscriber.id}`} className="hover:text-[#E7C042]">{subscriber.name}</Link></td><td className="whitespace-nowrap px-4 py-4 font-nunito text-[#8E9CA8] sm:px-6">{subscriber.company}</td><td className="whitespace-nowrap px-4 py-4 sm:px-6"><PlanBadge plan={subscriber.plan} /></td><td className="whitespace-nowrap px-4 py-4 font-nunito text-[#8E9CA8] sm:px-6">{subscriber.started}</td><td className="whitespace-nowrap px-4 py-4 font-nunito text-[#8E9CA8] sm:px-6">{subscriber.renewal}</td><td className="whitespace-nowrap px-4 py-4 font-semibold text-white sm:px-6">{subscriber.amount}</td><td className="whitespace-nowrap px-4 py-4 sm:px-6"><StatusBadge status={subscriber.status} /></td><td className="whitespace-nowrap px-4 py-4 sm:px-6"><div className="flex items-center justify-center gap-2"><Link href={`/subscriptions/${subscriber.id}`} aria-label="View subscriber" className="rounded-md p-1.5 text-[#8E9CA8] transition-colors hover:bg-[#182026] hover:text-[#E7C042]"><Eye className="h-4 w-4" /></Link><button onClick={() => deleteMutation.mutate(String(subscriber.id))} aria-label="Delete subscriber" className="rounded-md p-1.5 text-[#8E9CA8] transition-colors hover:bg-[#2E1417] hover:text-[#EF4444]"><Trash2 className="h-4 w-4" /></button></div></td></tr>) : <tr><td colSpan={8} className="py-12 text-center text-sm text-[#718090]">No subscribers found matching your search.</td></tr>}</tbody></table></div>
      <footer className="flex flex-col items-center justify-between gap-4 border-t border-[#1B2227] p-4 text-xs sm:flex-row sm:px-6"><span className="text-[#8E9CA8]">Showing <b className="text-white">1</b> to <b className="text-white">{visible.length}</b> of <b className="text-white">120</b> results</span><div className="flex items-center gap-1.5"><button className="rounded-md p-1.5 text-[#5B6675]"><ChevronLeft className="h-4 w-4" /></button><button className="tab-gold-active flex h-7 w-7 items-center justify-center rounded-md font-bold text-white">1</button><button className="flex h-7 w-7 items-center justify-center rounded-md font-medium text-[#8E9CA8] hover:bg-[#182026] hover:text-white">2</button><button className="flex h-7 w-7 items-center justify-center rounded-md font-medium text-[#8E9CA8] hover:bg-[#182026] hover:text-white">3</button><span className="px-1 text-[#5B6675]">…</span><button className="flex h-7 w-7 items-center justify-center rounded-md font-medium text-[#8E9CA8] hover:bg-[#182026] hover:text-white">17</button><button className="rounded-md p-1.5 text-[#8E9CA8] hover:bg-[#182026] hover:text-white"><ChevronRight className="h-4 w-4" /></button></div></footer>
    </section>
    {showAdd && <PlanModal close={() => setShowAdd(false)} />}
    {editingPlan && <PlanModal plan={editingPlan} close={() => setEditingPlan(null)} />}
  </div>;
}

function MetricCard({ label, value, change, icon, trend }: { label: string; value: string; change: string; icon: React.ReactNode; trend: "up" | "revenue" }) { return <article className="relative min-h-[95px] overflow-hidden rounded-lg border-l border-[#A48226] bg-[#050708] p-4 shadow-lg"><div className="flex max-w-[65%] justify-between gap-2 text-[10px] text-white"><span>{label}</span><span className="text-[#D5D7D7]">{icon}</span></div><strong className="mt-1 block text-xl text-white">{value}</strong><span className="mt-1 inline-block rounded bg-emerald-500/10 px-1.5 py-1 text-[9px] text-emerald-400">{change}</span><div className="absolute bottom-1 right-2"><Trend type={trend} /></div></article>; }
function PlanBadge({ plan }: { plan: Subscriber["plan"] }) { const styles = { Essential: "border-[#2B353E] bg-[#182026] text-[#D1D5DB]", Professional: "border-[#E7C042]/30 bg-[#E7C042]/10 text-[#E7C042]", Elite: "border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#60A5FA]" }; return <span className={cn("rounded border px-2.5 py-1 text-xs font-semibold", styles[plan])}>{plan}</span>; }
function StatusBadge({ status }: { status: SubscriberStatus }) { const styles: Record<SubscriberStatus, string> = { Active: "border-[#10B981]/30 bg-[#0E2922] text-[#10B981]", Expired: "border-[#2B353E] bg-[#182026] text-[#8E9CA8]", Cancelled: "border-[#EF4444]/30 bg-[#2E1417] text-[#EF4444]", Suspended: "border-[#E7C042]/30 bg-[#E7C042]/10 text-[#E7C042]" }; return <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold", styles[status])}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span>; }
function PlanModal({ close, plan }: { close: () => void; plan?: any }) {
  const isEdit = Boolean(plan);
  const createPlanMutation = useCreatePlan();
  const [title, setTitle] = useState(plan?.name ?? "Starter");
  const [subtitle, setSubtitle] = useState(plan?.description ?? "Perfect for getting started");
  const [price, setPrice] = useState(plan?.price ?? "");
  const [billingType, setBillingType] = useState("Monthly");
  const [benefits, setBenefits] = useState<string[]>(
    Array.isArray(plan?.features) ? plan.features : ["6 AI AI", "6 AI Agents", "100 voice notes"]
  );
  const [newBenefit, setNewBenefit] = useState("");
  const addBenefit = () => { if (newBenefit.trim()) { setBenefits([...benefits, newBenefit.trim()]); setNewBenefit(""); } };
  const updateBenefit = (index: number, value: string) => setBenefits(benefits.map((benefit, current) => current === index ? value : benefit));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, "")) || 49;
    createPlanMutation.mutate({
      name: title,
      tier: title === "Elite" ? "Elite" : title === "Professional" ? "Professional" : "Essential",
      priceMonthly: billingType === "Monthly" ? numericPrice : Math.round(numericPrice / 10),
      priceYearly: billingType === "Yearly" ? numericPrice : numericPrice * 10,
      description: subtitle,
      features: benefits,
      isActive: true,
    });
    close();
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030506]/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={isEdit ? "Edit subscription plan" : "Add subscription plan"}>
    <form onSubmit={handleSubmit} className="max-h-[92vh] w-full max-w-[640px] overflow-y-auto rounded-2xl bg-[#252D2F] p-4 shadow-2xl sm:p-6">
      <div className="flex items-center justify-between border-b border-[#B69942]/20 pb-3"><h3 className="text-lg font-bold text-white">{isEdit ? `Edit ${plan?.name} Plan` : "Add New Subscription Plans"}</h3><button type="button" onClick={close} className="rounded-full text-[#A9A39A] hover:text-white" aria-label="Close"><X className="h-5 w-5" /></button></div>
      {isEdit ? <EditPlanFields title={title} subtitle={subtitle} price={price} setTitle={setTitle} setSubtitle={setSubtitle} setPrice={setPrice} /> : <div className="mt-3 space-y-3">
        <Field label="Plan Title" value={title} onChange={setTitle} />
        <Field label="Plan Subtitle (Optional)" value={subtitle} onChange={setSubtitle} />
        <div className="grid gap-3 sm:grid-cols-2"><label className="block text-xs text-white">Billing Type<select value={billingType} onChange={(event) => setBillingType(event.target.value)} className="mt-1.5 w-full appearance-none rounded-lg border border-transparent bg-[#596165] px-3 py-2.5 text-sm font-semibold text-white outline-none focus:border-[#C29A21]"><option>Monthly</option><option>Yearly</option></select></label><Field label="Price" value={price} placeholder="e.g. $49.00" onChange={setPrice} /></div>
      </div>}
      {!isEdit && <div className="mt-3 flex gap-2"><input value={newBenefit} onChange={(event) => setNewBenefit(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addBenefit(); } }} placeholder="Enter a new benefit" className="min-w-0 flex-1 rounded-lg border border-[#4B5658] bg-[#202728] px-3 py-2 text-sm text-white outline-none focus:border-[#C29A21]" /><button type="button" onClick={addBenefit} className="gold-gradient-btn inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs"><Plus className="h-3.5 w-3.5" /> Add New Benefits</button></div>}
      <div className="mt-3 space-y-2">{benefits.map((benefit, index) => <div key={`${benefit}-${index}`} className="flex items-center gap-2 rounded-sm border border-[#879092] px-2 py-1.5"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#E7C042]" /><input value={benefit} onChange={(event) => updateBenefit(index, event.target.value)} className="min-w-0 flex-1 bg-transparent text-xs text-[#E2E4E3] outline-none" />{!isEdit && index === 0 ? <button type="button" className="gold-gradient-btn rounded-md px-3 py-1 text-[10px]">Add</button> : <div className="flex gap-2"><button type="button" className="text-[#E7C042]" aria-label="Edit benefit"><Pencil className="h-3.5 w-3.5" /></button><button type="button" onClick={() => setBenefits(benefits.filter((_, current) => current !== index))} className="text-[#F05058]" aria-label="Remove benefit"><Trash2 className="h-3.5 w-3.5" /></button></div>}</div>)}</div>
      {isEdit && <button type="button" onClick={() => setBenefits([...benefits, "New benefit"])} className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#F2F5FA] px-4 py-2 text-xs text-[#202427]"><Pencil className="h-3.5 w-3.5" /> Add More</button>}
      <div className="mt-5 grid grid-cols-2 gap-3"><button type="button" onClick={close} className="rounded-lg bg-[#F2F5FA] px-4 py-3 text-xs font-medium text-[#171A1B]">Cancel</button><button type="submit" className="gold-gradient-btn rounded-lg px-4 py-3 text-xs font-medium">{isEdit ? "Save Changes" : "Add New Subscription Plans"}</button></div>
    </form>
  </div>;
}
function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) { return <label className="block text-xs text-white">{label}<input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-1.5 w-full rounded-lg border border-transparent bg-[#596165] px-3 py-2.5 text-sm font-semibold text-white outline-none placeholder:text-[#F4F5F5] focus:border-[#C29A21]" /></label>; }
function EditPlanFields({ title, subtitle, price, setTitle, setSubtitle, setPrice }: { title: string; subtitle: string; price: string; setTitle: (value: string) => void; setSubtitle: (value: string) => void; setPrice: (value: string) => void }) { return <div className="mt-3 space-y-3"><div className="rounded-md border border-[#A78316] p-2"><div className="flex items-center"><input value={title} onChange={(event) => setTitle(event.target.value)} className="min-w-0 flex-1 bg-transparent text-lg font-bold text-[#E7C042] outline-none" /><Pencil className="h-4 w-4 text-[#E7C042]" /></div><input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} className="w-full bg-transparent text-xs text-white outline-none" /></div><div className="flex items-center rounded-md border border-[#A78316] px-2 py-1.5"><input value={price} onChange={(event) => setPrice(event.target.value)} className="min-w-0 flex-1 bg-transparent text-2xl font-bold text-[#E7C042] outline-none" /><span className="rounded bg-[#8C6E13] px-1.5 py-1 text-[10px] text-white">/Month</span><Pencil className="ml-3 h-4 w-4 text-[#E7C042]" /></div></div>; }
