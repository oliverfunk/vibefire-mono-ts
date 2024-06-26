import { Client, fql } from "fauna";

import { serviceResolver } from "!services/resolver";

import { FaunaEventsRepository } from "./events";
import { FaunaGroupsRepository } from "./groups";
import { FaunaUsersRepository } from "./users";

export type TEventsRepository = FaunaEventsRepository;
export type TUsersRepository = FaunaUsersRepository;
export type TGroupsRepository = FaunaGroupsRepository;

type FaunaService = {
  Events: FaunaEventsRepository;
  Users: FaunaUsersRepository;
  Groups: FaunaGroupsRepository;
  close: () => void;
};

export const getFaunaService = (faunaClientRoleKey?: string): FaunaService => {
  return serviceResolver<FaunaService>().throughBind("fauna", () => {
    const faunaClient = new Client({
      secret: faunaClientRoleKey ?? process.env.FAUNA_ROLE_KEY_SECRETE!,
    });
    return {
      Events: new FaunaEventsRepository(faunaClient),
      Users: new FaunaUsersRepository(faunaClient),
      Groups: new FaunaGroupsRepository(faunaClient),
      close: () => faunaClient.close(),
    };
  });
};
