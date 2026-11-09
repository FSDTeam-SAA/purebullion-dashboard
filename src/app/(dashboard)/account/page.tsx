import type { Metadata } from "next";
import React from "react";
import AccountPageClient from "@/components/account/AccountPageClient";

export const metadata: Metadata = {
  title: "Account · Pure Bullion",
  description: "Manage your profile, security settings, notification preferences, and privacy data.",
};

export default function AccountPage() {
  return <AccountPageClient />;
}
