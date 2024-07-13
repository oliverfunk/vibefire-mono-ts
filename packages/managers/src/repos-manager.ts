import {
  type TModelVibefireEvent,
  type TModelVibefirePlan,
  type TModelVibefireUser,
  type TVibefireGroup,
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
import { nullablePromiseToRes, type MAResult, type MResult } from "./utils";

// todo: impl locator in utils and use here
export const getReposManager = (service: RepositoryService) => {};

export class ReposManager {
  constructor(
    readonly events: TEventsRepository,
    readonly users: TUsersRepository,
    readonly groups: TGroupsRepository,
    readonly plans: TPlansRepository,
  ) {}

  static fromService(locator: RepositoryService) {
    return new ReposManager(
      locator.Events,
      locator.Users,
      locator.Groups,
      locator.Plans,
    );
  }

  getEvent(eventId: string): MAResult<TModelVibefireEvent> {
    return nullablePromiseToRes(
      this.events.withId(eventId).result,
      "This event does not exist",
    );
  }

  getGroup(groupId: string): MAResult<TVibefireGroup> {
    return nullablePromiseToRes(
      this.groups.getById(groupId).result,
      "This group does not exist",
    );
  }

  getUserProfile(userAid: string): MAResult<TModelVibefireUser> {
    return nullablePromiseToRes(
      this.users.getUserProfile(userAid).result,
      "Your profile does not exist",
    );
  }

  getPlan(planId: string): MAResult<TModelVibefirePlan> {
    return nullablePromiseToRes(
      this.plans.getById(planId).result,
      "This plan does not exist",
    );
  }

  getPlanEvents(planId: string): MAResult<TModelVibefireEvent[]> {
    return nullablePromiseToRes(
      this.plans.getPlanEvents(planId).result,
      "This plan does not exist",
    );
  }

  checkUserGroupManager(
    group: TVibefireGroup,
    userAid: string,
    messageExtra?: string,
  ): MResult<true> {
    if (group.ownerAid !== userAid && !group.managerAids.includes(userAid)) {
      return Result.err(
        new ManagerRuleViolation(
          `You do not manage this group${messageExtra ? `, ${messageExtra}` : ""}`,
        ),
      );
    }
    return Result.ok(true);
  }

  async checkUserCanManageEvent(
    event: TModelVibefireEvent,
    userAid: string,
  ): MAResult<true> {
    if (event.ownerType == "group") {
      return (await this.getGroup(event.ownerId)).chain((g) =>
        this.checkUserGroupManager(g, userAid, "you cannot manage this event"),
      );
    } else if (event.ownerId !== userAid) {
      return Result.err(
        new ManagerRuleViolation("You do not manage this group"),
      );
    }
    return Result.ok(true);
  }

  async checkUserCanManagePlan(
    plan: TModelVibefirePlan,
    userAid: string,
  ): MAResult<true> {
    if (plan.ownerType === "group") {
      return (await this.getGroup(plan.ownerId)).chain((g) =>
        this.checkUserGroupManager(g, userAid, "you cannot manage this plan"),
      );
    } else if (plan.ownerId !== userAid) {
      return Result.err(
        new ManagerRuleViolation("You cannot manage this plan"),
      );
    }
    return Result.ok(true);
  }

  checkUserCanViewEvent(
    event: TModelVibefireEvent,
    userAid?: string,
  ): MResult<true> {
    // must be published
    if (event.state !== 1) {
      return Result.err(
        new ManagerRuleViolation("This event is not published"),
      );
    }

    // if private
    if (!event.event.public) {
      if (!userAid) {
        return Result.err(
          new ManagerRuleViolation("You must be signed in to view"),
        );
      }
      // are they logged in and can view
      if (!event.event.canView.includes(userAid)) {
        return Result.err(new ManagerRuleViolation("This event is private"));
      }
    }

    // otherwise it's public
    return Result.ok(true);
  }

  async checkHasReachedDraftLimit(
    userAid: string,
    groupId?: string,
  ): MAResult<true> {
    const { data: drafts } = await this.events.byOwnerByState(
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
