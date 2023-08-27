import { router } from "../trpc-router";
import { authRouter } from "./auth";
import { eventsRouter } from "./events";

export const apiRouter = router({
  events: eventsRouter,
  auth: authRouter,
});

// export type definition of API
export type ApiRouter = typeof apiRouter;
