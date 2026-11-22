export interface UserItem {
  id: string;
  name: string;
  email: string;
  subscription: "Essential" | "Professional" | "Elite";
  status: "Active" | "Suspended" | "In Active";
  joined: string;
  lastActive: string;
  avatar?: string;
}

export interface GetUsersParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UsersResponseData {
  users: Array<{
    _id: string;
    user: {
      name: string;
      email: string;
      avatar: string;
    };
    email: string;
    subscriptions: "Essential" | "Professional" | "Elite";
    status: "Active" | "Suspended" | "In Active";
    joined: string;
    lastActive: string;
  }>;
  paginationInfo: {
    from: number;
    to: number;
    total: number;
    label: string;
  };
}

export interface SendEmailPayload {
  subject: string;
  message: string;
}

export interface SuspendUserPayload {
  status: "Active" | "Suspended" | "In Active";
  reason?: string;
}

