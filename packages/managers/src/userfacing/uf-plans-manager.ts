import { DateTime } from "luxon";

import { newVibefirePlanModel } from "@vibefire/models";
import { type RepositoryService } from "@vibefire/services/fauna";
import { trimAndCropText } from "@vibefire/utils";

import { ManagerRuleViolation } from "!managers/errors";
import { ReposManager } from "!managers/repos-manager";
import { managerReturn } from "!managers/utils";

export class UFPlansManager {
  constructor(private readonly repos: ReposManager) {}

  static fromService(repoService: RepositoryService) {
    return new UFPlansManager(ReposManager.fromService(repoService));
  }

  async newPlan(p: {
    userAid: string;
    name: string;
    description: string;
    eventId: string;
    groupId?: string;
  }) {
    return managerReturn(async () => {
      const group = p.groupId
        ? (await this.repos.getGroup(p.groupId)).unwrap()
        : null;

      if (group) {
        this.repos
          .checkUserGroupManager(
            group,
            p.userAid,
            "you cannot make plans for it",
          )
          .unwrap();
      }

      const name = trimAndCropText(p.name, 100);
      const description = trimAndCropText(p.description, 1000);

      if (!name) {
        throw new ManagerRuleViolation("A plan name is required");
      }

      const userProfile = (await this.repos.getUserProfile(p.userAid)).unwrap();
      const epochCreated = DateTime.utc().toMillis();

      const newPlan = newVibefirePlanModel({
        ownerId: p.groupId ?? p.userAid,
        ownerType: p.groupId ? "group" : "user",
        organiserId: p.userAid,
        organiserName: userProfile.name,
        name: name,
        description,
        epochCreatedAt: epochCreated,
        epochUpdatedAt: epochCreated,
      });
      const { id: planId } = await this.repos.plans.create(newPlan).result;

      const linkEventRes = await this.linkEventToPlan({
        userAid: p.userAid,
        planId,
        eventId: p.eventId,
        groupId: p.groupId,
      });

      if (linkEventRes.isErr) {
        await this.repos.plans.delete(planId).result;
        linkEventRes.unwrap();
      }

      return planId;
    });
  }

  async viewPlan(p: {
    userAid?: string;
    planId: string;
    scope: "manage" | "published";
  }) {
    return managerReturn(async () => {
      if (p.scope === "manage" && !p.userAid) {
        throw new ManagerRuleViolation("You must be signed to view this");
      }

      const plan = (await this.repos.getPlan(p.planId)).unwrap();
      const planEvents = (await this.repos.getPlanEvents(p.planId)).unwrap();

      if (p.scope === "manage") {
        (await this.repos.checkUserCanManagePlan(plan, p.userAid!)).unwrap();
      }

      const filteredEvents = planEvents.filter(
        (e) => this.repos.checkUserCanViewEvent(e, p.userAid).isOk,
      );

      return {
        plan,
        events: filteredEvents,
      };
    });
  }

  async linkEventToPlan(p: {
    userAid: string;
    planId: string;
    eventId: string;
    groupId?: string;
  }) {
    return managerReturn(async () => {
      const plan = (await this.repos.getPlan(p.planId)).unwrap();

      if (p.groupId && plan.ownerId !== p.groupId) {
        throw new ManagerRuleViolation("This plan is not owned by this group.");
      }

      (await this.repos.checkUserCanManagePlan(plan, p.userAid)).unwrap();

      const event = (await this.repos.getEvent(p.eventId)).unwrap();

      if ((await this.repos.checkUserCanManageEvent(event, p.userAid)).isOk) {
        // could happen if the user is trying to link
        // an event that the user owns,
        // to a plan owned by a group that user manages
        if (p.groupId && event.ownerId !== p.groupId) {
          throw new ManagerRuleViolation(
            "This event is not owned by this group",
          );
        }

        if (event.partOf && event.partOf !== p.planId) {
          throw new ManagerRuleViolation(
            "This event is already part of a plan, unlink it from that plan first.",
          );
        }

        // at this point, we know if groupId is passed in,
        // the event and plan are owned by the group
        // and the user can manage the group, or
        // the event and plan are owned by the user
        await this.repos.events.linkPartOf(p.eventId, p.planId).result;
        await this.repos.plans.linkEvent(p.planId, p.eventId).result;
      } else if (event.state === 1 && event.event.public) {
        // otherwise, the event is published and public
        // so link it to the plan, without making the event "partOf" the plan
        await this.repos.plans.linkEvent(p.planId, p.eventId).result;
      } else {
        throw new ManagerRuleViolation(
          "You either do not manage this event or it is not published and public",
        );
      }
    });
  }

  async unlinkEventFromPlan(p: {
    userAid: string;
    planId: string;
    eventId: string;
  }) {
    return managerReturn(async () => {
      const plan = (await this.repos.getPlan(p.planId)).unwrap();
      (await this.repos.checkUserCanManagePlan(plan, p.userAid)).unwrap();

      await this.repos.events.unlinkPartOfIfMatches(p.eventId, p.planId).result;
      await this.repos.plans.unlinkEvent(p.planId, p.eventId).result;
    });
  }

  async deletePlan(p: { userAid: string; planId: string }) {
    return managerReturn(async () => {
      const plan = (await this.repos.getPlan(p.planId)).unwrap();
      (await this.repos.checkUserCanManagePlan(plan, p.userAid)).unwrap();

      await this.repos.events.unlinkAllPartOf(p.planId).result;
      await this.repos.plans.delete(p.planId).result;
    });
  }
}
