"use client";

import React, { useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  MoreHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import TablePagination from "@/components/shared/TablePagination";
import { useDebouncedValue } from "@/components/shared/useDebouncedValue";
import { usePage } from "@/components/shared/usePage";
import { useUsers, useDeleteUser } from "./hooks/useUsers";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  subscription: "Essential" | "Professional" | "Elite";
  status: "Active" | "Suspended" | "In Active";
  joined: string;
  lastActive: string;
}

const tabs = ["All", "Active", "Suspended", "Inactive"] as const;
type TabType = (typeof tabs)[number];

const PAGE_SIZE = 10;
const TAB_PARAM: Record<string, string> = { All: "all", Active: "active", Suspended: "suspended", Inactive: "inactive" };

export default function UserManagementTable() {
  const deleteMutation = useDeleteUser();

  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const search = useDebouncedValue(searchQuery.trim());

  const [page, setPage] = usePage(`${activeTab}|${search}`);

  const { data: usersData, isLoading, isError } = useUsers({
    status: TAB_PARAM[activeTab],
    search: search || undefined,
    page,
    limit: PAGE_SIZE,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredUsers: UserItem[] = ((usersData as any)?.data?.users ?? []).map((u: any) => ({
    id: String(u._id),
    name: u.user?.name || u.email,
    email: u.user?.email || u.email,
    subscription: u.subscriptions,
    status: u.status,
    joined: u.joined ?? "—",
    lastActive: u.lastActive ?? "—",
  }));

  const confirmDelete = () => {
    if (!deleteUserId) return;
    deleteMutation.mutate(deleteUserId);
    setDeleteUserId(null);
  };

  return (
    <div className="space-y-6 font-raleway select-none">
      {/* Top Toolbar: Tabs, Search Bar, and Add New User Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 flex-1 max-w-3xl">
          {/* Tabs Pill Container */}
          <div className="inline-flex items-center p-1 rounded-lg bg-[#0C0F10] border border-[#1B2227] shrink-0">
            {tabs.map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer",
                    isSelected
                      ? "tab-gold-active text-white font-bold shadow-xs"
                      : "text-[#8E9CA8] hover:text-white hover:bg-white/5"
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Search Bar with ⌘K Badge */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-[#5B6675] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0C0F10] border border-[#1B2227] hover:border-[#2B353E] focus:border-[#E7C042]/70 focus:outline-none rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-[#5B6675] transition-all"
            />
          </div>
        </div>

      </div>

      {/* Main Table Container */}
      <div className="rounded-xl bg-[#0C0F10] border border-[#1B2227] shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="bg-[#171D1F] border-b border-[#1B2227] text-[11px] font-bold text-[#8E9CA8] tracking-wider uppercase">
                <th className="py-3.5 px-4 sm:px-6">USER</th>
                <th className="py-3.5 px-4 sm:px-6">EMAIL</th>
                <th className="py-3.5 px-4 sm:px-6">SUBSCRIPTIONS</th>
                <th className="py-3.5 px-4 sm:px-6">STATUS</th>
                <th className="py-3.5 px-4 sm:px-6">Joined</th>
                <th className="py-3.5 px-4 sm:px-6">Last Active</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#1B2227] text-xs sm:text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#718090]">
                    {isLoading ? "Loading users…" : isError ? "Could not load users." : "No users found."}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user: UserItem) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[#121719]/60 transition-colors group"
                  >
                    {/* User Name */}
                    <td className="py-4 px-4 sm:px-6 font-bold text-white tracking-tight whitespace-nowrap">
                      {user.name}
                    </td>

                    {/* Email */}
                    <td className="py-4 px-4 sm:px-6 text-[#8E9CA8] font-nunito whitespace-nowrap">
                      {user.email}
                    </td>

                    {/* Subscriptions */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      {user.subscription === "Essential" && (
                        <span className="px-2.5 py-1 rounded bg-[#182026] border border-[#2B353E] text-xs font-semibold text-[#D1D5DB]">
                          Essential
                        </span>
                      )}
                      {user.subscription === "Professional" && (
                        <span className="px-2.5 py-1 rounded bg-[#E7C042]/10 border border-[#E7C042]/30 text-xs font-semibold text-[#E7C042]">
                          Professional
                        </span>
                      )}
                      {user.subscription === "Elite" && (
                        <span className="px-2.5 py-1 rounded bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-xs font-semibold text-[#60A5FA]">
                          Elite
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      {user.status === "Active" && (
                        <span className="px-2.5 py-0.5 rounded-md bg-[#0E2922] border border-[#10B981]/30 text-xs font-semibold text-[#10B981] inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          Active
                        </span>
                      )}
                      {user.status === "Suspended" && (
                        <span className="px-2.5 py-0.5 rounded-md bg-[#2E1417] border border-[#EF4444]/30 text-xs font-semibold text-[#EF4444] inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                          Suspended
                        </span>
                      )}
                      {user.status === "In Active" && (
                        <span className="px-2.5 py-0.5 rounded-md bg-[#182026] border border-[#2B353E] text-xs font-semibold text-[#8E9CA8] inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8E9CA8]" />
                          In Active
                        </span>
                      )}
                    </td>

                    {/* Joined */}
                    <td className="py-4 px-4 sm:px-6 text-[#8E9CA8] font-nunito whitespace-nowrap">
                      {user.joined}
                    </td>

                    {/* Last Active */}
                    <td className="py-4 px-4 sm:px-6 text-[#8E9CA8] font-nunito whitespace-nowrap">
                      {user.lastActive}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          title="View user details"
                          className="p-1.5 rounded-md text-[#8E9CA8] hover:text-[#E7C042] hover:bg-[#182026] transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Delete User */}
                        <button
                          type="button"
                          onClick={() => setDeleteUserId(user.id)}
                          title="Delete user"
                          className="p-1.5 rounded-md text-[#8E9CA8] hover:text-[#EF4444] hover:bg-[#2E1417] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* More / Edit */}
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          title="More options"
                          className="p-1.5 rounded-md text-[#8E9CA8] hover:text-white hover:bg-[#182026] transition-colors cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination meta={(usersData as any)?.meta} onPageChange={setPage} />
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#0C0F10] border border-[#1B2227] rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">User Information</h3>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="text-[#8E9CA8] hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#121719] border border-[#1B2227] flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#182026] border border-[#E7C042]/40 text-[#E7C042] font-bold text-lg flex items-center justify-center">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    {selectedUser.name}
                  </h4>
                  <p className="text-xs text-[#8E9CA8]">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#121719] border border-[#1B2227]">
                  <span className="text-[#5B6675] block mb-1">Subscription</span>
                  <span className="font-bold text-white">
                    {selectedUser.subscription}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#121719] border border-[#1B2227]">
                  <span className="text-[#5B6675] block mb-1">Status</span>
                  <span
                    className={cn(
                      "font-bold",
                      selectedUser.status === "Active"
                        ? "text-[#10B981]"
                        : selectedUser.status === "Suspended"
                        ? "text-[#EF4444]"
                        : "text-[#8E9CA8]"
                    )}
                  >
                    {selectedUser.status}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#121719] border border-[#1B2227]">
                  <span className="text-[#5B6675] block mb-1">Joined Date</span>
                  <span className="font-bold text-white">
                    {selectedUser.joined}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#121719] border border-[#1B2227]">
                  <span className="text-[#5B6675] block mb-1">Last Active</span>
                  <span className="font-bold text-white">
                    {selectedUser.lastActive}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-lg bg-[#182026] text-white text-xs font-semibold hover:bg-[#222C35] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#0C0F10] border border-[#1B2227] rounded-xl max-w-sm w-full p-6 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center mb-4">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">
              Delete User?
            </h3>
            <p className="text-xs text-[#8E9CA8] leading-relaxed mb-5">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteUserId(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#8E9CA8] hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-[#EF4444] text-white text-xs font-bold hover:bg-[#DC2626] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
