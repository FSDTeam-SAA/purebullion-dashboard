export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string | null;
  role?: string;
  profileImage?: string | null;
  permissions?: string[];
}

export interface ApiResponse<T = unknown> {
  message: string;
  data: T;
  statusCode?: number;
}

export interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

// Request DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  resetToken: string;
}

// Response DTOs
export interface LoginResponseData {
  user: User;
  accessToken: string;
}

export interface VerifyOtpResponseData {
  message: string;
  resetToken: string;
}

