import { apiClient } from '@/services/apiClient';
import { ApiResponse } from '@/types/auth.types';
import {
  SettingsProfile,
  UpdateSettingsProfilePayload,
  ChangePasswordPayload,
} from '../types/settings.types';

export const settingsApi = {
  getProfile: async (): Promise<ApiResponse<SettingsProfile>> => {
    const res = await apiClient.get<ApiResponse<SettingsProfile>>('/user/me');
    return res.data;
  },

  updateProfile: async (
    payload: UpdateSettingsProfilePayload,
    photoFile?: File | null
  ): Promise<ApiResponse<SettingsProfile>> => {
    if (photoFile) {
      const formData = new FormData();
      formData.append('profileImage', photoFile);
      if (payload.name) formData.append('name', payload.name);
      if (payload.firstName || payload.lastName) {
        formData.append('name', `${payload.firstName || ''} ${payload.lastName || ''}`.trim());
      }
      if (payload.email) formData.append('email', payload.email);
      if (payload.phone || payload.phoneNumber) {
        formData.append('phone', payload.phone || payload.phoneNumber || '');
      }

      await apiClient.post('/user/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    const name = payload.name || `${payload.firstName || ''} ${payload.lastName || ''}`.trim();
    const res = await apiClient.put<ApiResponse<SettingsProfile>>('/user/me', {
      name: name || undefined,
      phone: payload.phone || payload.phoneNumber || undefined,
    });
    return res.data;
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<ApiResponse<{ message: string }>> => {
    const res = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/change-password',
      payload
    );
    return res.data;
  },
};

