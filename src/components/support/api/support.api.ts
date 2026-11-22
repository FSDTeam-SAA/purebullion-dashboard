import { apiClient } from '@/services/apiClient';
import { ApiResponse } from '@/types/auth.types';
import {
  SupportTicket,
  SupportQueryParams,
  ResolveTicketPayload,
} from '../types/support.types';

export const supportApi = {
  getAllMessages: async (params?: SupportQueryParams): Promise<ApiResponse<SupportTicket[]>> => {
    const res = await apiClient.get<ApiResponse<SupportTicket[]>>('/support/admin/messages', {
      params,
    });
    return res.data;
  },

  getMessageById: async (id: string): Promise<ApiResponse<SupportTicket>> => {
    const res = await apiClient.get<ApiResponse<SupportTicket>>(`/support/admin/messages/${id}`);
    return res.data;
  },

  resolveMessage: async (payload: ResolveTicketPayload): Promise<ApiResponse<SupportTicket>> => {
    const res = await apiClient.patch<ApiResponse<SupportTicket>>(
      `/support/admin/messages/${payload.id}/resolve`,
      {
        replyMessage: payload.replyMessage,
        status: payload.status || 'resolved',
      }
    );
    return res.data;
  },

  deleteMessage: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const res = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/support/admin/messages/${id}`
    );
    return res.data;
  },
};

