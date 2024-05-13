import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import {
  setManagersContext,
  type ManagersContext,
} from "@vibefire/managers/context";
import { getFaunaUserManager } from "@vibefire/managers/fauna-user";
import { getGoogleMapsManager } from "@vibefire/managers/google-maps";
import {
  authRequestWithClerk,
  type ClerkAuthContext,
} from "@vibefire/services/clerk";

type ContextProps = {
  auth: ClerkAuthContext;
  fauna: ReturnType<typeof getFaunaUserManager>;
  googleMapsManager: ReturnType<typeof getGoogleMapsManager>;
};

export const createContext = async ({ req, env }: CreateContextOptions) => {
  setManagersContext(env);
  return {
    auth: await authRequestWithClerk(
      env.clerkSecretKey!,
      env.clerkPemString!,
      req,
    ),
    fauna: getFaunaUserManager(),
    googleMapsManager: getGoogleMapsManager(),
  } as ContextProps;
};

export type Context = Awaited<ReturnType<typeof createContext>>;
export type CreateContextOptions = FetchCreateContextFnOptions & {
  env: ManagersContext;
};
