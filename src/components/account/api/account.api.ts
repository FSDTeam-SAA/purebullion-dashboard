import { apiClient } from '@/services/apiClient';
import { ApiResponse } from '@/types/auth.types';
import {
  UserAccountProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
  NotificationPreferences,
  CloseAccountPayload,
} from '../types/account.types';

export const accountApi = {
  getProfile: async (): Promise<ApiResponse<UserAccountProfile>> => {
    const res = await apiClient.get<ApiResponse<UserAccountProfile>>('/user/me');
    return res.data;
  },

  updateProfile: async (
    payload: UpdateProfilePayload
  ): Promise<ApiResponse<UserAccountProfile>> => {
    const res = await apiClient.put<ApiResponse<UserAccountProfile>>('/user/me', payload);
    return res.data;
  },

  uploadAvatar: async (file: File): Promise<ApiResponse<{ profileImage: string }>> => {
    const formData = new FormData();
    formData.append('profileImage', file);
    const res = await apiClient.post<ApiResponse<{ profileImage: string }>>(
      '/user/upload-avatar',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return res.data;
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<ApiResponse<{ message: string }>> => {
    const res = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/change-password',
      payload
    );
    return res.data;
  },

  getNotificationPreferences: async (): Promise<ApiResponse<NotificationPreferences>> => {
    const res = await apiClient.get<ApiResponse<NotificationPreferences>>(
      '/user/notification-preferences'
    );
    return res.data;
  },

  updateNotificationPreferences: async (
    preferences: Partial<NotificationPreferences>
  ): Promise<ApiResponse<NotificationPreferences>> => {
    const res = await apiClient.put<ApiResponse<NotificationPreferences>>(
      '/user/notification-preferences',
      preferences
    );
    return res.data;
  },

  exportUserData: async (): Promise<ApiResponse<any>> => {
    const res = await apiClient.get<ApiResponse<any>>('/user/privacy/export-data');
    return res.data;
  },

  deleteConversationHistory: async (): Promise<ApiResponse<{ message: string }>> => {
    const res = await apiClient.delete<ApiResponse<{ message: string }>>(
      '/user/privacy/conversations'
    );
    return res.data;
  },

  closeAccount: async (payload: CloseAccountPayload): Promise<ApiResponse<{ message: string }>> => {
    const res = await apiClient.post<ApiResponse<{ message: string }>>(
      '/user/privacy/close-account',
      payload
    );
    return res.data;
  },
};

