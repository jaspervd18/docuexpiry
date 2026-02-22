"use client";

import * as React from "react";
import { Upload, Download, FileSpreadsheet, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Papa from "papaparse";
import { format } from "date-fns";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

type Step = "upload" | "preview" | "done";

interface ParsedRow {
  name: string;
  expiresAt: Date | null;
  notes?: string;
  categoryName?: string;
  valid: boolean;
  error?: string;
}

const TEMPLATE_CSV = `name,expires_at,category,notes
Passport - John,2027-06-15,Travel,Expires in 2027
Driver's License,2026-12-01,Personal,
Business Insurance,2025-09-30,Business,Annual renewal
SSL Certificate,2026-03-14,IT,*.example.com`;

function tryParseDate(value: string): Date | null {
  if (!value) return null;

  // Try common formats
  const cleaned = value.trim();

  // ISO: 2026-03-14
  const iso = Date.parse(cleaned);
  if (!isNaN(iso)) return new Date(iso);

  // DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/.exec(cleaned);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    if (!isNaN(date.getTime())) return date;
  }

  // MM/DD/YYYY
  const mdyMatch = /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/.exec(cleaned);
  if (mdyMatch) {
    const [, m, d, y] = mdyMatch;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    if (!isNaN(date.getTime())) return date;
  }

  return null;
}

function parseCSV(text: string): ParsedRow[] {
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, "_"),
  });

  return result.data.map((row) => {
    const name = (row.name ?? row.document_name ?? row.title ?? "").trim();
    const dateStr = (row.expires_at ?? row.expiry_date ?? row.expiration ?? row.date ?? "").trim();
    const notes = (row.notes ?? row.description ?? "").trim() || undefined;
    const categoryName = (row.category ?? row.category_name ?? row.type ?? "").trim() || undefined;

    const expiresAt = tryParseDate(dateStr);

    if (!name) {
      return { name, expiresAt, notes, categoryName, valid: false, error: "Missing name" };
    }
    if (!expiresAt) {
      return { name, expiresAt, notes, categoryName, valid: false, error: dateStr ? "Invalid date" : "Missing date" };
    }

    return { name, expiresAt, notes, categoryName, valid: true };
  });
}

function downloadTemplate() {
  const blob = new Blob([TEMPLATE_CSV], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "docuexpiry-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function CsvImportModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const utils = api.useUtils();
  const [step, setStep] = React.useState<Step>("upload");
  const [rows, setRows] = React.useState<ParsedRow[]>([]);
  const [importResult, setImportResult] = React.useState<{ imported: number; skipped: number } | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const bulkCreate = api.document.bulkCreate.useMutation({
    onSuccess: async (data) => {
      setImportResult(data);
      setStep("done");
      await utils.document.list.invalidate();
    },
  });

  const reset = React.useCallback(() => {
    setStep("upload");
    setRows([]);
    setImportResult(null);
    bulkCreate.reset();
  }, [bulkCreate]);

  React.useEffect(() => {
    if (!open) {
      // Delay reset so close animation plays
      const t = setTimeout(reset, 200);
      return () => clearTimeout(t);
    }
  }, [open, reset]);

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== "string") return;
      const parsed = parseCSV(text);
      setRows(parsed);
      setStep("preview");
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleImport = () => {
    const validRows = rows.filter((r) => r.valid && r.expiresAt);
    bulkCreate.mutate({
      documents: validRows.map((r) => ({
        name: r.name,
        expiresAt: r.expiresAt!,
        notes: r.notes,
        categoryName: r.categoryName,
      })),
    });
  };

  const validCount = rows.filter((r) => r.valid).length;
  const invalidCount = rows.filter((r) => !r.valid).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" showCloseButton={step !== "done"}>
        {step === "upload" && (
          <>
            <DialogHeader>
              <DialogTitle>Import documents from CSV</DialogTitle>
              <DialogDescription>
                Upload a CSV file to bulk-import documents. Each row becomes a document with an expiry date.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Template download */}
              <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
                <FileSpreadsheet className="h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Need a template?</p>
                  <p className="text-muted-foreground">
                    Download our CSV template with example rows and the correct column headers.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  <Download className="h-3.5 w-3.5" />
                  Template
                </Button>
              </div>

              {/* Instructions */}
              <div className="text-sm text-muted-foreground space-y-1.5">
                <p className="font-medium text-foreground">Your CSV should have these columns:</p>
                <ul className="list-inside list-disc space-y-0.5 text-xs">
                  <li><span className="font-medium text-foreground">name</span> (required) - document name</li>
                  <li><span className="font-medium text-foreground">expires_at</span> (required) - expiry date (YYYY-MM-DD, DD/MM/YYYY, or MM/DD/YYYY)</li>
                  <li><span className="font-medium text-foreground">category</span> (optional) - auto-created if new</li>
                  <li><span className="font-medium text-foreground">notes</span> (optional) - additional notes</li>
                </ul>
              </div>

              {/* Drop zone */}
              <div
                className={`flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium">Drop your CSV file here</p>
                  <p className="text-xs text-muted-foreground">or click to browse</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </div>
            </div>
          </>
        )}

        {step === "preview" && (
          <>
            <DialogHeader>
              <DialogTitle>Preview import</DialogTitle>
              <DialogDescription>
                {validCount} document{validCount !== 1 ? "s" : ""} ready to import
                {invalidCount > 0 && (
                  <span className="text-destructive">
                    {" "}· {invalidCount} row{invalidCount !== 1 ? "s" : ""} with errors (will be skipped)
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            {/* Preview table */}
            <div className="max-h-[340px] overflow-auto rounded-lg border border-border/60">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm">
                  <tr className="border-b border-border/40 text-left">
                    <th className="w-8 px-3 py-2"></th>
                    <th className="px-3 py-2 font-medium">Name</th>
                    <th className="px-3 py-2 font-medium">Expires</th>
                    <th className="hidden px-3 py-2 font-medium sm:table-cell">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {rows.map((row, i) => (
                    <tr
                      key={i}
                      className={row.valid ? "" : "bg-destructive/5"}
                    >
                      <td className="px-3 py-2">
                        {row.valid ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                      </td>
                      <td className="max-w-[200px] truncate px-3 py-2">
                        {row.name || <span className="text-muted-foreground italic">Empty</span>}
                        {row.error && (
                          <span className="ml-1.5 text-xs text-destructive">{row.error}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 tabular-nums text-muted-foreground">
                        {row.expiresAt ? format(row.expiresAt, "PP") : "-"}
                      </td>
                      <td className="hidden px-3 py-2 text-muted-foreground sm:table-cell">
                        {row.categoryName ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {bulkCreate.error && (
              <p className="text-sm text-destructive">{bulkCreate.error.message}</p>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => { setStep("upload"); setRows([]); }}>
                Back
              </Button>
              <Button
                onClick={handleImport}
                disabled={validCount === 0 || bulkCreate.isPending}
              >
                {bulkCreate.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>Import {validCount} document{validCount !== 1 ? "s" : ""}</>
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "done" && (
          <>
            <DialogHeader>
              <DialogTitle>Import complete</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <div className="text-center">
                <p className="text-lg font-medium">
                  {importResult?.imported} document{importResult?.imported !== 1 ? "s" : ""} imported
                </p>
                {(importResult?.skipped ?? 0) > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {importResult?.skipped} skipped (plan limit reached)
                  </p>
                )}
                {invalidCount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {invalidCount} row{invalidCount !== 1 ? "s" : ""} skipped due to errors
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => onOpenChange(false)}>Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
