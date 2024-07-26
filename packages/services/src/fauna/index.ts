import { Client } from "fauna";

import { serviceLocator } from "!services/locator";

import { FaunaEventsRepository } from "./collections/Event";
import { FaunaGroupsRepository } from "./collections/Group";
import { FaunaPlansRepository } from "./collections/Plan";
import { FaunaUsersRepository } from "./collections/User";
import { FaunaCallAborted } from "./errors";
import { FaunaFunctions } from "./functions";

export { FaunaCallAborted };

export type TEventsRepository = FaunaEventsRepository;
export type TUsersRepository = FaunaUsersRepository;
export type TGroupsRepository = FaunaGroupsRepository;
export type TPlansRepository = FaunaPlansRepository;

export type RepositoryService = {
  Event: FaunaEventsRepository;
  User: FaunaUsersRepository;
  Group: FaunaGroupsRepository;
  Plan: FaunaPlansRepository;
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
      Event: new FaunaEventsRepository(faunaClient, faunaFunctions),
      User: new FaunaUsersRepository(faunaClient),
      Group: new FaunaGroupsRepository(faunaClient, faunaFunctions),
      Plan: new FaunaPlansRepository(faunaClient, faunaFunctions),
      close: () => faunaClient.close(),
    };
  });
