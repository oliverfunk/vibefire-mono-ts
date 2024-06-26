import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { type ManagersContext } from "@vibefire/managers/context";
import { getFaunaUserManager } from "@vibefire/managers/fauna-user";
import { getGoogleMapsManager } from "@vibefire/managers/google-maps";
import { EventsUFManger } from "@vibefire/managers/uf-events";
import {
  authRequestWithClerk,
  type ClerkAuthContext,
} from "@vibefire/services/clerk";
import { getFaunaService } from "@vibefire/services/fauna";

type ContextProps = {
  auth: ClerkAuthContext;
  eventsManager: EventsUFManger;
};

export const createContext = async ({ req, env }: CreateContextOptions) => {
  const fauna = getFaunaService(env.faunaClientKey);
  return {
    auth: await authRequestWithClerk(
      env.clerkSecretKey,
      env.clerkPemString,
      req,
    ),
    eventsManager: new EventsUFManger(fauna.events, fauna.users),
  } as ContextProps;
};

export type Context = Awaited<ReturnType<typeof createContext>>;
export type CreateContextOptions = FetchCreateContextFnOptions & {
  env: {
    clerkSecretKey: string;
    clerkPemString: string;
    faunaClientKey: string;
  };
};
