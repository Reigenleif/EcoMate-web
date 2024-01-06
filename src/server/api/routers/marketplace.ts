import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";

export const marketPlaceRouter = createTRPCRouter({
  getCategoryList: adminProcedure.query(async ({ ctx }) => {
    const categoryList = await ctx.prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return categoryList;
  }),

  getCategoryById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.findUnique({
        where: { id: input.id },
      });

      if (!category) throw new TRPCError({ code: "NOT_FOUND" });

      return category;
    }),

  createCategory: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.create({
        data: {
          name: input.name,
          description: input.description,
        },
      });

      return category;
    }),

  updateCategory: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        isPublished: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
        },
      });

      return category;
    }),

  getItemList: adminProcedure.query(async ({ ctx }) => {
    const itemList = await ctx.prisma.item.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return itemList;
  }),

  getItemById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.item.findUnique({
        where: { id: input.id },
      });

      if (!item) throw new TRPCError({ code: "NOT_FOUND" });

      return item;
    }),

  getItemByCategoryId: adminProcedure
    .input(z.object({ categoryId: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.item.findMany({
        where: { categoryId: input.categoryId },
      });

      if (!item) throw new TRPCError({ code: "NOT_FOUND" });

      return item;
    }),

  createItem: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        imageUrl: z.string().optional(),
        price: z.number().min(1),
        categoryId: z.string().min(1),
      })
    )

    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.item.create({
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
          imageUrl: input.imageUrl,
          categoryId: input.categoryId,
          userId: ctx.session.user.id,
        },
      });

      return item;
    }),

  updateItem: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().min(1),
        price: z.number().min(1),
        imageUrl: z.string().optional(),
        isPublished: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.item.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
          imageUrl: input.imageUrl,
        },
      });

      return item;
    }),

  deleteItem: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.item.delete({
        where: { id: input.id },
      });

      return item;
    }),
});
