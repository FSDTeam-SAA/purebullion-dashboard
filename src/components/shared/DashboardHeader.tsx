"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Bell, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/apiClient";
import { useUIStore } from "@/store/ui.store";
import { useSession } from "next-auth/react";

export default function DashboardHeader() {
  const pathname = usePathname();
  const {
    toggleMobileSidebar,
    toggleNotificationDrawer,
    unreadNotificationsCount,
  } = useUIStore();
  const { data: session } = useSession();

  // Real market state from the backend; the pill is hidden if it cannot be loaded.
  const { data: marketState } = useQuery({
    queryKey: ["header-market-state"],
    queryFn: async () => {
      const res = await apiClient.get("/market-data/market-state");
      const payload = res.data?.data;
      const entry = Array.isArray(payload) ? payload[0] : payload?.market_state?.[0] ?? payload;
      return entry as { is_market_open?: boolean; name?: string } | undefined;
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
    retry: false,
  });

  const getPageInfo = () => {
    if (pathname === "/dashboard" || pathname === "/") {
      return {
        title: "Dashboard",
        subtitle: "Monitor the entire Pure Bullion platform",
        isBreadcrumb: false,
      };
    }
    if (pathname === "/users" || pathname.startsWith("/users")) {
      return {
        title: "User Management",
        breadcrumbLabel: "Users",
        isBreadcrumb: true,
      };
    }
    if (pathname === "/market-data" || pathname.startsWith("/market-data")) {
      return {
        title: "Market & Data",
        breadcrumbLabel: "Market & Data",
        isBreadcrumb: true,
      };
    }
    if (pathname.startsWith("/settings") || pathname.startsWith("/account")) {
      return {
        title: "Account",
        breadcrumbLabel: "Settings",
        isBreadcrumb: true,
      };
    }
    const segment = pathname.split("/").filter(Boolean)[0] || "Dashboard";
    const formatted = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    return {
      title: formatted,
      breadcrumbLabel: formatted,
      isBreadcrumb: true,
    };
  };

  const pageInfo = getPageInfo();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session?.user as any;
  const userName = user?.name || user?.email || "Admin";
  const userRole = user?.role || "Admin";
  const userProfileImage = user?.profileImage || null;
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="bg-[#080B0C] border-b border-[#1B2227] px-4 sm:px-6 lg:px-8 h-[76px] z-10 relative flex items-center justify-between gap-4 font-raleway text-white select-none">
      {/* Left: Mobile Toggle & Page Title with Subtitle */}
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight truncate">
            {pageInfo.title}
          </h1>
          {pageInfo.isBreadcrumb ? (
            <div className="flex items-center gap-1.5 text-xs text-[#718090] font-normal leading-tight hidden sm:flex mt-0.5">
              <Link href="/dashboard" className="hover:text-[#E7C042] transition-colors">
                Dashboard
              </Link>
              <span className="text-[#414E59]">/</span>
              <span className="text-[#D1D5DB] font-medium">{pageInfo.breadcrumbLabel}</span>
            </div>
          ) : (
            <p className="text-xs text-[#718090] font-normal leading-tight hidden sm:block mt-0.5">
              {pageInfo.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Search, Market status, Notifications, User profile */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Market Status Pill */}
        {typeof marketState?.is_market_open === "boolean" && (
          <div
            className={`hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-lg border ${
              marketState.is_market_open ? "bg-[#0E2922] border-[#10B981]/30" : "bg-[#2E1417] border-[#EF4444]/30"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${marketState.is_market_open ? "bg-[#10B981] animate-pulse" : "bg-[#EF4444]"}`} />
            <span className={`text-xs font-semibold ${marketState.is_market_open ? "text-[#10B981]" : "text-[#EF4444]"}`}>
              {marketState.is_market_open ? "Market open" : "Market closed"}
            </span>
          </div>
        )}

        {/* Notification Bell with Badge */}
        <button
          type="button"
          onClick={toggleNotificationDrawer}
          className="relative p-2 rounded-lg bg-[#0C0F10] border border-[#222C35] hover:border-[#354350] hover:text-white transition-colors cursor-pointer text-[#8E9CA8]"
          title="Notifications"
          aria-label="Toggle notifications drawer"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (<span className="absolute -top-1 -right-1 w-4 h-4 bg-[#CC2B2B] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none ring-2 ring-[#080B0C]">
            {unreadNotificationsCount}
          </span>)}
        </button>

        {/* User Profile Pill */}
        <Link
          href="/settings"
          className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-[#0C0F10] border border-[#222C35] hover:border-[#354350] transition-colors cursor-pointer select-none group"
          title="Account Settings"
        >
          {/* Circular Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#A48226] to-[#E7C042] text-black flex items-center justify-center font-bold text-xs shrink-0 shadow-xs overflow-hidden">
            {userProfileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userProfileImage}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              userInitials
            )}
          </div>

          {/* Name & Role */}
          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-xs font-semibold text-white group-hover:text-[#E7C042] transition-colors truncate max-w-[110px]">
              {userName}
            </span>
            <span className="text-[10px] text-[#718090] capitalize">
              {userRole}
            </span>
          </div>

          <ChevronDown className="w-3.5 h-3.5 text-[#5B6675] group-hover:text-white transition-colors hidden sm:block" />
        </Link>
      </div>
    </header>
  );
}
