import { router } from "../trpc-router";
import { authRouter } from "./auth";
import { eventsRouter } from "./events";
import { userRouter } from "./user";

export const apiRouter = router({
  events: eventsRouter,
  auth: authRouter,
  user: userRouter,
});

// export type definition of API
export type ApiRouter = typeof apiRouter;
