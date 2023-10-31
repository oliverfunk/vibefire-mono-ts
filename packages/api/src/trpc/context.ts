import { type inferAsyncReturnType } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import {
  setManagersContext,
  type ManagersContext,
} from "@vibefire/managers/context";
import { getFaunaManager } from "@vibefire/managers/fauna";
import { getGoogleMapsManager } from "@vibefire/managers/google-maps";
import {
  authRequestWithClerk,
  type ClerkAuthContext,
} from "@vibefire/services/clerk";

type ContextProps = {
  auth: ClerkAuthContext;
  fauna: ReturnType<typeof getFaunaManager>;
  googleMapsManager: ReturnType<typeof getGoogleMapsManager>;
};

export const createContext = async ({ req, env }: CreateContextOptions) => {
  setManagersContext(env);

  return {
    auth: await authRequestWithClerk(
      env.clerkPemString!,
      env.clerkIssuerApiUrl!,
      req,
    ),
    fauna: getFaunaManager(),
    googleMapsManager: getGoogleMapsManager(),
  } as ContextProps;
};
export type Context = inferAsyncReturnType<typeof createContext>;
export type CreateContextOptions = FetchCreateContextFnOptions & {
  env: ManagersContext;
};
