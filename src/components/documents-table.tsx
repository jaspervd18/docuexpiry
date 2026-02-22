"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowUpDown, Lock, MoreHorizontal, Search, Sparkles, Upload } from "lucide-react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { CsvImportModal } from "~/components/csv-import-modal";

type SortBy = "name" | "expiresAt" | "createdAt" | "category";

type SortDir = "asc" | "desc";

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export function DocumentsTable() {
  const utils = api.useUtils();

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const query = debouncedSearch.trim();

  const [sortBy, setSortBy] = React.useState<SortBy>("expiresAt");
  const [sortDir, setSortDir] = React.useState<SortDir>("asc");

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState<number>(20);

  const [deleteTarget, setDeleteTarget] = React.useState<{
    id: string;
    name: string;
  } | null>(null);

  const [csvOpen, setCsvOpen] = React.useState(false);
  const [upgradeOpen, setUpgradeOpen] = React.useState(false);
  const planQuery = api.subscription.getStatus.useQuery(undefined, {
    staleTime: 60_000,
  });
  const plan = planQuery.data?.plan ?? "free";

  const listQuery = api.document.list.useQuery(
    {
      query: query.length ? query : undefined,
      sortBy,
      sortDir,
      page,
      pageSize,
      status: "all",
    },
    {
      staleTime: 10_000,
      refetchOnWindowFocus: false,
    },
  );

  const deleteMutation = api.document.delete.useMutation({
    onSuccess: async () => {
      await utils.document.list.invalidate();
    },
  });

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

  const sortLabel = (key: SortBy) => {
    const labels: Record<SortBy, string> = {
      name: "Name",
      expiresAt: "Expires",
      createdAt: "Added",
      category: "Category",
    };
    const arrow = sortBy === key ? (sortDir === "asc" ? " \u2191" : " \u2193") : "";
    return labels[key] + arrow;
  };

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
        <div className="relative sm:max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          {/* Sort buttons */}
          <div className="hidden items-center gap-1 md:flex">
            {(["expiresAt", "name", "category", "createdAt"] as const).map(
              (key) => (
                <Button
                  key={key}
                  type="button"
                  variant={sortBy === key ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs"
                  onClick={() => toggleSort(key)}
                >
                  {sortLabel(key)}
                </Button>
              ),
            )}
          </div>

          {/* Mobile sort */}
          <div className="md:hidden">
            <Select
              value={sortBy}
              onValueChange={(v) => {
                setSortBy(v as SortBy);
                setSortDir("asc");
              }}
            >
              <SelectTrigger className="w-[130px]">
                <ArrowUpDown className="mr-2 h-3 w-3" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expiresAt">Expires</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="createdAt">Added</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground tabular-nums">
            {listQuery.isFetching ? "Updating..." : `${result?.total ?? 0} docs`}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => plan === "free" ? setUpgradeOpen(true) : setCsvOpen(true)}
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Import CSV</span>
          </Button>

          <Button asChild size="sm">
            <Link href="/documents/new">Add document</Link>
          </Button>
        </div>
      </div>

      {/* Document rows */}
      <div className="divide-y divide-border/40">
        {listQuery.isLoading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            {query ? "No documents match your search." : "No documents yet. Add your first one to get started."}
          </div>
        ) : (
          items.map((doc) => {
            const tags = doc.tags.map((t) => t.tag.name);

            return (
              <div
                key={doc.id}
                className="group flex items-center gap-4 px-2 py-3 transition-colors hover:bg-primary/5"
              >
                {/* Main info */}
                <Link
                  href={`/documents/${doc.id}/edit`}
                  className="flex min-w-0 flex-1 items-center gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium group-hover:text-primary transition-colors">
                      {doc.name}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{doc.category?.name ?? "No category"}</span>
                      {tags.length > 0 && (
                        <>
                          <span className="text-border">|</span>
                          <span className="truncate">
                            {tags.slice(0, 3).join(", ")}
                            {tags.length > 3 ? "..." : ""}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expiry date + status */}
                  <div className="hidden items-center gap-3 sm:flex">
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {format(new Date(doc.expiresAt), "PP")}
                    </span>
                    <DocumentStatusBadge expiresAt={new Date(doc.expiresAt)} />
                  </div>

                  {/* Mobile: just badge */}
                  <div className="sm:hidden">
                    <DocumentStatusBadge expiresAt={new Date(doc.expiresAt)} />
                  </div>
                </Link>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                      aria-label="Open menu"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/documents/${doc.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() =>
                        setDeleteTarget({ id: doc.id, name: doc.name })
                      }
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination + page size */}
      {totalPages > 1 || items.length > 0 ? (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Page {result?.page ?? page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Show</span>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => setPageSize(Number(v))}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
      ) : null}

      {/* CSV import modal */}
      {plan !== "free" && (
        <CsvImportModal open={csvOpen} onOpenChange={setCsvOpen} />
      )}

      {/* Upgrade prompt for free users */}
      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              CSV import is a paid feature
            </DialogTitle>
            <DialogDescription>
              Upgrade to Solo or Team to bulk-import documents from CSV files, plus enjoy higher document limits and email reminders.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Bulk CSV import (up to 500 at once)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Up to 200 documents (Solo) or 2,000 (Team)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Automatic email reminders before expiry</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeOpen(false)}>
              Maybe later
            </Button>
            <Button asChild>
              <Link href="/dashboard/billing">View plans</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.name}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deleteTarget) {
                  deleteMutation.mutate({ id: deleteTarget.id });
                  setDeleteTarget(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
