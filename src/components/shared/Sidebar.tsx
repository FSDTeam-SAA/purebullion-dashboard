"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  Users,
  Crown,
  Layers,
  Activity,
  MessageCircle,
  FileText,
  HelpCircle,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useUIStore } from "@/store/ui.store";

export interface SidebarSection {
  title: string;
  items: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

export const sidebarSections: SidebarSection[] = [
  {
    title: "MAIN",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
      { name: "User Management", href: "/users", icon: Users },
      { name: "Subscriptions", href: "/subscriptions", icon: Crown },
      { name: "Market & Data", href: "/market-data", icon: Layers },
      { name: "Signals", href: "/signals", icon: Activity },
      { name: "Community", href: "#community", icon: MessageCircle },
    ],
  },
  {
    title: "PLATFORM",
    items: [
      { name: "News & Research", href: "#news-research", icon: FileText },
      { name: "Help and Support", href: "/support", icon: HelpCircle },
    ],
  },
  {
    title: "ACTIVITY",
    items: [
      { name: "Alerts", href: "/alerts", icon: Bell, badge: "01" },
    ],
  },
  {
    title: "ACCOUNTS",
    items: [
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export const sidebarNavigation = sidebarSections;

export function DashboardSidebar() {
  const pathname = usePathname();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();
  const { data: session } = useSession();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session?.user as any;
  const userName = user?.name || "Peter";
  const userRole = user?.role || "Super Admin";
  const userImage = user?.profileImage || null;
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    setLogoutModalOpen(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("adminPermissions");
      localStorage.removeItem("adminRole");
    }
    signOut({ callbackUrl: "/login" });
  };

  const sidebarContent = (
    <aside className="flex flex-col w-[260px] bg-[#0C0F10] border-r border-[#1B2227] h-full relative select-none overflow-hidden font-raleway text-white">
      {/* Brand / Logo Header */}
      <div className="h-[72px] px-5 flex items-center justify-between border-b border-[#1B2227] shrink-0 bg-[#0C0F10] z-10">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/images/purebullion-logo.png"
            alt="Pure Bullion"
            width={180}
            height={48}
            priority
            className="h-auto w-auto max-h-10 object-contain"
          />
        </Link>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-3 py-4 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {sidebarSections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <h3 className="px-3 text-[11px] font-semibold text-[#5B6675] tracking-wider uppercase">
              {section.title}
            </h3>

            <nav className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    item.href !== "#" &&
                    pathname.startsWith(item.href));

                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all group relative",
                      isActive
                        ? "sidebar-active-tab text-white font-semibold"
                        : "text-[#8E9CA8] hover:bg-[#141A20] hover:text-white font-normal"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0 relative z-10">
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-colors",
                          isActive
                            ? "text-[#E7C042]"
                            : "text-[#6A7885] group-hover:text-white"
                        )}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className="relative z-10 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#CC2B2B] text-white leading-none">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Sidebar Footer User Pill */}
      <div className="p-3 border-t border-[#1B2227] shrink-0 bg-[#0C0F10]">
        <div
          onClick={() => setLogoutModalOpen(true)}
          className="flex items-center justify-between p-2.5 rounded-xl bg-[#141A20] hover:bg-[#1A222A] border border-[#222C35] transition-all cursor-pointer group"
          title="Click to Logout"
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#A48226] to-[#E7C042] text-black font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
              {userImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userImage}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                userInitials
              )}
            </div>

            {/* Name & Role */}
            <div className="flex flex-col text-left min-w-0">
              <span className="text-xs font-semibold text-white group-hover:text-[#E7C042] transition-colors leading-tight truncate">
                {userName}
              </span>
              <span className="text-[11px] text-[#718090] leading-tight capitalize truncate">
                {userRole}
              </span>
            </div>
          </div>

          <div className="flex items-center text-[#718090] group-hover:text-white transition-colors">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutModalOpen} onOpenChange={setLogoutModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#11161B] border-[#222C35] text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-lg">Confirm Logout</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#8E9CA8]">
            Are you sure you want to log out of Pure Bullion? You will need to log in again to access the dashboard.
          </p>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setLogoutModalOpen(false)}
              className="border-[#2E3A45] bg-transparent text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-[#CC2B2B] hover:bg-[#B02020] text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:flex lg:shrink-0 h-screen">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-50 flex h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardSidebar;
