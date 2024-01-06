import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";

export const flashcardRouter = createTRPCRouter({
  getFlashcardList: adminProcedure.query(async ({ ctx }) => {
    const flashcardList = await ctx.prisma.flashcard.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return flashcardList;
  }),

  getFlashcardById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const flashcard = await ctx.prisma.flashcard.findUnique({
        where: { id: input.id },
      });

      if (!flashcard) throw new TRPCError({ code: "NOT_FOUND" });

      return flashcard;
    }),
  createFlashcard: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const flashcard = await ctx.prisma.flashcard.create({
        data: {
          title: input.title,
          description: input.description,
          imageUrl: input.imageUrl,
        },
      });

      return flashcard;
    }),

  updateFlashcard: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        description: z.string().min(1),
        imageUrl: z.string().optional(),
        isPublished: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const flashcard = await ctx.prisma.flashcard.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          imageUrl: input.imageUrl,
          isPublished: input.isPublished,
        },
      });

      return flashcard;
    }),

  deleteFlashcard: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const flashcard = await ctx.prisma.flashcard.delete({
        where: { id: input.id },
      });

      return flashcard;
    }),
});
