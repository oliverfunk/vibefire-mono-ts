import { tb, tbValidator } from "@vibefire/utils";

import {
  authedProcedure,
  publicProcedure,
  router,
} from "!api/trpc/trpc-router";
import { wrapManagerReturn, type ApiResponse } from "!api/utils";

export const plansRouter = router({});
