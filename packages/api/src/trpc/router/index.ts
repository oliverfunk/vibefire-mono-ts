import { router } from "../trpc";
import { authRouter } from "./auth";
import { eventsRouter } from "./event";

export const appRouter = router({
  events: eventsRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
