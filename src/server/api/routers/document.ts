import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { Prisma } from "../../../../generated/prisma";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getDocumentLimit } from "~/lib/plans";

const normalizeName = (s: string) => s.trim();

const SortBy = z.enum(["name", "expiresAt", "createdAt", "category"]);
const SortDir = z.enum(["asc", "desc"]);
const Status = z.enum(["all", "expired", "expiring", "valid"]);

export const documentRouter = createTRPCRouter({
  listCategories: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.category.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
  }),

  listTags: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.tag.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(200),
        expiresAt: z.date(),
        notes: z.string().max(5000).optional(),

        // Either pick an existing category OR create a new one
        categoryId: z.string().cuid().optional(),
        newCategoryName: z.string().max(80).optional(),

        // tags can be existing ids and/or new names
        tagIds: z.array(z.string().cuid()).optional(),
        newTagNames: z.array(z.string().max(40)).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Enforce document limit based on plan
      const plan = ctx.session.user.plan ?? "free";
      const limit = getDocumentLimit(plan);
      const count = await ctx.db.document.count({ where: { userId } });
      if (count >= limit) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Document limit reached (${limit}). Upgrade your plan to add more.`,
        });
      }

      const name = normalizeName(input.name);
      const notes = input.notes?.trim() ?? undefined;

      // Handle category
      let categoryId: string | undefined = input.categoryId;

      const newCategoryName = input.newCategoryName?.trim();
      if (!categoryId && newCategoryName) {
        const category = await ctx.db.category.upsert({
          where: { userId_name: { userId, name: newCategoryName } },
          update: {},
          create: { userId, name: newCategoryName },
          select: { id: true },
        });
        categoryId = category.id;
      }

      // Handle tags
      const tagIds = new Set<string>(input.tagIds ?? []);
      const newTagNames = (input.newTagNames ?? [])
        .map((t) => normalizeName(t))
        .filter((t) => t.length > 0);

      if (newTagNames.length > 0) {
        const createdOrExisting = await Promise.all(
          newTagNames.map((tagName) =>
            ctx.db.tag.upsert({
              where: { userId_name: { userId, name: tagName } },
              update: {},
              create: { userId, name: tagName },
              select: { id: true },
            }),
          ),
        );

        for (const t of createdOrExisting) tagIds.add(t.id);
      }

      return ctx.db.document.create({
        data: {
          userId,
          name,
          expiresAt: input.expiresAt,
          notes,
          categoryId,
          tags: {
            create: Array.from(tagIds).map((id) => ({ tagId: id })),
          },
        },
        select: { id: true },
      });
    }),
  list: protectedProcedure
    .input(
      z.object({
        query: z.string().trim().max(200).optional(),
        status: Status.default("all"),
        categoryId: z.string().cuid().optional(),

        sortBy: SortBy.default("expiresAt"),
        sortDir: SortDir.default("asc"),

        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(5).max(100).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const now = new Date();

      const where: Prisma.DocumentWhereInput = { userId };

      if (input.query) {
        where.name = { contains: input.query, mode: "insensitive" };
      }

      if (input.categoryId) {
        where.categoryId = input.categoryId;
      }

      if (input.status !== "all") {
        const in30 = new Date(now);
        in30.setDate(in30.getDate() + 30);

        if (input.status === "expired") {
          where.expiresAt = { lt: now };
        } else if (input.status === "expiring") {
          where.expiresAt = { gte: now, lte: in30 };
        } else if (input.status === "valid") {
          where.expiresAt = { gt: in30 };
        }
      }

      const orderBy: Prisma.DocumentOrderByWithRelationInput[] =
        input.sortBy === "category"
          ? [
              { category: { name: input.sortDir } },
              { expiresAt: "asc" }, // tie-breaker for stable ordering
            ]
          : [
              {
                [input.sortBy]: input.sortDir,
              } as Prisma.DocumentOrderByWithRelationInput,
            ];

      const skip = (input.page - 1) * input.pageSize;

      const [items, total] = await Promise.all([
        ctx.db.document.findMany({
          where,
          orderBy,
          skip,
          take: input.pageSize,
          select: {
            id: true,
            name: true,
            expiresAt: true,
            createdAt: true,
            category: { select: { id: true, name: true } },
            tags: { select: { tag: { select: { id: true, name: true } } } },
          },
        }),
        ctx.db.document.count({ where }),
      ]);

      const totalPages = Math.max(1, Math.ceil(total / input.pageSize));

      return {
        items,
        total,
        page: input.page,
        pageSize: input.pageSize,
        totalPages,
      };
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const doc = await ctx.db.document.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
        select: {
          id: true,
          name: true,
          expiresAt: true,
          notes: true,
          categoryId: true,
          category: { select: { id: true, name: true } },
          tags: { select: { tag: { select: { id: true, name: true } } } },
          fileUrl: true,
          fileName: true,
          fileSize: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!doc) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
      }

      return doc;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().min(1).max(200),
        expiresAt: z.date(),
        notes: z.string().max(5000).optional(),
        categoryId: z.string().cuid().optional(),
        newCategoryName: z.string().max(80).optional(),
        tagIds: z.array(z.string().cuid()).optional(),
        newTagNames: z.array(z.string().max(40)).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existing = await ctx.db.document.findFirst({
        where: { id: input.id, userId },
        select: { id: true },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
      }

      const name = normalizeName(input.name);
      const notes = input.notes?.trim() ?? null;

      // Handle category
      let categoryId: string | null = input.categoryId ?? null;

      const newCategoryName = input.newCategoryName?.trim();
      if (!categoryId && newCategoryName) {
        const category = await ctx.db.category.upsert({
          where: { userId_name: { userId, name: newCategoryName } },
          update: {},
          create: { userId, name: newCategoryName },
          select: { id: true },
        });
        categoryId = category.id;
      }

      // Handle tags: collect all tag IDs
      const tagIds = new Set<string>(input.tagIds ?? []);
      const newTagNames = (input.newTagNames ?? [])
        .map((t) => normalizeName(t))
        .filter((t) => t.length > 0);

      if (newTagNames.length > 0) {
        const createdOrExisting = await Promise.all(
          newTagNames.map((tagName) =>
            ctx.db.tag.upsert({
              where: { userId_name: { userId, name: tagName } },
              update: {},
              create: { userId, name: tagName },
              select: { id: true },
            }),
          ),
        );
        for (const t of createdOrExisting) tagIds.add(t.id);
      }

      // Delete old tag associations and recreate
      await ctx.db.documentTag.deleteMany({ where: { documentId: input.id } });

      return ctx.db.document.update({
        where: { id: input.id },
        data: {
          name,
          expiresAt: input.expiresAt,
          notes,
          categoryId,
          tags: {
            create: Array.from(tagIds).map((id) => ({ tagId: id })),
          },
        },
        select: { id: true },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      // Ensure user owns the document
      const doc = await ctx.db.document.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
        select: { id: true },
      });

      if (!doc) {
        // Either doesn't exist or not yours
        throw new Error("Document not found");
      }

      await ctx.db.document.delete({ where: { id: input.id } });
      return { ok: true };
    }),

  bulkCreate: protectedProcedure
    .input(
      z.object({
        documents: z
          .array(
            z.object({
              name: z.string().min(1).max(200),
              expiresAt: z.date(),
              notes: z.string().max(5000).optional(),
              categoryName: z.string().max(80).optional(),
            }),
          )
          .min(1)
          .max(500),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const plan = ctx.session.user.plan ?? "free";
      if (plan === "free") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "CSV import is available on Solo and Team plans.",
        });
      }

      const limit = getDocumentLimit(plan);
      const currentCount = await ctx.db.document.count({ where: { userId } });
      const available = limit - currentCount;

      if (available <= 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Document limit reached (${limit}). Upgrade your plan to add more.`,
        });
      }

      const toCreate = input.documents.slice(0, available);

      // Collect unique category names and upsert them
      const categoryNames = [
        ...new Set(
          toCreate
            .map((d) => d.categoryName?.trim())
            .filter((n): n is string => !!n && n.length > 0),
        ),
      ];

      const categoryMap = new Map<string, string>();
      for (const name of categoryNames) {
        const cat = await ctx.db.category.upsert({
          where: { userId_name: { userId, name } },
          update: {},
          create: { userId, name },
          select: { id: true },
        });
        categoryMap.set(name, cat.id);
      }

      // Bulk insert documents
      const created = await ctx.db.document.createMany({
        data: toCreate.map((d) => ({
          userId,
          name: d.name.trim(),
          expiresAt: d.expiresAt,
          notes: d.notes?.trim() ?? null,
          categoryId: d.categoryName
            ? (categoryMap.get(d.categoryName.trim()) ?? null)
            : null,
        })),
      });

      return {
        imported: created.count,
        skipped: input.documents.length - toCreate.length,
      };
    }),
});
