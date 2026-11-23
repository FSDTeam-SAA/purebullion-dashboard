import { useState } from "react";

/** Page number that snaps back to 1 whenever `resetKey` (filters / search) changes. */
export function usePage(resetKey: string) {
  const [state, setState] = useState({ key: resetKey, page: 1 });
  const page = state.key === resetKey ? state.page : 1;
  const setPage = (p: number) => setState({ key: resetKey, page: p });
  return [page, setPage] as const;
}
