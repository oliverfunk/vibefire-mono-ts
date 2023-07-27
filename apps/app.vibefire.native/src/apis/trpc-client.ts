import { createTRPCReact } from "@trpc/react-query";

import type {
  ApiRouter,
  RouterInputs,
  RouterOutputs,
} from "@vibefire/api/src/trpc";

/**
 * A set of typesafe hooks for consuming your API.
 */
export const trpc = createTRPCReact<ApiRouter>();
