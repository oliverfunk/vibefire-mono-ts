import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";

import { trpcRouter, type TRPCRouter } from "./routes";
import { createCallerFactory } from "./trpc-router";

export { type TRPCRouter, trpcRouter } from "./routes";
export { type Context, createContext } from "./context";

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<TRPCRouter>;

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<TRPCRouter>;

export const createCaller = createCallerFactory(trpcRouter);
