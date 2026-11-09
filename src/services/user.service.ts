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
    const response = await apiClient.get<ApiResponse<UserProfile>>('/user/profile');
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
      formData.append('photo', photoFile);
      if (payload.firstName !== undefined) formData.append('firstName', payload.firstName.trim());
      if (payload.lastName !== undefined) formData.append('lastName', payload.lastName.trim());
      if (payload.email !== undefined) formData.append('email', payload.email.trim());
      if (payload.phoneNumber !== undefined) formData.append('phoneNumber', payload.phoneNumber.trim());

      const response = await apiClient.patch<ApiResponse<UserProfile>>(
        '/user/profile',
        formData
      );
      return response.data;
    }

    const response = await apiClient.patch<ApiResponse<UserProfile>>(
      '/user/profile',
      payload
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
