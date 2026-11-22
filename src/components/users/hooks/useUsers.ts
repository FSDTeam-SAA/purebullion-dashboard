import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api/users.api";
import {
  GetUsersParams,
  SendEmailPayload,
  SuspendUserPayload,
} from "../types/users.types";
import { toast } from "sonner";

export const USERS_QUERY_KEY = ["admin-users"] as const;

export function useUsers(params: GetUsersParams = {}) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, params],
    queryFn: () => usersApi.getUsers(params),
    staleTime: 30 * 1000,
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: SuspendUserPayload;
    }) => usersApi.suspendUser(id, payload),
    onSuccess: () => {
      toast.success("User status updated successfully");
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update user status");
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: any;
    }) => usersApi.updateUser(id, payload),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update user");
    },
  });
}

export function useSendUserEmail() {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SendEmailPayload }) =>
      usersApi.sendEmail(id, payload),
    onSuccess: () => {
      toast.success("Email sent successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to send email");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete user");
    },
  });
}

