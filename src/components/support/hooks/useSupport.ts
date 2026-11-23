'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supportApi } from '../api/support.api';
import { SupportQueryParams, ResolveTicketPayload } from '../types/support.types';
import { getErrorMessage } from '@/services/apiClient';

export function useSupportMessages(params?: SupportQueryParams) {
  return useQuery({
    queryKey: ['support', 'messages', params],
    queryFn: () => supportApi.getAllMessages(params),
    select: (res: any) => ({
      tickets: res.data?.messages || [],
      counts: res.data?.counts,
      meta: res.meta,
    }),
  });
}

export function useSupportTicketDetail(id: string) {
  return useQuery({
    queryKey: ['support', 'message', id],
    queryFn: () => supportApi.getMessageById(id),
    enabled: Boolean(id),
    select: (res) => res.data,
  });
}

export function useResolveTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ResolveTicketPayload) => supportApi.resolveMessage(payload),
    onSuccess: () => {
      toast.success('Ticket status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['support', 'messages'] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || 'Failed to update ticket status');
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => supportApi.deleteMessage(id),
    onSuccess: () => {
      toast.success('Ticket deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['support', 'messages'] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || 'Failed to delete ticket');
    },
  });
}

