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

  getEvent(eventId: string) {
    return nullablePromiseToRes(
      this.event.withId(eventId).result,
      "This event does not exist",
    );
  }

  async eventIfManager(eventId: string, userAid: string) {
    return (
      await this.event.withIdIfUserCanManage(eventId, userAid).result
    ).unwrap();
  }

  async eventIfViewer(eventId: string, userAid?: string) {
    return (
      await this.event.withIdIfUserCanView(eventId, userAid).result
    ).unwrap();
  }

  getGroup(groupId: string) {
    return nullablePromiseToRes(
      this.group.withId(groupId).result,
      "This group does not exist",
    );
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

  getPlan(planId: string) {
    return nullablePromiseToRes(
      this.plan.withId(planId).result,
      "This plan does not exist",
    );
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

  async entityAccess(entity: "event" | "group" | "plan", entityId: string) {
    switch (entity) {
      case "event":
        return (await this.getEvent(entityId)).unwrap().accessRef;
      case "group":
        return (await this.getGroup(entityId)).unwrap().accessRef;
      case "plan":
        return (await this.getPlan(entityId)).unwrap().accessRef;
    }
  }

  async entityAccessIfManager(
    entity: "event" | "group" | "plan",
    entityId: string,
    userAid: string,
  ) {
    switch (entity) {
      case "event":
        return (await this.eventIfManager(entityId, userAid)).accessRef;
      case "group":
        return (await this.groupIfManager(entityId, userAid)).accessRef;
      case "plan":
        return (await this.planIfManager(entityId, userAid)).accessRef;
    }
  }

  async entityAccessIfMember(
    entity: "event" | "group" | "plan",
    entityId: string,
    userAid: string,
  ) {
    switch (entity) {
      case "event":
        return (await this.eventIfViewer(entityId, userAid)).accessRef;
      case "group":
        return (await this.groupIfViewer(entityId, userAid)).accessRef;
      case "plan":
        return (await this.planIfViewer(entityId, userAid)).accessRef;
    }
  }

  async checkHasReachedDraftLimit(
    userAid: string,
    groupId?: string,
  ): AsyncResult<true> {
    const { data: drafts } = await this.event.allByOwnerByState(
      groupId ?? userAid,
      groupId ? "group" : "user",
      -1, // is draft
      6, // limit
    ).result;

    if (drafts.length >= 5) {
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
