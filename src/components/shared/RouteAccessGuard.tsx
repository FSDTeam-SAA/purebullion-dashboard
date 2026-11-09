'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { usePermissions } from '@/hooks/usePermissions';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RouteAccessGuardProps {
  children: React.ReactNode;
}

export default function RouteAccessGuard({ children }: RouteAccessGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();
  const { canAccessRoute, isLoading } = usePermissions();

  // Allow children to render while authentication or permissions are resolving
  if (status === 'loading' || isLoading) {
    return <>{children}</>;
  }

  // Common routes accessible to all authenticated users
  if (
    pathname === '/dashboard' ||
    pathname === '/settings' ||
    pathname.startsWith('/account')
  ) {
    return <>{children}</>;
  }

  const isAllowed = canAccessRoute(pathname);

  if (!isAllowed) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-5 text-amber-600 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          Access Restricted
        </h2>
        <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
          You do not have permission to view this section with your current admin account.
          Please contact your Super Admin to request access.
        </p>
        <Button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-2 bg-[#0c3866] hover:bg-[#092949] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
