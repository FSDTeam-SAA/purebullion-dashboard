'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { accountApi } from '../api/account.api';
import {
  UpdateProfilePayload,
  ChangePasswordPayload,
  NotificationPreferences,
  CloseAccountPayload,
} from '../types/account.types';
import { getErrorMessage } from '@/services/apiClient';

export function useAccountProfile() {
  return useQuery({
    queryKey: ['account', 'profile'],
    queryFn: () => accountApi.getProfile(),
    select: (res) => res.data,
  });
}

export function useUpdateAccountProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => accountApi.updateProfile(payload),
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['account', 'profile'] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || 'Failed to update profile');
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => accountApi.uploadAvatar(file),
    onSuccess: () => {
      toast.success('Avatar updated successfully');
      queryClient.invalidateQueries({ queryKey: ['account', 'profile'] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || 'Failed to upload avatar');
    },
  });
}

export function useChangeAccountPassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => accountApi.changePassword(payload),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || 'Failed to change password');
    },
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ['account', 'notification-preferences'],
    queryFn: () => accountApi.getNotificationPreferences(),
    select: (res) => res.data,
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (preferences: Partial<NotificationPreferences>) =>
      accountApi.updateNotificationPreferences(preferences),
    onSuccess: () => {
      toast.success('Notification preferences updated');
      queryClient.invalidateQueries({ queryKey: ['account', 'notification-preferences'] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || 'Failed to update preferences');
    },
  });
}

export function useExportUserData() {
  return useMutation({
    mutationFn: () => accountApi.exportUserData(),
    onSuccess: (res) => {
      const dataStr =
        'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `user-data-export-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('Data exported successfully');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || 'Failed to export data');
    },
  });
}

export function useDeleteConversationHistory() {
  return useMutation({
    mutationFn: () => accountApi.deleteConversationHistory(),
    onSuccess: () => {
      toast.success('Conversation history deleted');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || 'Failed to delete history');
    },
  });
}

export function useCloseAccount() {
  return useMutation({
    mutationFn: (payload: CloseAccountPayload) => accountApi.closeAccount(payload),
    onSuccess: () => {
      toast.success('Account closure request submitted');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || 'Failed to close account');
    },
  });
}

