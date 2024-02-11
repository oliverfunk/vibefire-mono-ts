import { createTRPCReact } from "@trpc/react-query";

import { BASEPATH_TRPC } from "@vibefire/api/src/basepaths";
import type { TRPCRouter } from "@vibefire/api/src/trpc";

import { trpcApiUrl } from "./base-urls";

export const trpc = createTRPCReact<TRPCRouter>();
export const trpcUrl = `${trpcApiUrl()}${BASEPATH_TRPC}`;
