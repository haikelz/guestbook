import { prisma } from "@/lib/utils/prisma";
import { messageSchema } from "@/lib/utils/schemas";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  adminProcedure,
  authedProcedure,
  createCallerFactory,
  publicProcedure,
  router,
} from "../trpc";

export const appRouter = router({
  guestbook: {
    // Identity comes from the session, never from the client payload.
    post: authedProcedure
      .input(messageSchema)
      .mutation(async ({ ctx, input }) => {
        const email = ctx.session.user.email;
        const username = ctx.session.user.name?.trim() || email?.split("@")[0];
        if (!email || !username) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Profile has no email" });
        }
        await prisma.guestbook.create({
          data: { message: input.message, username, email },
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

        return data.map((item) => ({
          ...item,
          created_at: item.created_at.toISOString(),
        }));
      }),
    getWithEmail: adminProcedure
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
    deleteUserByEmail: adminProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        await prisma.guestbook.deleteMany({
          where: { email: input.email },
        });
      }),
    delete: adminProcedure
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
    deleteAllUsers: adminProcedure.mutation(async () => {
      await prisma.guestbook.deleteMany();
    }),
    put: adminProcedure
      .input(
        messageSchema.extend({
          id: z.number(),
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
