export interface CommunityPost {
  _id: string;
  id?: string;
  title: string;
  content: string;
  topic: string;
  author: {
    _id: string;
    name: string;
    email?: string;
    profileImage?: string;
    role?: string;
  };
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  media?: string[];
  mediaType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityStatistics {
  totalMembers: number;
  userTotalPosts: number;
  totalLikes: number;
  activeDiscussions?: number;
}

export interface AnnouncementItem {
  _id: string;
  id?: string;
  title: string;
  content: string;
  tier?: string;
  pinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  topic: string;
  files?: File[];
}

export interface CommunityQueryParams {
  page?: number;
  limit?: number;
  topic?: string;
  sort?: string;
  search?: string;
}

