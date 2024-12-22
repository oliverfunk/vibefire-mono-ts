import { router } from "!api/trpc/trpc-router";

import { accessRouter } from "./access-route";
import { authRouter } from "./auth-route";
import { eventsRouter } from "./events-route";
import { groupsRouter } from "./groups-route";
import { plansRouter } from "./plans-route";
import { servicesRoute } from "./services-route";
import { userRouter } from "./user-routes";

export const trpcRouter = router({
  auth: authRouter,
  access: accessRouter,
  user: userRouter,
  events: eventsRouter,
  plans: plansRouter,
  groups: groupsRouter,
  services: servicesRoute,
});

// export type definition of API
export type TRPCRouter = typeof trpcRouter;
