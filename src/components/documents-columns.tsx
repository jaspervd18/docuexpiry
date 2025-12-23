"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { DocumentStatusBadge } from "~/components/document-status-badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export type DocumentRow = {
  id: string;
  name: string;
  expiresAt: Date;
  categoryName: string | null;
  tags: string[];
};

export function makeColumns(opts: {
  onDelete: (row: DocumentRow) => void;
  onSort: (sortBy: "name" | "category" | "expiresAt") => void;
  sortBy: string;
  sortDir: "asc" | "desc";
}): ColumnDef<DocumentRow>[] {
  const { onDelete, onSort, sortBy, sortDir } = opts;

  const sortIcon = (col: string) =>
    sortBy === col ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  return [
    {
      accessorKey: "name",
      header: () => (
        <Button variant="ghost" onClick={() => onSort("name")}>
          Document <ArrowUpDown className="ml-2 h-4 w-4" />
          <span className="ml-1 text-xs text-muted-foreground">{sortIcon("name")}</span>
        </Button>
      ),
      cell: ({ row }) => {
        const tags = row.original.tags;
        return (
          <div className="space-y-1">
            <div className="font-medium">{row.original.name}</div>
            {tags.length > 0 ? (
              <div className="text-xs text-muted-foreground">
                {tags.slice(0, 3).join(", ")}
                {tags.length > 3 ? "…" : ""}
              </div>
            ) : null}
          </div>
        );
      },
    },
    {
      accessorKey: "categoryName",
      header: () => (
        <Button variant="ghost" onClick={() => onSort("category")}>
          Category <ArrowUpDown className="ml-2 h-4 w-4" />
          <span className="ml-1 text-xs text-muted-foreground">{sortIcon("category")}</span>
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.original.categoryName ?? "—"}
        </div>
      ),
    },
    {
      accessorKey: "expiresAt",
      header: () => (
        <Button variant="ghost" onClick={() => onSort("expiresAt")}>
          Expires <ArrowUpDown className="ml-2 h-4 w-4" />
          <span className="ml-1 text-xs text-muted-foreground">{sortIcon("expiresAt")}</span>
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm">{format(new Date(row.original.expiresAt), "PP")}</div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => <DocumentStatusBadge expiresAt={new Date(row.original.expiresAt)} />,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/documents/${row.original.id}`}>View</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/documents/${row.original.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(row.original)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
