import { router } from "../trpc-router.js";
import { authRouter } from "./auth-route";
import { eventsRouter } from "./events-route";
import { userRouter } from "./user-routes";

export const trpcRouter = router({
  events: eventsRouter,
  auth: authRouter,
  user: userRouter,
});

// export type definition of API
export type TRPCRouter = typeof trpcRouter;
