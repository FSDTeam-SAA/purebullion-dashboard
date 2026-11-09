import React from "react";
import UserManagementTable from "@/components/users/UserManagementTable";

export const metadata = {
  title: "User Management · Pure Bullion",
  description: "Manage users, subscriptions, and platform access",
};

export default function UserManagementPage() {
  return (
    <div className="space-y-6 pb-12 font-raleway">
      <UserManagementTable />
    </div>
  );
}
