import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { documentRouter } from "./routers/document";
import { dashboardRouter } from "./routers/dashboard";
import { notificationRouter } from "./routers/notification";
import { subscriptionRouter } from "./routers/subscription";

export const appRouter = createTRPCRouter({
  document: documentRouter,
  dashboard: dashboardRouter,
  notification: notificationRouter,
  subscription: subscriptionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
