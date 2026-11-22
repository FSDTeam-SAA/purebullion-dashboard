"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  UserPlus,
  Eye,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUsers, useDeleteUser, useUpdateUser } from "./hooks/useUsers";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  subscription: "Essential" | "Professional" | "Elite";
  status: "Active" | "Suspended" | "In Active";
  joined: string;
  lastActive: string;
}

const initialUsers: UserItem[] = [
  {
    id: "usr-1",
    name: "James Wilson",
    email: "james.wilson@email.com",
    subscription: "Essential",
    status: "Active",
    joined: "2024-01-15",
    lastActive: "2 min ago",
  },
  {
    id: "usr-2",
    name: "Daniel Carter",
    email: "daniel.carter@email.com",
    subscription: "Essential",
    status: "Active",
    joined: "2024-03-22",
    lastActive: "2 min ago",
  },
  {
    id: "usr-3",
    name: "Olivia Bennett",
    email: "olivia.b@email.com",
    subscription: "Essential",
    status: "Suspended",
    joined: "2024-03-22",
    lastActive: "3 days ago",
  },
  {
    id: "usr-4",
    name: "Sarah Mitchell",
    email: "s.mitchell@email.com",
    subscription: "Professional",
    status: "Active",
    joined: "2024-02-03",
    lastActive: "2 min ago",
  },
  {
    id: "usr-5",
    name: "Marcus Chen",
    email: "priya.sharma@email.com",
    subscription: "Elite",
    status: "In Active",
    joined: "2024-03-22",
    lastActive: "2 weeks ago",
  },
  {
    id: "usr-6",
    name: "Daniel Carter",
    email: "daniel.carter@email.com",
    subscription: "Essential",
    status: "Active",
    joined: "2024-03-22",
    lastActive: "2 min ago",
  },
  {
    id: "usr-7",
    name: "Sarah Mitchell",
    email: "s.mitchell@email.com",
    subscription: "Professional",
    status: "Active",
    joined: "2024-02-03",
    lastActive: "2 min ago",
  },
  {
    id: "usr-8",
    name: "Marcus Chen",
    email: "priya.sharma@email.com",
    subscription: "Elite",
    status: "In Active",
    joined: "2024-03-22",
    lastActive: "2 weeks ago",
  },
  {
    id: "usr-9",
    name: "Ethan Rodriguez",
    email: "ava.thompson@email.com",
    subscription: "Professional",
    status: "Suspended",
    joined: "2024-03-22",
    lastActive: "2 weeks ago",
  },
];

const tabs = ["All", "Active", "Suspended", "Inactive"] as const;
type TabType = (typeof tabs)[number];

