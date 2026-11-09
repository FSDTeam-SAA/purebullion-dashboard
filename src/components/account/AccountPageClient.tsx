"use client";

import React, { useState } from "react";
import ProfileCard from "./ProfileCard";
import SecurityCard from "./SecurityCard";
import NotificationPreferencesCard from "./NotificationPreferencesCard";
import PrivacyDataCard from "./PrivacyDataCard";
import ChangePasswordModal from "./ChangePasswordModal";

export default function AccountPageClient() {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-raleway">
      {/* Card 0: Personal Info & Profile Banner */}
      <ProfileCard />

      {/* Card 1: Security & Active Sessions */}
      <SecurityCard onOpenChangePassword={() => setIsChangePasswordOpen(true)} />

      {/* Card 2: Notification Preferences */}
      <NotificationPreferencesCard />

      {/* Card 3: Privacy and Data Management */}
      <PrivacyDataCard />

      {/* Change Password Modal (Figma node 765:28389) */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
}
