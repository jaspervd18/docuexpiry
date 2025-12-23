"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { z } from "zod";

import { api } from "~/trpc/react";
import { useDebouncedValue } from "~/hooks/use-debounced-value";

import { DocumentStatusBadge } from "~/components/document-status-badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

// Keep these aligned with your router enums
const SortBySchema = z.enum(["name", "expiresAt", "createdAt", "category"]);
type SortBy = z.infer<typeof SortBySchema>;

const SortDirSchema = z.enum(["asc", "desc"]);
type SortDir = z.infer<typeof SortDirSchema>;

export function DocumentsTable() {
  const utils = api.useUtils();

  // --- UI state ---
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const query = debouncedSearch.trim();

  const [sortBy, setSortBy] = React.useState<SortBy>("expiresAt");
  const [sortDir, setSortDir] = React.useState<SortDir>("asc");

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10); // you can make this selectable later

  // --- tRPC queries ---
  const listQuery = api.document.list.useQuery(
    {
      query: query.length ? query : undefined,
      sortBy,
      sortDir,
      page,
      pageSize,
      // keep defaults for status/category for now
      status: "all",
    },
    {
      staleTime: 10_000,
      refetchOnWindowFocus: false,
    },
  );

  const deleteMutation = api.document.delete.useMutation({
    onSuccess: async () => {
      // refresh list after delete
      await utils.document.list.invalidate();
    },
  });

  // Reset to page 1 when search changes (debounced) or sorting changes
  React.useEffect(() => {
    setPage(1);
  }, [query, sortBy, sortDir, pageSize]);

  const result = listQuery.data;
  const items = result?.items ?? [];
  const totalPages = result?.totalPages ?? 1;

  const toggleSort = (key: SortBy) => {
    setPage(1);
    if (sortBy !== key) {
      setSortBy(key);
      setSortDir("asc");
      return;
    }
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  };

  // Pagination helper: show 1, last, and a small window
  const pages = React.useMemo(() => {
    const tp = Math.max(1, totalPages);
    const set = new Set<number>([1, tp]);
    for (let p = page - 1; p <= page + 1; p++) {
      if (p >= 1 && p <= tp) set.add(p);
    }
    return Array.from(set).sort((a, b) => a - b);
  }, [page, totalPages]);

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />

        <div className="sm:ml-auto flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {listQuery.isFetching ? "Updating…" : `${result?.total ?? 0} total`}
          </div>

          <Button asChild>
            <Link href="/documents/new">Add document</Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border/50 bg-card/70 shadow-sm ring-1 ring-primary/10">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow className="bg-muted/30">
              <TableHead className="w-[40%]">
                <Button
                  type="button"
                  variant="ghost"
                  className="-ml-3 hover:bg-primary/10"
                  onClick={() => toggleSort("name")}
                >
                  Document <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>

              <TableHead>
                <Button
                  type="button"
                  variant="ghost"
                  className="-ml-3 hover:bg-primary/10"
                  onClick={() => toggleSort("category")}
                >
                  Category <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>

              <TableHead>
                <Button
                  type="button"
                  variant="ghost"
                  className="-ml-3 hover:bg-primary/10"
                  onClick={() => toggleSort("expiresAt")}
                >
                  Expires <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>

              <TableHead>Status</TableHead>

              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {listQuery.isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading…
                </TableCell>
              </TableRow>
            ) : items.length ? (
              items.map((doc) => {
                const tags = doc.tags.map((t) => t.tag.name);

                return (
                  <TableRow key={doc.id} className="hover:bg-primary/5 transition-colors">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{doc.name}</div>
                        {tags.length ? (
                          <div className="text-xs text-muted-foreground">
                            {tags.slice(0, 3).join(", ")}
                            {tags.length > 3 ? "…" : ""}
                          </div>
                        ) : null}
                      </div>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {doc.category?.name ?? "—"}
                    </TableCell>

                    <TableCell className="text-sm">
                      {format(new Date(doc.expiresAt), "PP")}
                    </TableCell>

                    <TableCell>
                      <DocumentStatusBadge expiresAt={new Date(doc.expiresAt)} />
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Open menu"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/documents/${doc.id}`}>View</Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link href={`/documents/${doc.id}/edit`}>Edit</Link>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              const ok = window.confirm(
                                `Delete "${doc.name}"? This can’t be undone.`,
                              );
                              if (!ok) return;
                              deleteMutation.mutate({ id: doc.id });
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Page {result?.page ?? page} of {totalPages}
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
                aria-disabled={page <= 1}
              />
            </PaginationItem>

            {pages.map((p, idx) => {
              const prev = pages[idx - 1];
              const needsEllipsis = prev && p - prev > 1;

              return (
                <React.Fragment key={p}>
                  {needsEllipsis ? (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : null}

                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={p === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(p);
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                </React.Fragment>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
                aria-disabled={page >= totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
