'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActionButtonProps {
  /** Main button text (e.g. "Add a Leads") */
  title: string;
  /** Subtitle text under the main title (e.g. "Create manually") */
  subtitle?: string;
  /** Optional icon component or ReactNode. Defaults to Plus icon */
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }> | React.ReactNode;
  /** Click handler to update state, open modals, or trigger callbacks */
  onClick?: () => void;
  /** If provided, renders as a Next.js Link instead of a button */
  href?: string;
  /** Button visual style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'dark';
  /** Additional container classes */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Type attribute for button */
  type?: 'button' | 'submit' | 'reset';
}

export default function ActionButton({
  title,
  subtitle,
  icon: Icon = Plus,
  onClick,
  href,
  variant = 'primary',
  className,
  disabled = false,
  type = 'button',
}: ActionButtonProps) {
  const variantStyles = {
    primary:
      'bg-[#0073DF] hover:bg-[#0063C2] text-white shadow-sm hover:shadow active:scale-[0.98]',
    secondary:
      'bg-[#E8F2FD] hover:bg-[#D5E7FA] text-[#0073DF] active:scale-[0.98]',
    outline:
      'bg-white border border-[#0073DF] text-[#0073DF] hover:bg-[#F0F7FF] active:scale-[0.98]',
    dark:
      'bg-[#0C3866] hover:bg-[#082647] text-white shadow-sm active:scale-[0.98]',
  };

  const content = (
    <>
      {/* Icon Area */}
      <div className="shrink-0 flex items-center justify-center">
        {React.isValidElement(Icon) ? (
          Icon
        ) : typeof Icon === 'function' ? (
          <Icon className="w-5 h-5 shrink-0" strokeWidth={2.5} />
        ) : (
          <Plus className="w-5 h-5 shrink-0" strokeWidth={2.5} />
        )}
      </div>

      {/* Text Container */}
      <div className="flex flex-col text-left leading-none justify-center">
        <span className="text-sm font-semibold tracking-tight leading-tight">
          {title}
        </span>
        {subtitle && (
          <span
            className={cn(
              'text-[11px] font-normal leading-tight mt-0.5',
              variant === 'primary' || variant === 'dark'
                ? 'text-white/80'
                : 'text-slate-500'
            )}
          >
            {subtitle}
          </span>
        )}
      </div>
    </>
  );

  const baseClasses = cn(
    'inline-flex items-center gap-2.5 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-xl font-medium transition-all cursor-pointer select-none disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none',
    variantStyles[variant],
    className
  );

  if (href && !disabled) {
    return (
      <Link href={href} onClick={onClick} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {content}
    </button>
  );
}

