import { apiClient } from '@/services/apiClient';
import { ApiResponse } from '@/types/auth.types';
import {
  CommunityPost,
  CommunityStatistics,
  AnnouncementItem,
  CreatePostPayload,
  CommunityQueryParams,
} from '../types/community.types';

export const communityApi = {
  getStatistics: async (): Promise<ApiResponse<CommunityStatistics>> => {
    const res = await apiClient.get<ApiResponse<CommunityStatistics>>('/community/statistics');
    return res.data;
  },

  getPosts: async (params?: CommunityQueryParams): Promise<ApiResponse<CommunityPost[]>> => {
    const res = await apiClient.get<ApiResponse<CommunityPost[]>>('/community/posts', {
      params,
    });
    return res.data;
  },

  getPostById: async (id: string): Promise<ApiResponse<CommunityPost>> => {
    const res = await apiClient.get<ApiResponse<CommunityPost>>(`/community/posts/${id}`);
    return res.data;
  },

  createPost: async (payload: CreatePostPayload): Promise<ApiResponse<CommunityPost>> => {
    if (payload.files && payload.files.length > 0) {
      const formData = new FormData();
      formData.append('title', payload.title);
      formData.append('content', payload.content);
      formData.append('topic', payload.topic);
      payload.files.forEach((file) => {
        formData.append('files', file);
      });
      const res = await apiClient.post<ApiResponse<CommunityPost>>('/community/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    }
    const res = await apiClient.post<ApiResponse<CommunityPost>>('/community/posts', {
      title: payload.title,
      content: payload.content,
      topic: payload.topic,
    });
    return res.data;
  },

  toggleLikePost: async (id: string): Promise<ApiResponse<{ liked: boolean; likesCount: number }>> => {
    const res = await apiClient.post<ApiResponse<{ liked: boolean; likesCount: number }>>(
      `/community/posts/${id}/like`
    );
    return res.data;
  },

  deletePost: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const res = await apiClient.delete<ApiResponse<{ message: string }>>(`/community/posts/${id}`);
    return res.data;
  },

  getAnnouncements: async (tier = 'all'): Promise<ApiResponse<AnnouncementItem[]>> => {
    const res = await apiClient.get<ApiResponse<AnnouncementItem[]>>('/announcements', {
      params: { tier },
    });
    return res.data;
  },

  deleteAnnouncement: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const res = await apiClient.delete<ApiResponse<{ message: string }>>(`/admin/announcements/${id}`);
    return res.data;
  },
};

