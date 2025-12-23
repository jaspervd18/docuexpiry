"use client";

import * as React from "react";
import Link from "next/link";
import { z } from "zod";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useDebouncedValue } from "~/hooks/use-debounced-value";

import { makeColumns, type DocumentRow } from "./documents-columns";
import { DocumentsPagination } from "./documents-pagination";

type SortBy = "name" | "category" | "expiresAt";
type SortDir = "asc" | "desc";

const StatusSchema = z.enum(["all", "expired", "expiring", "valid"]);
type Status = z.infer<typeof StatusSchema>;

export function DocumentsTable() {
  const utils = api.useUtils();

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  const [status, setStatus] = React.useState<Status>("all");
  const [categoryId, setCategoryId] = React.useState<string>("all");

  const [sortBy, setSortBy] = React.useState<SortBy>("expiresAt");
  const [sortDir, setSortDir] = React.useState<SortDir>("asc");

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);

  const categoriesQuery = api.document.listCategories.useQuery();

  const listQuery = api.document.list.useQuery({
    query: debouncedSearch,
    status,
    categoryId: categoryId === "all" ? undefined : categoryId,
    sortBy,
    sortDir,
    page,
    pageSize,
  });

  const deleteMutation = api.document.delete.useMutation({
    onSuccess: async () => {
      await utils.document.list.invalidate();
    },
  });

  const result = listQuery.data;
  const rows: DocumentRow[] =
    result?.items.map((d) => ({
      id: d.id,
      name: d.name,
      expiresAt: new Date(d.expiresAt),
      categoryName: d.category?.name ?? null,
      tags: d.tags.map((t) => t.tag.name),
    })) ?? [];

  const totalPages = result?.totalPages ?? 1;

  const onSort = (col: SortBy) => {
    setPage(1);
    if (sortBy !== col) {
      setSortBy(col);
      setSortDir("asc");
      return;
    }
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  };

  const columns = React.useMemo<ColumnDef<DocumentRow>[]>(
    () =>
      makeColumns({
        onDelete: (doc) => {
          const ok = window.confirm(`Delete "${doc.name}"? This can’t be undone.`);
          if (!ok) return;
          deleteMutation.mutate({ id: doc.id });
        },
        onSort,
        sortBy,
        sortDir,
      }),
    [deleteMutation, sortBy, sortDir],
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const categories = categoriesQuery.data ?? [];

  const resetPage = () => setPage(1);

  return (
    <div className="w-full space-y-4">
      {/* Toolbar (like shadcn demo) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            resetPage();
          }}
          className="sm:max-w-sm"
        />

        <Select
            value={status}
            onValueChange={(v) => {
                const parsed = StatusSchema.safeParse(v);
                if (!parsed.success) return; // ignore unexpected values
                setStatus(parsed.data);
                resetPage();
            }}
        >
          <SelectTrigger className="sm:w-45">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="expiring">Expiring (30d)</SelectItem>
            <SelectItem value="valid">Valid</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={categoryId}
          onValueChange={(v) => {
            setCategoryId(v);
            resetPage();
          }}
        >
          <SelectTrigger className="sm:w-55">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={String(pageSize)}
          onValueChange={(v) => {
            setPageSize(Number(v));
            setPage(1);
          }}
        >
          <SelectTrigger className="sm:ml-auto sm:w-35">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="20">20 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
            <SelectItem value="100">100 / page</SelectItem>
          </SelectContent>
        </Select>

        <Button asChild>
          <Link href="/documents/new">Add document</Link>
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {listQuery.isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer + Pagination */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Page {result?.page ?? page} of {totalPages} • {result?.total ?? 0} total
        </div>

        <DocumentsPagination
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}
