'use client';

import React, { useState } from 'react';

export interface WelcomeHeaderProps {
  name?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 22) return 'Good evening';
  return 'Good night';
}

export default function WelcomeHeader({
  name = 'User',
  title,
  subtitle,
  action,
  children,
  className = '',
}: WelcomeHeaderProps) {
  const [greeting] = useState<string>(getGreeting);

  // Extract first name (e.g., "John Doe" -> "John")
  const firstName = name.trim().split(' ')[0] || 'User';

  const headingText = title || `${greeting}, ${firstName}.`;
  const subText =
    subtitle || `Welcome back, ${firstName}! Here's an overview of your account.`;

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}
    >
      {/* Left Side: Title and Subtitle */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {headingText}
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-normal">
          {subText}
        </p>
      </div>

      {/* Right Side: Action Button(s) */}
      {(action || children) && (
        <div className="shrink-0 flex items-center gap-3">
          {action}
          {children}
        </div>
      )}
    </div>
  );
}
