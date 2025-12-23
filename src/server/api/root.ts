import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { documentRouter } from "./routers/document";

export const appRouter = createTRPCRouter({
  document: documentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
