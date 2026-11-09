'use client';

import React from 'react';
import { User, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AccountTabType = 'profile' | 'password';

interface AccountNavProps {
  activeTab: AccountTabType;
  onTabChange: (tab: AccountTabType) => void;
}

export default function AccountNav({
  activeTab,
  onTabChange,
}: AccountNavProps) {
  const navItems = [
    {
      id: 'profile' as AccountTabType,
      label: 'Profile',
      icon: User,
    },
    {
      id: 'password' as AccountTabType,
      label: 'Change Password',
      icon: Shield,
    },
  ];

  return (
    <div className="w-full lg:w-80 xl:w-96 shrink-0 bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 flex flex-col gap-4 overflow-hidden">
      {/* Card Header */}
      <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-gray-900 text-xl font-bold tracking-tight">Account</h2>
      </div>

      {/* Navigation Buttons */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer text-left',
                isActive
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-stone-500 hover:bg-slate-50 hover:text-stone-700'
              )}
            >
              <Icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-white' : 'text-stone-500')} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

