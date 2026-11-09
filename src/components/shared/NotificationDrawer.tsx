"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Bell,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui.store";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  group: "Today" | "Yesterday" | "Previous";
  isRead: boolean;
  link?: string | null;
}

type FilterTab = "All" | "Read" | "Unread";

export default function NotificationDrawer() {
  const router = useRouter();
  const {
    notificationDrawerOpen,
    setNotificationDrawerOpen,
    setUnreadNotificationsCount,
  } = useUIStore();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Handle escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && notificationDrawerOpen) {
        setNotificationDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [notificationDrawerOpen, setNotificationDrawerOpen]);

  const handleItemClick = (item: NotificationItem) => {
    if (!item.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      );
      setUnreadNotificationsCount(Math.max(0, unreadCount - 1));
    }

    if (item.link) {
      setNotificationDrawerOpen(false);
      router.push(item.link);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadNotificationsCount(0);
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "Read") return item.isRead;
    if (activeTab === "Unread") return !item.isRead;
    return true;
  });

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setNotificationDrawerOpen(false)}
        className={cn(
          "fixed inset-0 bg-black/25 backdrop-blur-[2px] z-50 transition-opacity duration-300",
          notificationDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full sm:w-[380px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out",
          notificationDrawerOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Notifications Drawer"
      >
        {/* Drawer Header */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center gap-1 text-xs text-[#187BF4] hover:text-[#1466cc] font-medium cursor-pointer transition-colors"
                title="Mark all notifications as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setNotificationDrawerOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close notifications"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-5 flex items-center gap-6 border-b border-slate-100 shrink-0 text-sm">
          <button
            type="button"
            onClick={() => setActiveTab("All")}
            className={cn(
              "py-3 font-medium transition-colors relative cursor-pointer",
              activeTab === "All"
                ? "text-[#187BF4] font-semibold"
                : "text-slate-400 hover:text-slate-700"
            )}
          >
            All
            {activeTab === "All" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#187BF4] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("Read")}
            className={cn(
              "py-3 font-medium transition-colors relative cursor-pointer",
              activeTab === "Read"
                ? "text-[#187BF4] font-semibold"
                : "text-slate-400 hover:text-slate-700"
            )}
          >
            Read
            {activeTab === "Read" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#187BF4] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("Unread")}
            className={cn(
              "py-3 font-medium transition-colors relative flex items-center gap-1.5 cursor-pointer",
              activeTab === "Unread"
                ? "text-[#187BF4] font-semibold"
                : "text-slate-400 hover:text-slate-700"
            )}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#CC2B2B] text-white text-[10px] font-bold flex items-center justify-center leading-none">
                {unreadCount}
              </span>
            )}
            {activeTab === "Unread" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#187BF4] rounded-full" />
            )}
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
              <Bell className="w-10 h-10 mb-3 text-slate-300 stroke-[1.5]" />
              <p className="text-sm font-medium text-slate-600">No notifications yet</p>
              <p className="text-xs text-slate-400 mt-1">
                You will see notifications and alerts here when they arrive.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "flex items-start gap-3 p-2.5 rounded-xl transition-colors cursor-pointer group",
                    !item.isRead
                      ? "bg-sky-50/40 hover:bg-sky-50/70"
                      : "hover:bg-slate-50"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-semibold text-[#1E293B] truncate">
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-normal shrink-0">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
