/* eslint-disable @typescript-eslint/no-unused-vars */
import { options as nextAuthOptions } from "@/pages/api/auth/[...nextauth]";
import type * as trpcNext from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth";

interface CreateContextOptions {
  session: Awaited<ReturnType<typeof getServerSession>>;
}

export async function createContextInner(opts: CreateContextOptions) {
  return { session: opts.session };
}

export type Context = Awaited<ReturnType<typeof createContextInner>>;

export async function createContext(
  opts: trpcNext.CreateNextContextOptions
): Promise<Context> {
  const session = await getServerSession(opts.req, opts.res, nextAuthOptions);
  return await createContextInner({ session });
}
