"use client";

import Link from "next/link";
import { format } from "date-fns";

import { api } from "~/trpc/react";
import { DocumentStatusBadge } from "~/components/document-status-badge";

import { Button } from "~/components/ui/button";
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

export function DocumentsTable() {
  const utils = api.useUtils();
  const listQuery = api.document.list.useQuery({ take: 100 });

  const deleteMutation = api.document.delete.useMutation({
    onSuccess: async () => {
      await utils.document.list.invalidate();
    },
  });

  const docs = listQuery.data ?? [];

  if (listQuery.isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Loading documents…
      </div>
    );
  }

  if (docs.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <div className="text-base font-medium">No documents yet</div>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first document to start tracking expirations.
        </p>
        <Button asChild className="mt-4">
          <Link href="/documents/new">Add document</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Document</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[60px]" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {docs.map((doc) => {
            const tags = doc.tags.map((t) => t.tag.name);

            return (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{doc.name}</div>
                    {tags.length > 0 ? (
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
                      <Button variant="ghost" size="icon" aria-label="Actions">
                        ⋯
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
          })}
        </TableBody>
      </Table>
    </div>
  );
}