export default function UserManagementTable() {
  const { data: usersData } = useUsers();
  const deleteMutation = useDeleteUser();
  const updateMutation = useUpdateUser();

  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  // New user form state
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserSub, setNewUserSub] = useState<"Essential" | "Professional" | "Elite">("Essential");
  const [newUserStatus, setNewUserStatus] = useState<"Active" | "Suspended" | "In Active">("Active");

  // Effective users list (API data if loaded, else state)
  const currentUsers = useMemo(() => {
    const rawUsers: any[] = (usersData as any)?.data?.users || (usersData as any)?.users;
    if (rawUsers && rawUsers.length > 0) {
      return rawUsers.map((u: any) => ({
        id: u._id || u.id || "",
        name: u.user?.name || u.name || u.email,
        email: u.user?.email || u.email,
        subscription: (u.subscriptions || (u as any).subscriptionPlan?.name || (u as any).currentPlan?.name || "Essential") as UserItem["subscription"],
        status: (u.status === "Suspended" ? "Suspended" : u.status === "In Active" ? "In Active" : "Active") as UserItem["status"],
        joined: u.joined || (u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "2024-01-15"),
        lastActive: u.lastActive || "Recently",
      }));
    }
    return users;
  }, [usersData, users]);

  // Filtering
  const filteredUsers = useMemo(() => {
    return currentUsers.filter((u: UserItem) => {
      // Tab filter
      if (activeTab === "Active" && u.status !== "Active") return false;
      if (activeTab === "Suspended" && u.status !== "Suspended") return false;
      if (activeTab === "Inactive" && u.status !== "In Active") return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(query);
        const matchesEmail = u.email.toLowerCase().includes(query);
        const matchesSub = u.subscription.toLowerCase().includes(query);
        return matchesName || matchesEmail || matchesSub;
      }
      return true;
    });
  }, [currentUsers, activeTab, searchQuery]);

  // Handle Add User
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: UserItem = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      subscription: newUserSub,
      status: newUserStatus,
      joined: new Date().toISOString().split("T")[0],
      lastActive: "Just now",
    };

    setUsers([newUser, ...users]);
    setNewUserName("");
    setNewUserEmail("");
    setIsAddModalOpen(false);
  };

  // Handle Delete
  const confirmDelete = () => {
    if (!deleteUserId) return;
    deleteMutation.mutate(deleteUserId);
    setUsers((prev) => prev.filter((u) => u.id !== deleteUserId));
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
              className="w-full bg-[#0C0F10] border border-[#1B2227] hover:border-[#2B353E] focus:border-[#E7C042]/70 focus:outline-none rounded-lg pl-9 pr-14 py-2 text-xs text-white placeholder-[#5B6675] transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[#182026] border border-[#2B353E] text-[10px] font-mono text-[#8E9CA8] pointer-events-none">
              ⌘K
            </div>
          </div>
        </div>

        {/* Right Side: Gold Add New User Button */}
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg gold-gradient-btn text-black text-xs font-bold shadow-md hover:brightness-105 active:scale-98 transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New User</span>
        </button>
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
                    No users found matching your search.
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

        {/* Table Pagination Footer */}
        <div className="p-4 sm:px-6 border-t border-[#1B2227] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-[#8E9CA8]">
            Showing <span className="font-semibold text-white">1</span> to{" "}
            <span className="font-semibold text-white">
              {Math.min(filteredUsers.length, 9)}
            </span>{" "}
            of <span className="font-semibold text-white">120</span> results
          </div>

          <div className="flex items-center gap-1.5">
            {/* Prev button */}
            <button
              type="button"
              className="p-1.5 rounded-md text-[#5B6675] hover:text-white hover:bg-[#182026] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              disabled
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page 1 (Active) */}
            <button
              type="button"
              className="w-7 h-7 rounded-md tab-gold-active text-white font-bold flex items-center justify-center shadow-xs cursor-pointer"
            >
              1
            </button>

            {/* Page 2 */}
            <button
              type="button"
              className="w-7 h-7 rounded-md text-[#8E9CA8] hover:text-white hover:bg-[#182026] flex items-center justify-center cursor-pointer font-medium"
            >
              2
            </button>

            {/* Page 3 */}
            <button
              type="button"
              className="w-7 h-7 rounded-md text-[#8E9CA8] hover:text-white hover:bg-[#182026] flex items-center justify-center cursor-pointer font-medium"
            >
              3
            </button>

            <span className="px-1 text-[#5B6675]">...</span>

            {/* Page 17 */}
            <button
              type="button"
              className="w-7 h-7 rounded-md text-[#8E9CA8] hover:text-white hover:bg-[#182026] flex items-center justify-center cursor-pointer font-medium"
            >
              17
            </button>

            {/* Next button */}
            <button
              type="button"
              className="p-1.5 rounded-md text-[#8E9CA8] hover:text-white hover:bg-[#182026] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add New User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#0C0F10] border border-[#1B2227] rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#E7C042]" />
                <h3 className="text-lg font-bold text-white">Add New User</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#8E9CA8] hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8E9CA8] uppercase mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-[#121719] border border-[#1B2227] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#5B6675] focus:outline-none focus:border-[#E7C042]/70"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8E9CA8] uppercase mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full bg-[#121719] border border-[#1B2227] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#5B6675] focus:outline-none focus:border-[#E7C042]/70"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8E9CA8] uppercase mb-1.5">
                    Plan
                  </label>
                  <select
                    value={newUserSub}
                    onChange={(e) =>
                      setNewUserSub(
                        e.target.value as "Essential" | "Professional" | "Elite"
                      )
                    }
                    className="w-full bg-[#121719] border border-[#1B2227] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#E7C042]/70"
                  >
                    <option value="Essential">Essential</option>
                    <option value="Professional">Professional</option>
                    <option value="Elite">Elite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8E9CA8] uppercase mb-1.5">
                    Status
                  </label>
                  <select
                    value={newUserStatus}
                    onChange={(e) =>
                      setNewUserStatus(
                        e.target.value as "Active" | "Suspended" | "In Active"
                      )
                    }
                    className="w-full bg-[#121719] border border-[#1B2227] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#E7C042]/70"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="In Active">In Active</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#8E9CA8] hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg gold-gradient-btn text-black text-xs font-bold shadow-md hover:brightness-105"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
