'use client';

import React, { useState } from 'react';
import WelcomeHeader from '@/components/shared/DashboardHeaderText';
import AccountNav, { AccountTabType } from './AccountNav';
import ProfileForm from './ProfileForm';
import ChangePasswordForm from './ChangePasswordForm';

export default function SettingsPageClient() {
  const [activeTab, setActiveTab] = useState<AccountTabType>('profile');

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <WelcomeHeader
        title="Account"
        subtitle="Manage your membership and get support."
      />         

      {/* Main Content: Left Nav + Right Form */}
      <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
        {/* Left Navigation Card */}
        <AccountNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Right Content Form */}
        <div className="flex-1 w-full">
          {activeTab === 'profile' ? (
            <ProfileForm />
          ) : (
            <ChangePasswordForm/>
          )}
        </div>
      </div>
    </div>
  );
}

