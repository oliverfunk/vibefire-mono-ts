import { type DateTime } from "luxon";

import { resourceLocator } from "@vibefire/utils";

import { ManagerRuleViolation } from "!managers/errors";
import { getReposManager, type ReposManager } from "!managers/repos-manager";
import { managerReturn } from "!managers/utils";

export const accessManagerSymbol = Symbol("accessManagerSymbol");
export const getAccessManager = () =>
  resourceLocator().bindResource(accessManagerSymbol, () => {
    return new UFAccessManager(getReposManager());
  });

export class UFAccessManager {
  constructor(private readonly repos: ReposManager) {}

  addManagerToEntity(p: {
    accessId: string;
    userAid: string;
    userToMakeManagerId: string;
  }) {
    return managerReturn(async () => {});
  }
}
