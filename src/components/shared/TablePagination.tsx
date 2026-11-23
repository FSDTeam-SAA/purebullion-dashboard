"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function pageWindow(page: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

export default function TablePagination({
  meta,
  onPageChange,
}: {
  meta?: PageMeta;
  onPageChange: (page: number) => void;
}) {
  const total = meta?.total ?? 0;
  const page = meta?.page ?? 1;
  const limit = meta?.limit ?? 10;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <footer className="flex flex-col items-center justify-between gap-4 border-t border-[#1B2227] p-4 text-xs sm:flex-row sm:px-6">
      <span className="text-[#8E9CA8]">
        Showing <b className="text-white">{from}</b> to <b className="text-white">{to}</b> of{" "}
        <b className="text-white">{total}</b> results
      </span>
      <div className="flex items-center gap-1.5">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md p-1.5 text-[#8E9CA8] hover:bg-[#182026] hover:text-white disabled:cursor-not-allowed disabled:text-[#3A4550] disabled:hover:bg-transparent"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pageWindow(page, totalPages).map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="px-1 text-[#5B6675]">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md font-medium",
                p === page ? "tab-gold-active font-bold text-white" : "text-[#8E9CA8] hover:bg-[#182026] hover:text-white"
              )}
            >
              {p}
            </button>
          )
        )}
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md p-1.5 text-[#8E9CA8] hover:bg-[#182026] hover:text-white disabled:cursor-not-allowed disabled:text-[#3A4550] disabled:hover:bg-transparent"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </footer>
  );
}
