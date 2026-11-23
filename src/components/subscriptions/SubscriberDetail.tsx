"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BadgeCheck, Trash2, UserRound, XCircle, CheckCircle2 } from "lucide-react";
import { useDeleteSubscriber, useSubscriberDetail, useUpdateSubscriberStatus } from "./hooks/useSubscriptions";

const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString("en-CA") : "—");

export default function SubscriberDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useSubscriberDetail(id);
  const statusMutation = useUpdateSubscriberStatus();
  const deleteMutation = useDeleteSubscriber();

  if (isLoading) return <p className="py-16 text-center text-sm text-[#718090]">Loading subscriber…</p>;
  if (isError || !data) {
    return (
      <div className="py-16 text-center text-sm text-[#718090]">
        <p>{error instanceof Error ? error.message : "Could not load this subscriber."}</p>
        <Link href="/subscriptions" className="mt-3 inline-block text-[#E7C042]">Back to subscriptions</Link>
      </div>
    );
  }

  const { subscription, plan, user } = data;
  const status: string = String(subscription?.status ?? "").toUpperCase();
  const statusLabel = status.charAt(0) + status.slice(1).toLowerCase();
  const isActive = status === "ACTIVE";
  const name: string = user?.name ?? "—";
  const initials = name.split(" ").filter(Boolean).map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const price = subscription?.billingCycle === "yearly" ? plan?.yearlyPrice : plan?.monthlyPrice;
  const benefits: string[] = Array.isArray(plan?.benefits) ? plan.benefits : [];

  return (
    <div className="font-raleway text-white">
      <div className="flex flex-col gap-4 border-b border-[#293235] pb-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-[#9EA7A7]">
            <Link href="/subscriptions" className="rounded bg-[#283235] p-1 text-white hover:bg-[#3B4548]"><ArrowLeft className="h-3 w-3" /></Link>
            <Link href="/subscriptions" className="hover:text-[#E7C042]">Subscribers</Link>
            <span>›</span>
            <span className="text-[#D6B63A]">{name}</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#B18D2A] to-[#F4D65A] text-[10px] font-bold text-black">{initials}</div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold">{name}</h1>
                <span className={`rounded-sm px-1 py-0.5 text-[9px] ${isActive ? "bg-[#063E34] text-[#13C895]" : "bg-[#40191D] text-[#F66069]"}`}>{statusLabel}</span>
              </div>
              <p className="text-[10px] text-[#BBC1C0]">{user?.email}</p>
              <span className="mt-1 inline-block rounded-sm bg-[#756315] px-1 py-0.5 text-[9px] text-[#F5D857]">{plan?.name ?? "—"}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <button
            disabled={statusMutation.isPending}
            onClick={() => statusMutation.mutate({ id, status: isActive ? "Suspended" : "Active" })}
            className="flex items-center justify-center gap-1.5 rounded-md border border-[#B83A47] bg-[#40191D] px-3.5 py-2.5 text-[11px] font-medium text-[#F66069] disabled:opacity-60"
          >
            {isActive ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
            {isActive ? "Suspend" : "Activate"}
          </button>
          <button
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (window.confirm(`Delete the subscription for ${name}?`)) {
                deleteMutation.mutate(id, { onSuccess: () => router.push("/subscriptions") });
              }
            }}
            className="flex items-center justify-center gap-1.5 rounded-md border border-[#B83A47] bg-[#40191D] px-3.5 py-2.5 text-[11px] font-medium text-[#F66069] disabled:opacity-60"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 border-b border-[#293235] py-5 text-[10px] md:grid-cols-4">
        <DetailMeta label="STARTED ON" value={fmt(subscription?.startDate)} />
        <DetailMeta label="RENEWAL DATE" value={fmt(subscription?.renewalDate || subscription?.endDate)} />
        <DetailMeta label="Billing" value={subscription?.billingCycle ?? "—"} />
        <DetailMeta label="Plan" value={plan?.name ?? "—"} gold />
      </div>

      <section className="mt-5 grid gap-3 lg:grid-cols-[1.8fr_.9fr]">
        <article className="overflow-hidden rounded-lg border border-[#1E282A] bg-[#161D1F]">
          <h2 className="flex items-center gap-2 border-b border-[#30393B] px-3 py-2.5 text-base font-medium"><UserRound className="h-4 w-4 text-[#E2E6E5]" /> Profile Information</h2>
          <dl className="space-y-3 p-3 text-sm">
            <ProfileRow label="Full Name" value={name} />
            <ProfileRow label="User ID" value={String(user?._id ?? "—")} />
            <ProfileRow label="Email Verified" value={user?.isVerified ? "Verified" : "Not verified"} success={!!user?.isVerified} />
            <ProfileRow label="Payment Status" value={subscription?.paymentStatus ?? "—"} />
            <ProfileRow label="Payment Method" value={subscription?.paymentMethod ?? "—"} />
            <ProfileRow label="Registration Date" value={fmt(user?.createdAt)} />
          </dl>
        </article>

        <article className="rounded-lg border border-[#697174] bg-gradient-to-br from-[#292F31] to-[#1E2526] p-3">
          <h2 className="text-base font-bold">{plan?.name ?? "—"}</h2>
          <p className="mt-1 text-xs leading-4 text-[#EDF0EF]">{plan?.description}</p>
          <div className="mt-3 flex items-center gap-1">
            <strong className="text-2xl">{typeof price === "number" ? `$${price}` : "—"}</strong>
            <span className="rounded bg-[#80680F] px-1.5 py-0.5 text-[9px]">{subscription?.billingCycle === "yearly" ? "/Year" : "/Month"}</span>
          </div>
          <ul className="mt-4 space-y-2 text-xs text-[#EDF0EF]">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5 text-[#E1E5E4]" />{b}</li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}

function DetailMeta({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div>
      <dt className="text-[#9BA4A4]">{label}</dt>
      <dd className={gold ? "mt-1 inline-block rounded-sm bg-[#756315] px-1 py-0.5 text-[#F5D857]" : "mt-1 text-[#DDE1E0]"}>{value}</dd>
    </div>
  );
}
function ProfileRow({ label, value, success }: { label: string; value: string; success?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-[#A1A9A9]">{label}</dt>
      <dd className={success ? "font-bold text-[#16C896]" : "font-bold text-[#F2F5F4]"}>{value}</dd>
    </div>
  );
}
