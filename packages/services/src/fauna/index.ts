import { Client, type ClientConfiguration, type HTTPClient } from "fauna";

import { resourceLocator } from "@vibefire/utils";

import { FaunaAccessRepository } from "./collections/Access";
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
export type TAccessRepository = FaunaAccessRepository;

export type RepositoryService = {
  Event: FaunaEventRepository;
  User: FaunaUserRepository;
  Group: FaunaGroupRepository;
  Plan: FaunaPlanRepository;
  Access: FaunaAccessRepository;
  close: () => void;
};

export const faunaServiceSymbol = Symbol("faunaServiceSymbol");

export const getFaunaService = (
  options?: ClientConfiguration,
  httpClient?: HTTPClient,
): RepositoryService =>
  resourceLocator().bindResource<RepositoryService>(
    faunaServiceSymbol,
    (ctx) => {
      const faunaClient = new Client(
        {
          secret: ctx.fauna!.roleKey,
          ...options,
        },
        httpClient,
      );
      const faunaFunctions = new FaunaFunctions(faunaClient);
      return {
        Event: new FaunaEventRepository(faunaClient, faunaFunctions),
        User: new FaunaUserRepository(faunaClient),
        Group: new FaunaGroupRepository(faunaClient, faunaFunctions),
        Plan: new FaunaPlanRepository(faunaClient, faunaFunctions),
        Access: new FaunaAccessRepository(faunaClient, faunaFunctions),
        close: () => faunaClient.close(),
      };
    },
  );
