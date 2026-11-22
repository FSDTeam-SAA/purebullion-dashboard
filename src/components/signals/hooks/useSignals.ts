import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { signalsApi } from "../api/signals.api";
import { GetSignalsParams, SignalStatus } from "../types/signals.types";
import { toast } from "sonner";

export const SIGNALS_QUERY_KEY = ["admin-signals"] as const;

export function useSignals(params: GetSignalsParams = {}) {
  return useQuery({
    queryKey: [...SIGNALS_QUERY_KEY, "list", params],
    queryFn: () => signalsApi.getSignals(params),
    staleTime: 30 * 1000,
  });
}

export function useSignalStats() {
  return useQuery({
    queryKey: [...SIGNALS_QUERY_KEY, "stats"],
    queryFn: () => signalsApi.getStats(),
    staleTime: 60 * 1000,
  });
}

export function useUpdateSignalStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: SignalStatus }) =>
      signalsApi.updateSignalStatus(id, status),
    onSuccess: () => {
      toast.success("Signal status updated");
      queryClient.invalidateQueries({ queryKey: SIGNALS_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update signal status");
    },
  });
}

