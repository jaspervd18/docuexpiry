import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const normalizeName = (s: string) => s.trim();

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
      z
        .object({
          take: z.number().int().min(1).max(200).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const take = input?.take ?? 100;

      return ctx.db.document.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { expiresAt: "asc" },
        take,
        select: {
          id: true,
          name: true,
          expiresAt: true,
          category: { select: { id: true, name: true } },
          tags: { select: { tag: { select: { id: true, name: true } } } },
          createdAt: true,
        },
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
});
