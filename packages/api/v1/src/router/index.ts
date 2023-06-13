import { router } from "../trpc";
import { authRouter } from "./auth";
import { eventsRouter } from "./event";

// import { postRouter } from "./post";

export const appRouter = router({
  events: eventsRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
