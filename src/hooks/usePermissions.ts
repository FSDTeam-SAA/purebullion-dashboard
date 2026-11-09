'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { userService } from '@/services/user.service';

export interface PermissionsState {
  role: string;
  permissions: string[];
  isSuperAdmin: boolean;
  isReadOnly: boolean;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  canPerformAction: (permission?: string) => boolean;
  canAccessRoute: (pathname: string) => boolean;
}

function readStoredPermissions(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('adminPermissions');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

function readStoredRole(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem('adminRole') || '';
  } catch {
    return '';
  }
}

export function usePermissions(): PermissionsState {
  const { data: session, status } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session?.user as any;

  const [storedPermissions, setStoredPermissions] = useState<string[]>(readStoredPermissions);
  const [storedRole, setStoredRole] = useState<string>(readStoredRole);

  // Sync session permissions and role to localStorage
  useEffect(() => {
    if (Array.isArray(user?.permissions) && user.permissions.length > 0) {
      try {
        localStorage.setItem('adminPermissions', JSON.stringify(user.permissions));
      } catch {
        // ignore
      }
    }
    if (user?.role) {
      try {
        localStorage.setItem('adminRole', user.role);
      } catch {
        // ignore
      }
    }
  }, [user?.permissions, user?.role]);

  // If user is authenticated but permissions is empty, fetch user profile directly
  useEffect(() => {
    if (status !== 'authenticated') return;
    const hasAnyPermissions =
      (Array.isArray(user?.permissions) && user.permissions.length > 0) ||
      storedPermissions.length > 0;

    const currentRole = (user?.role || storedRole || '').trim().toLowerCase();
    const isSuper = currentRole === 'superadmin' || currentRole === 'super_admin';

    if (!hasAnyPermissions && !isSuper) {
      let isCancelled = false;
      userService
        .getProfile()
        .then((res) => {
          if (isCancelled) return;
          const profile = res?.data;
          if (Array.isArray(profile?.permissions)) {
            setStoredPermissions(profile.permissions);
            try {
              localStorage.setItem('adminPermissions', JSON.stringify(profile.permissions));
            } catch {
              // ignore
            }
          }
          if (profile?.role) {
            setStoredRole(profile.role);
            try {
              localStorage.setItem('adminRole', profile.role);
            } catch {
              // ignore
            }
          }
        })
        .catch(() => {
          // ignore profile fetch error
        });

      return () => {
        isCancelled = true;
      };
    }
  }, [status, user?.permissions, user?.role, storedPermissions.length, storedRole]);

  const rawRole: string = user?.role || storedRole || '';
  const role: string = rawRole.trim().toLowerCase();

  const sessionPermissions: unknown[] = Array.isArray(user?.permissions)
    ? user.permissions
    : [];
  const rawPermissions: unknown[] =
    sessionPermissions.length > 0 ? sessionPermissions : storedPermissions;

  const normalizedPermissions: string[] = rawPermissions.map((p) =>
    String(p).trim().toUpperCase()
  );

  const isSuperAdmin = role === 'superadmin' || role === 'super_admin';
  const isReadOnly =
    normalizedPermissions.includes('READ_ONLY') ||
    normalizedPermissions.includes('READONLY') ||
    role === 'read_only' ||
    role === 'readonly';

  const isLoading = status === 'loading';

  const hasPermission = (permission: string): boolean => {
    if (isSuperAdmin) return true;
    if (isReadOnly) return true;
    const target = String(permission).trim().toUpperCase();
    return normalizedPermissions.includes(target);
  };

  const canPerformAction = (permission?: string): boolean => {
    // Read-only accounts cannot take any mutating actions
    if (isReadOnly) return false;
    if (isSuperAdmin) return true;
    if (permission) {
      const target = String(permission).trim().toUpperCase();
      return normalizedPermissions.includes(target);
    }
    return true;
  };

  const canAccessRoute = (_pathname?: string): boolean => {
    void _pathname;
    // By default, allow authenticated admin access to dashboard routes
    return true;
  };

  return {
    role,
    permissions: normalizedPermissions,
    isSuperAdmin,
    isReadOnly,
    isLoading,
    hasPermission,
    canPerformAction,
    canAccessRoute,
  };
}
