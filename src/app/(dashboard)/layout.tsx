import React, { ReactNode } from "react";
import { DashboardSidebar } from "@/components/shared/Sidebar";
import DashboardHeader from "@/components/shared/DashboardHeader";
import NotificationDrawer from "@/components/shared/NotificationDrawer";
import RouteAccessGuard from "@/components/shared/RouteAccessGuard";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0C0F10] font-raleway text-white relative">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col bg-[#121719] overflow-hidden">
        {/* Top Header */}
        <DashboardHeader />

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#121719] scrollbar-thin scrollbar-thumb-slate-800">
          <RouteAccessGuard>
            <div className="max-w-[1660px] mx-auto space-y-6">
              {children}
            </div>
          </RouteAccessGuard>
        </main>
      </div>

      {/* Slide-over Notification Drawer */}
      <NotificationDrawer />
    </div>
  );
}
