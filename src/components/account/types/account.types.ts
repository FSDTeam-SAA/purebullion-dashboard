export interface UserAccountProfile {
  _id: string;
  id?: string;
  name: string;
  email: string;
  username?: string;
  role: string;
  status: string;
  phone?: string;
  timezone?: string;
  profileImage?: string;
  isFoundingMember?: boolean;
  customUserId?: string;
  lastActive?: string;
  createdAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  timezone?: string;
  bio?: string;
  country?: string;
  cityState?: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface NotificationPreferences {
  userId?: string;
  toggles: {
    newSignals: boolean;
    signalProximity: boolean;
    signalClosed: boolean;
    marketConditionChange: boolean;
    watchlistMovers: boolean;
    communityReplies: boolean;
    announcements: boolean;
    dailyBriefingEmail: boolean;
    weeklyWrapEmail: boolean;
  };
  channels?: {
    inPlatform: boolean;
    email: boolean;
    push: boolean;
  };
}

export interface CloseAccountPayload {
  reason?: string;
  feedback?: string;
}

