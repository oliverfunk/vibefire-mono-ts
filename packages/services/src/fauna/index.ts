import { Client } from "fauna";

import { serviceLocator } from "!services/locator";

import { FaunaEventRepository } from "./collections/Event";
import { FaunaGroupRepository } from "./collections/Group";
import { FaunaPlanRepository } from "./collections/Plan";
import { FaunaUserRepository } from "./collections/User";
import { FaunaCallAborted } from "./errors";
import { FaunaFunctions } from "./functions";

export { FaunaCallAborted };

export type TEventRepository = FaunaEventRepository;
export type TUserRepository = FaunaUserRepository;
export type TGroupRepository = FaunaGroupRepository;
export type TPlanRepository = FaunaPlanRepository;

export type RepositoryService = {
  Event: FaunaEventRepository;
  User: FaunaUserRepository;
  Group: FaunaGroupRepository;
  Plan: FaunaPlanRepository;
  close: () => void;
};

export const getFaunaService = (
  faunaClientRoleKey?: string,
): RepositoryService =>
  serviceLocator<RepositoryService>().throughBind("fauna", () => {
    const faunaClient = new Client({
      secret: faunaClientRoleKey ?? process.env.FAUNA_ROLE_KEY_SECRETE!,
    });
    const faunaFunctions = new FaunaFunctions(faunaClient);
    return {
      Event: new FaunaEventRepository(faunaClient, faunaFunctions),
      User: new FaunaUserRepository(faunaClient),
      Group: new FaunaGroupRepository(faunaClient, faunaFunctions),
      Plan: new FaunaPlanRepository(faunaClient, faunaFunctions),
      close: () => faunaClient.close(),
    };
  });
