"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

function rangeWithDots(current: number, total: number) {
  // Simple: show 1, current-1, current, current+1, total (with ellipsis)
  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  const valid = Array.from(pages).filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const out: (number | "…")[] = [];
  for (let i = 0; i < valid.length; i++) {
    const p = valid[i]!;
    const prev = valid[i - 1];
    if (prev && p - prev > 1) out.push("…");
    out.push(p);
  }
  return out;
}

export function DocumentsPagination(props: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const { page, totalPages, onPageChange } = props;
  const items = rangeWithDots(page, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              if (page > 1) onPageChange(page - 1);
            }}
            aria-disabled={page <= 1}
          />
        </PaginationItem>

        {items.map((it, idx) =>
          it === "…" ? (
            <PaginationItem key={`e-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={it}>
              <PaginationLink
                href="#"
                isActive={it === page}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  onPageChange(it);
                }}
              >
                {it}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              if (page < totalPages) onPageChange(page + 1);
            }}
            aria-disabled={page >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
