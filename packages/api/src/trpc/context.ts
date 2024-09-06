import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import {
  UFAccessManager,
  UFEventsManger,
  UFGroupsManger,
  UFPlansManager,
  UFUsersManager,
} from "@vibefire/managers/userfacing";
import {
  getClerkService,
  type ClerkAuthContext,
} from "@vibefire/services/clerk";
import { getFaunaService } from "@vibefire/services/fauna";

type ContextProps = {
  auth: ClerkAuthContext;
  accessManager: UFAccessManager;
  usersManager: UFUsersManager;
  eventsManager: UFEventsManger;
  plansManager: UFPlansManager;
  groupsManager: UFGroupsManger;
};

export const createContext = async ({ req, env }: CreateContextOptions) => {
  const clerk = getClerkService(env.clerkSecretKey, env.clerkPemString);
  return {
    auth: await clerk.authRequest(req),
    accessManager: UFAccessManager.fromService(
      getFaunaService(env.faunaClientKey),
    ),
    usersManager: UFUsersManager.fromService(
      getFaunaService(env.faunaClientKey),
      clerk,
    ),
    eventsManager: UFEventsManger.fromService(
      getFaunaService(env.faunaClientKey),
    ),
    plansManager: UFPlansManager.fromService(
      getFaunaService(env.faunaClientKey),
    ),
    groupsManager: UFGroupsManger.fromService(
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
