import { createTRPCReact } from "@trpc/react-query";

import type {
  AppRouter,
  RouterInputs,
  RouterOutputs,
} from "@vibefire/api/trpc";

/**
 * A set of typesafe hooks for consuming your API.
 */
export const trpc = createTRPCReact<AppRouter>();
