import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";

export const newsRouter = createTRPCRouter({
  getNews: adminProcedure.query(async ({ ctx }) => {
    const newsList = await ctx.prisma.news.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return newsList;
  }),
  getNewsById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const news = await ctx.prisma.news.findUnique({
        where: { id: input.id },
      });

      if (!news) throw new TRPCError({ code: "NOT_FOUND" });

      return news;
    }),
  createNews: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const news = await ctx.prisma.news.create({
        data: {
          title: input.title,
          content: input.content,
          imageUrl: input.imageUrl,
        },
      });

      return news;
    }),

  updateNews: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        content: z.string().min(1),
        imageUrl: z.string().optional(),
        isPublished: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const news = await ctx.prisma.news.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
          imageUrl: input.imageUrl,
          isPublished: input.isPublished,
        },
      });

      return news;
    }),

  deleteNews: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const news = await ctx.prisma.news.delete({
        where: { id: input.id },
      });

      return news;
    }),
});
