"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { upload } from "@vercel/blob/client";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "~/trpc/react";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { cn } from "~/lib/utils";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  expiresAt: z.date({ required_error: "Expiration date is required" }),
  categoryId: z.string().optional(),
  newCategoryName: z.string().max(80).optional(),
  tagsText: z.string().optional(),
  notes: z.string().max(5000).optional(),
});

type FormValues = z.infer<typeof schema>;

function parseTags(tagsText?: string) {
  if (!tagsText) return [];
  return tagsText
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 30);
}

export function NewDocumentForm() {
  const utils = api.useUtils();

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const categoriesQuery = api.document.listCategories.useQuery();
  const tagsQuery = api.document.listTags.useQuery();

  const categories = categoriesQuery.data ?? [];
  const knownTags = tagsQuery.data ?? [];

  const _knownTagNames = useMemo(
    () => new Set(knownTags.map((t) => t.name.toLowerCase())),
    [knownTags],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      notes: "",
      tagsText: "",
      categoryId: undefined,
      newCategoryName: "",
      expiresAt: undefined as unknown as Date,
    },
  });

  const createMutation = api.document.create.useMutation({
    onSuccess: async (created) => {
      try {
        if (file) {
          setIsUploading(true);

          await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/blob/upload",
            clientPayload: JSON.stringify({
              documentId: created.id,
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
            }),
          });
        }

        await utils.document.listCategories.invalidate();
        await utils.document.listTags.invalidate();

        window.location.href = "/documents";
      } finally {
        setIsUploading(false);
      }
    },
  });

  const onSubmit = (values: FormValues) => {
    const tags = parseTags(values.tagsText);

    const categoryId =
      values.categoryId &&
        values.categoryId !== "__new" &&
        values.categoryId !== "__none"
        ? values.categoryId
        : undefined;

    const newCategoryName =
      values.categoryId === "__new" ? values.newCategoryName?.trim() : undefined;

    createMutation.mutate({
      name: values.name.trim(),
      expiresAt: values.expiresAt,
      notes: values.notes?.trim() ?? undefined,
      categoryId,
      newCategoryName: newCategoryName?.length ? newCategoryName : undefined,
      newTagNames: tags,
      tagIds: [],
    });
  };

  const isSubmitting = createMutation.isPending || isUploading;

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Essentials */}
        <div className="rounded-xl border border-border/60 bg-card/80 p-5 shadow-sm space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Insurance certificate"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiration date *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                          disabled={isSubmitting}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : "Pick a date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(d) => d && field.onChange(d)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={field.value ?? "__none"}
                    onValueChange={(v) =>
                      field.onChange(v === "__none" ? undefined : v)
                    }
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="__none">No category</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="__new">+ Create new...</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {form.watch("categoryId") === "__new" && (
            <FormField
              control={form.control}
              name="newCategoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New category name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Compliance"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Details */}
        <div className="rounded-xl border border-border/60 bg-card/80 p-5 shadow-sm space-y-5">
          <FormField
            control={form.control}
            name="tagsText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. vehicle, insurance, yearly"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Optional notes..."
                    className="min-h-25 resize-none"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File upload */}
          <div className="space-y-2">
            <div className="text-sm font-medium">File (optional)</div>
            <label
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border/60 px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5",
                isSubmitting && "pointer-events-none opacity-50",
              )}
            >
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {file ? file.name : "Choose a file..."}
              </span>
              <input
                type="file"
                className="sr-only"
                disabled={isSubmitting}
                accept={[
                  ".pdf",
                  ".doc",
                  ".docx",
                  "image/png",
                  "image/jpeg",
                  "image/webp",
                  "application/pdf",
                  "application/msword",
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ].join(",")}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <p className="text-xs text-muted-foreground">
              PDF, Word, PNG, JPEG, or WEBP.
            </p>

            {file && (
              <p className="text-xs text-muted-foreground">
                Selected:{" "}
                <span className="font-medium text-foreground">{file.name}</span>{" "}
                ({Math.ceil(file.size / 1024)} KB)
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => (window.location.href = "/documents")}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {createMutation.isPending
              ? "Saving..."
              : isUploading
                ? "Uploading..."
                : "Save document"}
          </Button>
        </div>

        {createMutation.error && (
          <p className="text-sm text-destructive">{createMutation.error.message}</p>
        )}
      </form>
    </Form>
  );
}
