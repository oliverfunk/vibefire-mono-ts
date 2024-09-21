import { type DateTime } from "luxon";

import { resourceLocator } from "@vibefire/utils";

import { ManagerRuleViolation } from "!managers/errors";
import { getReposManager, ReposManager } from "!managers/repos-manager";
import { managerReturn } from "!managers/utils";

export const accessManagerSymbol = Symbol("accessManagerSymbol");
export const getAccessManager = () =>
  resourceLocator().bindResource(accessManagerSymbol, () => {
    return new UFAccessManager(getReposManager());
  });

export class UFAccessManager {
  constructor(private readonly repos: ReposManager) {}

  addManagerToEntity(p: {
    userAid: string;
    entityId: string;
    managerEmail: string;
    scope: "event" | "plan" | "group";
  }) {
    return managerReturn(async () => {
      const acc = await this.repos.entityAccessIfManager(
        p.scope,
        p.entityId,
        p.userAid,
      );
      const manager = await this.repos.user.withEmail(p.managerEmail).result;
      if (!manager) {
        // todo errors
        throw new Error("fix me");
      }
      await this.repos.access.setManager(acc.id, p.userAid, manager.aid).result;
    });
  }

  addMemberToEntity(p: {
    userAid: string;
    entityId: string;
    memberEmail: string;
    scope: "event" | "plan" | "group";
    expires?: DateTime;
  }) {
    return managerReturn(async () => {
      // userAid could be a member if acceess is open or public
      const acc = await this.repos.entityAccessIfMember(
        p.scope,
        p.entityId,
        p.userAid,
      );
      if (acc.type === "invite") {
        // will throw if not a manager
        await this.repos.entityAccessIfManager(p.scope, p.entityId, p.userAid);
      }

      const member = await this.repos.user.withEmail(p.memberEmail).result;
      if (!member) {
        // todo errors
        throw new Error("fix me");
      }

      // this should in the future send a pending-invite request
      // to the user "CreatePendingInviteForAccess"

      await this.repos.access.setMember(
        acc.id,
        member.aid,
        p.expires?.toMillis(),
      ).result;
    });
  }

  requestMembershipForEntity(p: {
    userAid: string;
    entityId: string;
    scope: "event" | "plan" | "group";
    inviteCode?: string;
  }) {
    return managerReturn(async () => {
      const acc = await this.repos.entityAccess(p.scope, p.entityId);
      if (acc.type === "invite") {
        if (acc.inviteCode) {
          if (acc.inviteCode === p.inviteCode) {
            await this.repos.access.setMember(acc.id, p.userAid).result;
          } else {
            throw new ManagerRuleViolation("Invite code does not match");
          }
        } else {
          await this.repos.access.setPending(acc.id, p.userAid, "request")
            .result;
        }
      } else if (acc.type === "public" || acc.type === "open") {
        await this.repos.access.setMember(acc.id, p.userAid).result;
      } else {
        throw new Error("This is broken");
      }
    });
  }

  acceptOrDenyMembershipRequest(p: {
    userAid: string;
    membershipId: string;
    scope: "accept" | "deny";
    expires?: DateTime;
  }) {
    return managerReturn(async () => {
      await this.repos.access.membershipAcceptOrDenyPending(
        p.membershipId,
        p.userAid,
        p.scope,
        p.expires?.toMillis(),
      ).result;
    });
  }
}
