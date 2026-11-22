import { apiClient } from './apiClient';
import { ApiResponse } from '@/types/auth.types';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  photo?: string | null;
  profileImage?: string | null;
  role?: string;
  permissions?: string[];
  createdAt?: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  photo?: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export const userService = {
  /**
   * Fetch current user profile
   */
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/user/me');
    return response.data;
  },

  /**
   * Update profile (supports optional photo upload via multipart/form-data)
   */
  async updateProfile(
    payload: UpdateProfilePayload,
    photoFile?: File | null
  ): Promise<ApiResponse<UserProfile>> {
    if (photoFile) {
      const formData = new FormData();
      formData.append('profileImage', photoFile);
      if (payload.firstName || payload.lastName) {
        formData.append('name', `${payload.firstName || ''} ${payload.lastName || ''}`.trim());
      }
      if (payload.phoneNumber) formData.append('phone', payload.phoneNumber.trim());

      await apiClient.post('/user/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    const name = `${payload.firstName || ''} ${payload.lastName || ''}`.trim();
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      '/user/me',
      {
        name: name || undefined,
        phone: payload.phoneNumber || undefined,
      }
    );
    return response.data;
  },

  /**
   * Change user password securely
   */
  async changePassword(
    payload: ChangePasswordPayload
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/change-password',
      payload
    );
    return response.data;
  },
};
