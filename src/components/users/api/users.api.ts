import { apiClient } from "@/services/apiClient";
import {
  GetUsersParams,
  UsersResponseData,
  SendEmailPayload,
  SuspendUserPayload,
} from "../types/users.types";

export const usersApi = {
  getUsers: async (params: GetUsersParams = {}) => {
    const res = await apiClient.get<{
      success: boolean;
      data: UsersResponseData;
      meta?: any;
    }>("/admin/users", { params });
    return res.data;
  },

  getUserOverview: async (id: string) => {
    const res = await apiClient.get(`/admin/users/${id}/overview`);
    return res.data.data;
  },

  suspendUser: async (id: string, payload: SuspendUserPayload) => {
    const res = await apiClient.patch(`/admin/users/${id}/suspend`, payload);
    return res.data;
  },

  updateUser: async (id: string, payload: any) => {
    const res = await apiClient.put(`/user/${id}`, payload);
    return res.data;
  },

  sendEmail: async (id: string, payload: SendEmailPayload) => {
    const res = await apiClient.post(`/admin/users/${id}/email`, payload);
    return res.data;
  },

  deleteUser: async (id: string) => {
    const res = await apiClient.delete(`/admin/users/${id}`);
    return res.data;
  },
};

