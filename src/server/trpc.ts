import { TRPCError, initTRPC } from "@trpc/server";
import type { Session } from "next-auth";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({});

export const router = t.router;

// all user can access this procedure
export const publicProcedure = t.procedure;

export const mergeRouters = t.mergeRouters;

export const createCallerFactory = t.createCallerFactory;

// Create a new procedure for admin-only access
const isAuthed = t.middleware(({ ctx, next }) => {
  const session = ctx.session as Session | null;
  if (!session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { session } });
});

const isAdmin = t.middleware(({ ctx, next }) => {
  const role = (ctx.session as Session | null)?.user?.role;
  if (role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next();
});

export const authedProcedure = t.procedure.use(isAuthed);

export const adminProcedure = authedProcedure.use(isAdmin);
