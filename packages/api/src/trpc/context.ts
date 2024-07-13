import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { UFEventsManger, UFPlansManager } from "@vibefire/managers/userfacing";
import {
  authRequestWithClerk,
  type ClerkAuthContext,
} from "@vibefire/services/clerk";
import { getFaunaService } from "@vibefire/services/fauna";

type ContextProps = {
  auth: ClerkAuthContext;
  eventsManager: UFEventsManger;
  plansManager: UFPlansManager;
};

export const createContext = async ({ req, env }: CreateContextOptions) => {
  return {
    auth: await authRequestWithClerk(
      env.clerkSecretKey,
      env.clerkPemString,
      req,
    ),
    eventsManager: UFEventsManger.fromService(
      getFaunaService(env.faunaClientKey),
    ),
    plansManager: UFPlansManager.fromService(
      getFaunaService(env.faunaClientKey),
    ),
  } as ContextProps;
};

export type Context = Awaited<ReturnType<typeof createContext>>;
export type CreateContextOptions = FetchCreateContextFnOptions & {
  env: {
    clerkSecretKey: string;
    clerkPemString: string;
    faunaClientKey: string;
    googleMapsApiKey: string;
  };
};
