import { router } from "../trpc-router";
import { authRouter } from "./auth-route";
import { eventsRouter } from "./events-route";
import { userRouter } from "./user";

export const apiRouter = router({
  events: eventsRouter,
  auth: authRouter,
  user: userRouter,
});

// export type definition of API
export type ApiRouter = typeof apiRouter;
