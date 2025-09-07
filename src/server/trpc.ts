import { TRPCError, initTRPC } from "@trpc/server";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({});

export const router = t.router;

// all user can access this procedure
export const publicProcedure = t.procedure;

export const mergeRouters = t.mergeRouters;

export const createCallerFactory = t.createCallerFactory;

// Create a new procedure for admin-only access
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !(ctx.session as any)?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { session: ctx.session } });
});

const isAdmin = t.middleware(({ ctx, next }) => {
  const role = (ctx.session as any)?.user?.role;
  if (role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next();
});

export const adminProcedure = t.procedure.use(isAuthed).use(isAdmin);
