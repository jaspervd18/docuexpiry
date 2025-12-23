"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "~/trpc/react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  expiresAt: z.date({ required_error: "Expiration date is required" }),
  categoryId: z.string().optional(),
  newCategoryName: z.string().max(80).optional(),
  tagsText: z.string().optional(), // comma-separated
  notes: z.string().max(5000).optional(),
});

type FormValues = z.infer<typeof schema>;

function parseTags(tagsText?: string) {
  if (!tagsText) return [];
  return tagsText
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 30); // safety limit
}

export function NewDocumentForm() {
  const utils = api.useUtils();
  const categoriesQuery = api.document.listCategories.useQuery();
  const tagsQuery = api.document.listTags.useQuery();

  const createMutation = api.document.create.useMutation({
    onSuccess: async () => {
      await utils.document.listCategories.invalidate();
      await utils.document.listTags.invalidate();
      // later: invalidate documents list query
      // you can also redirect with next/navigation, but in client: useRouter
      window.location.href = "/documents";
    },
  });

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

  const categories = categoriesQuery.data ?? [];
  const knownTags = tagsQuery.data ?? [];

  // For scalable UX later you can replace this with a real tags multi-select.
  const knownTagNames = useMemo(() => new Set(knownTags.map((t) => t.name.toLowerCase())), [knownTags]);

  const onSubmit = (values: FormValues) => {
    const tags = parseTags(values.tagsText);

    // For now: treat unknown tags as "newTagNames", known tags can be left as new too (upsert handles it)
    // Later you can do proper selection by id.
    const newTagNames = tags;

    const categoryId = values.categoryId && values.categoryId !== "__new" && values.categoryId !== "__none"
        ? values.categoryId
        : undefined;

    const newCategoryName = values.categoryId === "__new" ? values.newCategoryName?.trim() : undefined;

    createMutation.mutate({
        name: values.name.trim(),
        expiresAt: values.expiresAt,
        notes: values.notes?.trim() ?? undefined,
        categoryId,
        newCategoryName: newCategoryName?.length ? newCategoryName : undefined,
        newTagNames,
        tagIds: [],
    });
  };

  const isSubmitting = createMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Essentials */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Insurance certificate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                            className="w-full justify-start text-left font-normal"
                          >
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

              {/* Category: choose existing OR create new */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                        <Select
                            value={field.value ?? "__none"}
                            onValueChange={(v) => field.onChange(v === "__none" ? undefined : v)}
                        >
                      <FormControl>
                        <SelectTrigger>
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
                        <SelectItem value="__new">+ Create new…</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("categoryId") === "__new" ? (
                <FormField
                  control={form.control}
                  name="newCategoryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New category name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Compliance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div />
              )}
            </div>

            {/* Organize */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="tagsText"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. vehicle, insurance, yearly" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Separate tags with commas. (We’ll add tag picking later.)
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Optional notes…" className="min-h-25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => (window.location.href = "/documents")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Save document"}
              </Button>
            </div>

            {createMutation.error ? (
              <p className="text-sm text-destructive">
                {createMutation.error.message}
              </p>
            ) : null}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
