import { prisma } from "@/lib/utils/prisma";
import { z } from "zod";
import { createCallerFactory, publicProcedure, router } from "../trpc";

export const appRouter = router({
  guestbook: {
    post: publicProcedure
      .input(
        z.object({
          message: z.string(),
          email: z.string(),
          username: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        await prisma.guestbook.create({
          data: {
            message: input.message,
            username: input.username,
            email: input.email,
          },
        });
      }),
    get: publicProcedure
      .input(z.object({ key: z.string() }))
      .query(async () => {
        const data = await prisma.guestbook.findMany({
          select: {
            id: true,
            created_at: true,
            email: false,
            username: true,
            message: true,
          },
        });

        return data;
      }),
    getWithEmail: publicProcedure
      .input(z.object({ key: z.string() }))
      .query(async ({ input }) => {
        const data = await prisma.guestbook.findMany({
          select: {
            id: true,
            created_at: true,
            email: true,
            username: true,
            message: true,
          },
        });
        return data;
      }),
    deleteByEmail: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        await prisma.guestbook.deleteMany({
          where: { email: input.email },
        });
      }),
    delete: publicProcedure
      .input(
        z.object({
          id: z.number(),
          username: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        await prisma.guestbook.delete({
          where: {
            id: input.id,
            username: input.username,
          },
        });
      }),
    put: publicProcedure
      .input(
        z.object({
          id: z.number(),
          message: z.string(),
          email: z.string(),
          username: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        await prisma.guestbook.update({
          data: {
            message: input.message,
          },
          where: {
            id: input.id,
            username: input.username,
            email: input.email,
          },
        });
      }),
  },
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
