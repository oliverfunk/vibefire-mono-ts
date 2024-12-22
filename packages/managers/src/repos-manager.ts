import { Result, type AsyncResult } from "@vibefire/models";
import {
  getFaunaService,
  type TAccessRepository,
  type TEventRepository,
  type TGroupRepository,
  type TPlanRepository,
  type TUserRepository,
} from "@vibefire/services/fauna";
import { resourceLocator } from "@vibefire/utils";

import { ManagerRuleViolation } from "./errors";
import { nullablePromiseToRes } from "./utils";

export const repoManagerSymbol = Symbol("repoManagerSymbol");

export const getReposManager = () =>
  resourceLocator().bindResource(repoManagerSymbol, () => {
    const faunaService = getFaunaService();
    return new ReposManager(
      faunaService.Event,
      faunaService.User,
      faunaService.Group,
      faunaService.Plan,
      faunaService.Access,
    );
  });

export class ReposManager {
  constructor(
    readonly event: TEventRepository,
    readonly user: TUserRepository,
    readonly group: TGroupRepository,
    readonly plan: TPlanRepository,
    readonly access: TAccessRepository,
  ) {}

  async eventIfManager(eventId: string, userAid: string) {
    return (
      await this.event.withIdIfUserCanManage(eventId, userAid).result
    ).unwrap();
  }

  async eventIfViewer(eventId: string, userAid?: string, shareCode?: string) {
    if (shareCode) {
      return (
        await this.event.withIdIfUserCanViewWithShareCode(eventId, shareCode)
          .result
      ).unwrap();
    }
    return (
      await this.event.withIdIfUserCanView(eventId, userAid).result
    ).unwrap();
  }

  async groupIfManager(groupId: string, userAid: string) {
    return (
      await this.group.withIdIfUserCanManage(groupId, userAid).result
    ).unwrap();
  }

  async groupIfViewer(groupId: string, userAid?: string) {
    return (
      await this.group.withIdIfUserCanView(groupId, userAid).result
    ).unwrap();
  }

  async planIfManager(planId: string, userAid: string) {
    return (
      await this.plan.withIdIfUserCanManage(planId, userAid).result
    ).unwrap();
  }

  async planIfViewer(planId: string, userAid: string) {
    return (
      await this.plan.withIdIfUserCanView(planId, userAid).result
    ).unwrap();
  }

  getUserProfile(userAid: string) {
    return nullablePromiseToRes(
      this.user.withAid(userAid).result,
      "Your profile does not exist",
    );
  }

  async getAccessRef(accessId: string) {
    return (
      await nullablePromiseToRes(
        this.access.withId(accessId).result,
        "Access does not exist",
      )
    ).unwrap();
  }

  async getOwnershipRef(ownershipId: string) {
    return (
      await nullablePromiseToRes(
        this.access.ownershipWithId(ownershipId).result,
        "Ownership does not exist",
      )
    ).unwrap();
  }

  async checkHasReachedCreationLimit(
    userAid: string,
    groupId?: string,
  ): AsyncResult<true> {
    const { data: drafts } = await this.event.allByOwnerByState(
      groupId ?? userAid,
      groupId ? "group" : "user",
      0, // is draft
      6, // limit
    ).result;

    if (drafts.length >= 50) {
      return Result.err(
        new ManagerRuleViolation(
          groupId
            ? "Your group has too many draft events"
            : "You have too many draft events",
        ),
      );
    }

    return Result.ok(true);
  }
}
