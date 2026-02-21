import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { documentRouter } from "./routers/document";
import { dashboardRouter } from "./routers/dashboard";
import { notificationRouter } from "./routers/notification";

export const appRouter = createTRPCRouter({
  document: documentRouter,
  dashboard: dashboardRouter,
  notification: notificationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
