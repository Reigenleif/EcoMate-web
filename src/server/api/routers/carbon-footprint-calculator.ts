import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";

export const carbonFootprintCalculatorRouter = createTRPCRouter({
  getCarbonFootprintAttributes: adminProcedure.query(async ({ ctx }) => {
    const carbonFootprintFormula =
      await ctx.prisma.carbonFootprintAttribute.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return carbonFootprintFormula;
  }),

  getCarbonFootprintAttributeById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const carbonFootprintFormula =
        await ctx.prisma.carbonFootprintAttribute.findUnique({
          where: { id: input.id },
        });

      if (!carbonFootprintFormula) throw new TRPCError({ code: "NOT_FOUND" });

      return carbonFootprintFormula;
    }),

  createCarbonFootprintAttribute: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        unit: z.string().min(1),
        coefficient: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const carbonFootprintFormula =
        await ctx.prisma.carbonFootprintAttribute.create({
          data: {
            name: input.name,
            description: input.description,
            unit: input.unit,
            coefficient: input.coefficient,
          },
        });

      return carbonFootprintFormula;
    }),

  updateCarbonFootprintAttribute: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().min(1),
        unit: z.string().min(1),
        coefficient: z.number().min(0),
      })
    )

    .mutation(async ({ ctx, input }) => {
      const carbonFootprintFormula =
        await ctx.prisma.carbonFootprintAttribute.update({
          where: { id: input.id },
          data: {
            name: input.name,
            description: input.description,
            unit: input.unit,
            coefficient: input.coefficient,
          },
        });

      return carbonFootprintFormula;
    }),

  deleteCarbonFootprintAttribute: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const carbonFootprintFormula =
        await ctx.prisma.carbonFootprintAttribute.delete({
          where: { id: input.id },
        });

      return carbonFootprintFormula;
    }),
});
