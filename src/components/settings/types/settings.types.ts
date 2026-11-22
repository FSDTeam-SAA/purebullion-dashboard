export interface SettingsProfile {
  _id?: string;
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  photo?: string;
  profileImage?: string;
  role?: string;
  permissions?: string[];
  createdAt?: string;
}

export interface UpdateSettingsProfilePayload {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

