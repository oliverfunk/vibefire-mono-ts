import {
  type RepositoryService,
  type TEventsRepository,
  type TGroupsRepository,
  type TPlansRepository,
  type TUsersRepository,
} from "@vibefire/services/fauna";
import { Result, type AsyncResult } from "@vibefire/utils";

import { ManagerRuleViolation } from "./errors";
import { nullablePromiseToRes } from "./utils";

// todo: impl locator in utils and use here
export const getReposManager = (service: RepositoryService) => {};

export class ReposManager {
  constructor(
    readonly event: TEventsRepository,
    readonly user: TUsersRepository,
    readonly group: TGroupsRepository,
    readonly plan: TPlansRepository,
  ) {}

  static fromService(locator: RepositoryService) {
    return new ReposManager(
      locator.Event,
      locator.User,
      locator.Group,
      locator.Plan,
    );
  }

  getEvent(eventId: string) {
    return nullablePromiseToRes(
      this.event.withId(eventId).result,
      "This event does not exist",
    );
  }

  getGroup(groupId: string) {
    return nullablePromiseToRes(
      this.group.withId(groupId).result,
      "This group does not exist",
    );
  }

  getUserProfile(userAid: string) {
    return nullablePromiseToRes(
      this.user.getUserProfile(userAid).result,
      "Your profile does not exist",
    );
  }

  getPlan(planId: string) {
    return nullablePromiseToRes(
      this.plan.withId(planId).result,
      "This plan does not exist",
    );
  }

  async checkHasReachedDraftLimit(
    userAid: string,
    groupId?: string,
  ): AsyncResult<true> {
    const { data: drafts } = await this.event.allByOwnerByState(
      groupId ?? userAid,
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
