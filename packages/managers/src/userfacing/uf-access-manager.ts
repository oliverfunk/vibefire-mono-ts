import { resourceLocator } from "@vibefire/utils";

import { getReposManager, type ReposManager } from "!managers/repos-manager";
import { managerReturn } from "!managers/utils";

export const accessManagerSymbol = Symbol("accessManagerSymbol");
export const getAccessManager = () =>
  resourceLocator().bindResource(accessManagerSymbol, () => {
    return new UFAccessManager(getReposManager());
  });

export class UFAccessManager {
  constructor(private readonly repos: ReposManager) {}

  addManagerToAccess(p: {
    accessId: string;
    userAid: string;
    userToMakeManagerId: string;
  }) {
    return managerReturn(async () => {});
  }

  joinOrLeaveAccess(p: {
    accessId: string;
    userAid: string;
    shareCode?: string;
    scope: "join" | "leave";
  }) {
    return managerReturn(async () => {
      if (p.scope === "join") {
        return (
          await this.repos.access.joinAccess(p.accessId, p.userAid, p.shareCode)
            .result
        ).unwrap();
      } else if (p.scope === "leave") {
        return (
          await this.repos.access.leaveAccess(p.accessId, p.userAid).result
        ).unwrap();
      } else {
        throw new Error(`Invalid scope: ${p.scope}`);
      }
    });
  }

  membershipOfAccessForUser(p: { accessId: string; userAid?: string }) {
    return managerReturn(async () => {
      return (
        await this.repos.access.membershipForUser(p.accessId, p.userAid).result
      ).unwrap();
    });
  }
}
