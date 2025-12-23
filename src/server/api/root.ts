import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { documentRouter } from "./routers/document";
import { dashboardRouter } from "./routers/dashboard";

export const appRouter = createTRPCRouter({
  document: documentRouter,
  dashboard: dashboardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
