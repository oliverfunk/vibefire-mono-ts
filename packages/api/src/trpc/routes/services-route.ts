import { CoordSchema, tb, tbValidator } from "@vibefire/models";
import { getGoogleMapService } from "@vibefire/services/google-maps";

import { authedProcedure, router } from "!api/trpc/trpc-router";
import { wrapApiReturn, type ApiResponse } from "!api/utils";

export const servicesRoute = router({
  positionAddressInfo: authedProcedure
    .input(
      tbValidator(
        tb.Object({
          position: CoordSchema,
        }),
      ),
    )
    .output((value) => value as ApiResponse<string>)
    .mutation(({ input }) =>
      wrapApiReturn(() => {
        return getGoogleMapService().getPositionStreetAddress(input.position);
      }),
    ),
});
