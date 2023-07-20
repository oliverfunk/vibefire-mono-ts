import { type inferAsyncReturnType } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { faunaClient, supabaseClient } from "@vibefire/db";

import { getBackendAuthContext, type AuthContext } from "./auth";

type ContextProps = {
  auth: AuthContext;
  faunaClient: ReturnType<typeof faunaClient>;
  supabaseClient: ReturnType<typeof supabaseClient>;
};

export const createContextInner = ({
  auth,
  faunaClient,
  supabaseClient,
}: ContextProps) => {
  return {
    auth,
    faunaClient,
    supabaseClient,
  };
};

export const createContext = ({
  req,
  faunaClientKey,
  supabaseClientKey,
}: CreateContextOptions) => {
  return createContextInner({
    auth: getBackendAuthContext(req),
    faunaClient: faunaClient(faunaClientKey),
    supabaseClient: supabaseClient(supabaseClientKey),
  });
};
export type Context = inferAsyncReturnType<typeof createContext>;
export type CreateContextOptions = FetchCreateContextFnOptions & {
  faunaClientKey: string;
  supabaseClientKey: string;
};
