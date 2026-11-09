import { apiClient } from './apiClient';
import {
  ApiResponse,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponseData,
  ResetPasswordRequest,
  VerifyOtpRequest,
  VerifyOtpResponseData,
} from '@/types/auth.types';

export const authService = {
  /**
   * Log in user with email & password
   */
  async login(payload: LoginRequest): Promise<ApiResponse<LoginResponseData>> {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>(
      '/auth/login',
      payload
    );
    if (response.data.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }
    return response.data;
  },

  /**
   * Request password reset OTP code
   */
  async forgotPassword(
    payload: ForgotPasswordRequest
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/forgot-password',
      payload
    );
    return response.data;
  },

  /**
   * Verify email OTP code and retrieve reset token
   */
  async verifyEmailOtp(
    payload: VerifyOtpRequest
  ): Promise<ApiResponse<VerifyOtpResponseData>> {
    const response = await apiClient.post<ApiResponse<VerifyOtpResponseData>>(
      '/auth/verify-email-otp',
      payload
    );
    return response.data;
  },

  /**
   * Reset password using reset token and new password
   */
  async resetPassword(
    payload: ResetPasswordRequest
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/reset-password',
      payload
    );
    return response.data;
  },

  /**
   * Logout user from server and clear cookies
   */
  async logout(): Promise<ApiResponse<{ message: string }>> {
    localStorage.removeItem('accessToken');
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/logout'
    );
    return response.data;
  },
};

