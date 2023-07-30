import { type inferAsyncReturnType } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { faunaClient, supabaseClient } from "@vibefire/db";

import { authRequestWithClerk, type ClerkAuthContext } from "~/auth";

type ContextProps = {
  auth: ClerkAuthContext;
  faunaClient: ReturnType<typeof faunaClient>;
  supabaseClient: ReturnType<typeof supabaseClient>;
};

const createContextInner = ({
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

export const createContext = async ({
  req,
  clerkPemString,
  clerkIssuerApiUrl,
  faunaClientKey,
  supabaseClientKey,
}: CreateContextOptions) => {
  return createContextInner({
    auth: await authRequestWithClerk(clerkPemString, clerkIssuerApiUrl, req),
    faunaClient: faunaClient(faunaClientKey),
    supabaseClient: supabaseClient(supabaseClientKey),
  });
};
export type Context = inferAsyncReturnType<typeof createContext>;
export type CreateContextOptions = FetchCreateContextFnOptions & {
  clerkPemString: string;
  clerkIssuerApiUrl: string;
  faunaClientKey: string;
  supabaseClientKey: string;
};
