import { createTRPCReact } from "@trpc/react-query";

import { BASEPATH_TRPC } from "@vibefire/api/src/basepaths";
import type { ApiRouter } from "@vibefire/api/src/trpc";

import { apiBaseUrl } from "./base-urls";

/**
 * A set of typesafe hooks for consuming your API.
 */
export const trpc = createTRPCReact<ApiRouter>();
export const trpcUrl = `${apiBaseUrl()}${BASEPATH_TRPC}`;
