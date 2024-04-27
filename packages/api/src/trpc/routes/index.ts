import { router } from "!api/trpc/trpc-router";

import { authRouter } from "./auth-route";
import { eventsRouter } from "./events-route";
import { groupsRouter } from "./groups-route";
import { userRouter } from "./user-routes";

export const trpcRouter = router({
  events: eventsRouter,
  auth: authRouter,
  user: userRouter,
  groups: groupsRouter,
});

// export type definition of API
export type TRPCRouter = typeof trpcRouter;
