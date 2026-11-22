'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { settingsApi } from '../api/settings.api';
import { UpdateSettingsProfilePayload, ChangePasswordPayload } from '../types/settings.types';
import { getErrorMessage } from '@/services/apiClient';

export function useSettingsProfile() {
  return useQuery({
    queryKey: ['settings', 'profile'],
    queryFn: () => settingsApi.getProfile(),
    select: (res) => res.data,
  });
}

export function useUpdateSettingsProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      photoFile,
    }: {
      payload: UpdateSettingsProfilePayload;
      photoFile?: File | null;
    }) => settingsApi.updateProfile(payload, photoFile),
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['settings', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['account', 'profile'] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || 'Failed to update profile');
    },
  });
}

export function useChangeSettingsPassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => settingsApi.changePassword(payload),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || 'Failed to change password');
    },
  });
}

