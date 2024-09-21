import { router } from "!api/trpc/trpc-router";

import { authRouter } from "./auth-route";
import { eventsRouter } from "./events-route";
import { groupsRouter } from "./groups-route";
import { plansRouter } from "./plans-route";
import { userRouter } from "./user-routes";

export const trpcRouter = router({
  auth: authRouter,
  user: userRouter,
  events: eventsRouter,
  plans: plansRouter,
  groups: groupsRouter,
});

// export type definition of API
export type TRPCRouter = typeof trpcRouter;
