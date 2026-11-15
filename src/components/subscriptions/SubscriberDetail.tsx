"use client";

import Link from "next/link";
import { ArrowLeft, BadgeCheck, CalendarDays, Mail, Pencil, SlidersHorizontal, Trash2, UserRound, XCircle } from "lucide-react";

const people: Record<string, { name: string; email: string; plan: string; status: string }> = {
  "1": { name: "James Wilson", email: "james.wilson@gmail.com", plan: "Essential", status: "Active" },
  "2": { name: "Jane Wilson", email: "jane.wilson@gmail.com", plan: "Essential", status: "Active" },
  "3": { name: "Daniel Carter", email: "daniel.carter@gmail.com", plan: "Professional", status: "Active" },
  "4": { name: "Daniel Carter", email: "daniel.carter@gmail.com", plan: "Essential", status: "Expired" },
  "5": { name: "Marcus Chen", email: "priya.sharma@gmail.com", plan: "Elite", status: "Expired" },
  "6": { name: "Daniel Carter", email: "daniel.carter@gmail.com", plan: "Professional", status: "Cancelled" },
};

const planInfo: Record<string, { price: string; description: string; features: string[] }> = {
  Essential: { price: "$49", description: "Perfect for exploring market data and tracking your favourite stocks.", features: ["Market overview", "Basic stock screener", "One personalized watchlist", "Basic market alerts"] },
  Professional: { price: "$89", description: "Advanced intelligence and AI-powered research for active investors.", features: ["Advanced stock screener", "Unlimited watchlists", "AI-powered market analysis", "Premium research access"] },
  Elite: { price: "$149", description: "Complete market intelligence and exclusive access for serious investors.", features: ["Advanced AI research tools", "Exclusive market insights", "Priority community access", "Custom alert preferences"] },
};

export default function SubscriberDetail({ id }: { id: string }) {
  const person = people[id] ?? people["1"];
  const plan = planInfo[person.plan];
  return <div className="font-raleway text-white">
    <div className="flex flex-col gap-4 border-b border-[#293235] pb-5 xl:flex-row xl:items-start xl:justify-between">
      <div><div className="flex items-center gap-2 text-[10px] text-[#9EA7A7]"><Link href="/subscriptions" className="rounded bg-[#283235] p-1 text-white hover:bg-[#3B4548]"><ArrowLeft className="h-3 w-3" /></Link><Link href="/subscriptions" className="hover:text-[#E7C042]">Active Subscribers</Link><span>›</span><span className="text-[#D6B63A]">{person.name}</span></div><div className="mt-3 flex items-center gap-3"><div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#B18D2A] to-[#F4D65A] text-[10px] font-bold text-black">{person.name.split(" ").map((word) => word[0]).join("")}</div><div><div className="flex items-center gap-2"><h1 className="text-base font-bold">{person.name}</h1><span className="rounded-sm bg-[#063E34] px-1 py-0.5 text-[9px] text-[#13C895]">{person.status}</span></div><p className="text-[10px] text-[#BBC1C0]">{person.email}</p><span className="mt-1 inline-block rounded-sm bg-[#756315] px-1 py-0.5 text-[9px] text-[#F5D857]">{person.plan}</span></div></div></div>
      <div className="grid grid-cols-2 gap-2 sm:flex"><button className="detail-action"><Mail /> Email</button><button className="detail-action"><CalendarDays /> Change Plan</button><button className="detail-action"><SlidersHorizontal /> Reset Password</button><button className="detail-action detail-danger"><XCircle /> Suspend</button></div>
    </div>
    <div className="grid grid-cols-2 gap-5 border-b border-[#293235] py-5 text-[10px] md:grid-cols-4"><DetailMeta label="STARTED ON" value="2024-01-15" /><DetailMeta label="RENEWAL DATE" value="2024-02-15" /><DetailMeta label="Last Active" value="2 min ago" /><DetailMeta label="Plan" value={person.plan} gold /></div>
    <section className="mt-5 grid gap-3 lg:grid-cols-[1.8fr_.9fr]"><article className="overflow-hidden rounded-lg border border-[#1E282A] bg-[#161D1F]"><h2 className="flex items-center gap-2 border-b border-[#30393B] px-3 py-2.5 text-base font-medium"><UserRound className="h-4 w-4 text-[#E2E6E5]" /> Profile Information</h2><dl className="space-y-3 p-3 text-sm"><ProfileRow label="Full Name" value={person.name} /><ProfileRow label="User ID" value={`PB-${id.padStart(6, "0")}`} /><ProfileRow label="Email Verified" value="Verified" success /><ProfileRow label="Plan" value={person.plan} /><ProfileRow label="Registration Date" value="January 15, 2024" /></dl></article>
      <article className="rounded-lg border border-[#697174] bg-gradient-to-br from-[#292F31] to-[#1E2526] p-3"><h2 className="text-base font-bold">{person.plan}</h2><p className="mt-1 text-xs leading-4 text-[#EDF0EF]">{plan.description}</p><div className="mt-3 flex items-center gap-1"><strong className="text-2xl">{plan.price}</strong><span className="rounded bg-[#80680F] px-1.5 py-0.5 text-[9px]">/Month</span></div><ul className="mt-4 space-y-2 text-xs text-[#EDF0EF]">{plan.features.map((feature) => <li key={feature} className="flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5 text-[#E1E5E4]" />{feature}</li>)}</ul><div className="mt-7 flex justify-center gap-2"><button className="rounded bg-[#1E3B72] px-2 py-1 text-[9px] text-[#76A3FF]"><Pencil className="mr-1 inline h-3 w-3" />Edit Plan</button><button className="rounded bg-[#552024] px-2 py-1 text-[9px] text-[#FF626A]"><Trash2 className="mr-1 inline h-3 w-3" />Delete</button></div></article></section>
    <style jsx>{`.detail-action { display:flex; align-items:center; justify-content:center; gap:.4rem; border-radius:.35rem; background:#F1F5F9; color:#172027; padding:.65rem .9rem; font-size:.7rem; font-weight:500; } .detail-action :global(svg) { width:.85rem; height:.85rem; } .detail-danger { border:1px solid #B83A47; background:#40191D; color:#F66069; }`}</style>
  </div>;
}
function DetailMeta({ label, value, gold }: { label: string; value: string; gold?: boolean }) { return <div><dt className="text-[#9BA4A4]">{label}</dt><dd className={gold ? "mt-1 inline-block rounded-sm bg-[#756315] px-1 py-0.5 text-[#F5D857]" : "mt-1 text-[#DDE1E0]"}>{value}</dd></div>; }
function ProfileRow({ label, value, success }: { label: string; value: string; success?: boolean }) { return <div className="flex items-center justify-between gap-3"><dt className="text-[#A1A9A9]">{label}</dt><dd className={success ? "font-bold text-[#16C896]" : "font-bold text-[#F2F5F4]"}>{value}</dd></div>; }
