export interface SupportTicket {
  _id: string;
  id?: string | number;
  name: string;
  email: string;
  phoneNumber?: string;
  phone?: string;
  message: string;
  status: 'pending' | 'resolved';
  replyMessage?: string;
  resolvedAt?: string;
  resolvedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SupportQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface ResolveTicketPayload {
  id: string;
  replyMessage?: string;
  status?: 'pending' | 'resolved';
}

