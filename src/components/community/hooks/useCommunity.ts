'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { communityApi } from '../api/community.api';
import { CreatePostPayload, CommunityQueryParams } from '../types/community.types';
import { getErrorMessage } from '@/services/apiClient';

export function useCommunityStatistics() {
  return useQuery({
    queryKey: ['community', 'statistics'],
    queryFn: () => communityApi.getStatistics(),
    select: (res) => res.data,
  });
}

export function useCommunityPosts(params?: CommunityQueryParams) {
  return useQuery({
    queryKey: ['community', 'posts', params],
    queryFn: () => communityApi.getPosts(params),
    select: (res: any) => ({
      posts: res.data || [],
      meta: res.meta,
    }),
  });
}

export function useAnnouncements(tier = 'all') {
  return useQuery({
    queryKey: ['community', 'announcements', tier],
    queryFn: () => communityApi.getAnnouncements(tier),
    select: (res) => res.data || [],
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => communityApi.createPost(payload),
    onSuccess: () => {
      toast.success('Post published successfully');
      queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
      queryClient.invalidateQueries({ queryKey: ['community', 'statistics'] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || 'Failed to publish post');
    },
  });
}

export function useToggleLikePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => communityApi.toggleLikePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || 'Failed to like post');
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => communityApi.deletePost(id),
    onSuccess: () => {
      toast.success('Post deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
      queryClient.invalidateQueries({ queryKey: ['community', 'statistics'] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || 'Failed to delete post');
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => communityApi.deleteAnnouncement(id),
    onSuccess: () => {
      toast.success('Announcement removed');
      queryClient.invalidateQueries({ queryKey: ['community', 'announcements'] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || 'Failed to remove announcement');
    },
  });
}

