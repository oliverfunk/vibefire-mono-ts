import { Client } from "fauna";

import { serviceLocator } from "!services/locator";

import { FaunaEventsRepository } from "./events";
import { FaunaGroupsRepository } from "./groups";
import { FaunaPlansRepository } from "./plans";
import { FaunaUsersRepository } from "./users";

export type TEventsRepository = FaunaEventsRepository;
export type TUsersRepository = FaunaUsersRepository;
export type TGroupsRepository = FaunaGroupsRepository;
export type TPlansRepository = FaunaPlansRepository;

export type RepositoryService = {
  Events: FaunaEventsRepository;
  Users: FaunaUsersRepository;
  Groups: FaunaGroupsRepository;
  Plans: FaunaPlansRepository;
  close: () => void;
};

export const getFaunaService = (
  faunaClientRoleKey?: string,
): RepositoryService =>
  serviceLocator<RepositoryService>().throughBind("fauna", () => {
    const faunaClient = new Client({
      secret: faunaClientRoleKey ?? process.env.FAUNA_ROLE_KEY_SECRETE!,
    });
    return {
      Events: new FaunaEventsRepository(faunaClient),
      Users: new FaunaUsersRepository(faunaClient),
      Groups: new FaunaGroupsRepository(faunaClient),
      Plans: new FaunaPlansRepository(faunaClient),
      close: () => faunaClient.close(),
    };
  });
