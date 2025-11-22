import { initTRPC } from '@trpc/server';
import { cache } from 'react';
import superjson from 'superjson';

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   * Authentication removed - all routes are public
   */
  return { userId: 'anonymous' };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;


const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure;
