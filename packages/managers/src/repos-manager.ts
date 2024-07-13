import {
  type TModelVibefireEvent,
  type TModelVibefireGroup,
  type TModelVibefirePlan,
  type TModelVibefireUser,
} from "@vibefire/models";
import {
  type RepositoryService,
  type TEventsRepository,
  type TGroupsRepository,
  type TPlansRepository,
  type TUsersRepository,
} from "@vibefire/services/fauna";
import { Result } from "@vibefire/utils";

import { ManagerRuleViolation } from "./errors";
import { nullablePromiseToRes, type MAResult } from "./utils";

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

  getEvent(eventId: string): MAResult<TModelVibefireEvent> {
    return nullablePromiseToRes(
      this.event.withId(eventId).result,
      "This event does not exist",
    );
  }

  getGroup(groupId: string): MAResult<TModelVibefireGroup> {
    return nullablePromiseToRes(
      this.group.withId(groupId).result,
      "This group does not exist",
    );
  }

  getUserProfile(userAid: string): MAResult<TModelVibefireUser> {
    return nullablePromiseToRes(
      this.user.getUserProfile(userAid).result,
      "Your profile does not exist",
    );
  }

  getPlan(planId: string): MAResult<TModelVibefirePlan> {
    return nullablePromiseToRes(
      this.plan.withId(planId).result,
      "This plan does not exist",
    );
  }

  async checkHasReachedDraftLimit(
    userAid: string,
    groupId?: string,
  ): MAResult<true> {
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
