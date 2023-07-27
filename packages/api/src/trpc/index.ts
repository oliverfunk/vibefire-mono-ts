import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";

import { type ApiRouter } from "./routes";

export { type ApiRouter, apiRouter } from "./routes";
export { type Context, createContext } from "./context";

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<ApiRouter>;

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<ApiRouter>;
