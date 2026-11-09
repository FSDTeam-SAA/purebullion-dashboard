'use client';

import React from 'react';
import Image from 'next/image';

interface AuthCardLayoutProps {
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
}

export default function AuthCardLayout({
  title,
  subtitle,
  children,
}: AuthCardLayoutProps) {
  return (
    <main className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#051115] overflow-x-hidden font-raleway">
      {/* Background Trading Monitor Room Image */}
      <Image
        src="/images/auth-bg.png"
        alt="Trading Floor Background"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center pointer-events-none select-none"
      />

      {/* Subtle vignette dark overlay */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Centered Glassmorphic Card */}
      <div className="relative z-10 w-full max-w-[552px] bg-black/25 backdrop-blur-[86px] border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-10 shadow-2xl transition-all">
        {/* Pure Bullion Logo */}
        <div className="flex justify-center mb-6 select-none">
          <Image
            src="/images/purebullion-logo.png"
            alt="Pure Bullion - Information Creates Opportunity"
            width={340}
            height={90}
            priority
            className="h-auto w-auto max-w-[280px] sm:max-w-[340px] object-contain drop-shadow-md"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold italic text-white tracking-tight text-center mb-2 font-raleway">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[#A2ABA8] font-normal text-center mb-8 max-w-[420px] mx-auto leading-relaxed font-raleway">
          {subtitle}
        </p>

        {/* Form Body */}
        {children}
      </div>
    </main>
  );
}
