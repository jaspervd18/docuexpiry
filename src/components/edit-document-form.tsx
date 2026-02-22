"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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

export function EditDocumentForm({ documentId }: { documentId: string }) {
  const router = useRouter();
  const utils = api.useUtils();

  const docQuery = api.document.getById.useQuery({ id: documentId });
  const categoriesQuery = api.document.listCategories.useQuery();

  const categories = categoriesQuery.data ?? [];
  const doc = docQuery.data;

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

  // Populate form when data loads
  useEffect(() => {
    if (!doc) return;
    form.reset({
      name: doc.name,
      expiresAt: new Date(doc.expiresAt),
      categoryId: doc.categoryId ?? undefined,
      notes: doc.notes ?? "",
      tagsText: doc.tags.map((t) => t.tag.name).join(", "),
      newCategoryName: "",
    });
  }, [doc, form]);

  const updateMutation = api.document.update.useMutation({
    onSuccess: async () => {
      await utils.document.list.invalidate();
      router.push("/documents");
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

    updateMutation.mutate({
      id: documentId,
      name: values.name.trim(),
      expiresAt: values.expiresAt,
      notes: values.notes?.trim() ?? undefined,
      categoryId,
      newCategoryName: newCategoryName?.length ? newCategoryName : undefined,
      newTagNames: tags,
      tagIds: [],
    });
  };

  const isSubmitting = updateMutation.isPending;

  if (docQuery.isLoading) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (docQuery.error) {
    return (
      <div className="py-16 text-center text-sm text-destructive">
        {docQuery.error.message}
      </div>
    );
  }

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

          {/* Show existing file info */}
          {doc?.fileName && (
            <div className="space-y-1">
              <div className="text-sm font-medium">Attached file</div>
              <div className="text-sm text-muted-foreground">
                {doc.fileName}
                {doc.fileSize ? ` (${Math.ceil(doc.fileSize / 1024)} KB)` : ""}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.push("/documents")}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>

        {updateMutation.error && (
          <p className="text-sm text-destructive">
            {updateMutation.error.message}
          </p>
        )}
      </form>
    </Form>
  );
}
