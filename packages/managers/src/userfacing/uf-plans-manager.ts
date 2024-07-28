import { DateTime } from "luxon";

import {
  newVibefirePlan,
  type TModelVibefireEntityAccess,
} from "@vibefire/models";
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
    accessType: TModelVibefireEntityAccess["type"];
    groupId?: string;
  }) {
    return managerReturn(async () => {
      if (p.groupId) {
        const g = (
          await this.repos.group.withIdIfUserCanManage(p.groupId, p.userAid)
            .result
        ).unwrap();
        if (g.accessRef.type !== "public" && p.accessType === "public") {
          throw new ManagerRuleViolation(
            "You cannot create a public plan in a private group",
          );
        }
      } else {
        if (p.accessType === "public") {
          throw new ManagerRuleViolation(
            "Public plans can only be made through public groups",
          );
        }
      }

      const name = trimAndCropText(p.name, 100);
      const description = trimAndCropText(p.description, 1000);

      if (!name) {
        throw new ManagerRuleViolation("A plan name is required");
      }

      const epochCreated = DateTime.utc().toMillis();

      const newPlan = newVibefirePlan({
        type: p.accessType,
        ownerId: p.groupId ?? p.userAid,
        ownerType: p.groupId ? "group" : "user",
        organiserId: p.userAid,
        linkEnabled: true,
        linkId: crypto.randomUUID(),
        description,
        epochCreated,
      });
      const { id: planId } = await this.repos.plan.create(newPlan).result;

      const linkEventRes = await this.linkEventToPlan({
        userAid: p.userAid,
        planId,
        eventId: p.eventId,
        groupId: p.groupId,
      });

      if (linkEventRes.isErr) {
        await this.repos.plan.delete(planId).result;
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

      let plan;
      if (p.scope === "manage") {
        plan = (
          await this.repos.plan.withIdIfUserCanManage(p.planId, p.userAid!)
            .result
        ).unwrap();
      } else if (p.scope === "published") {
        plan = (
          await this.repos.plan.withIdIfUserCanView(p.planId, p.userAid).result
        ).unwrap();
      } else {
        throw new ManagerRuleViolation("Invalid scope");
      }

      return plan;
    });
  }

  async viewPlanEvents(p: {
    userAid?: string;
    planId: string;
    scope: "manage" | "published";
  }) {
    return managerReturn(async () => {
      if (p.scope === "manage" && !p.userAid) {
        throw new ManagerRuleViolation("You must be signed to view this");
      }

      let events;
      if (p.scope === "manage") {
        events = (
          await this.repos.plan.allEventsUserCanManage(p.planId, p.userAid!)
            .result
        ).unwrap();
      } else if (p.scope === "published") {
        events = (
          await this.repos.plan.allEventsUserCanView(p.planId, p.userAid).result
        ).unwrap();
      } else {
        throw new ManagerRuleViolation("Invalid scope");
      }

      return events;
    });
  }
  async linkEventToPlan(p: {
    userAid: string;
    planId: string;
    eventId: string;
    groupId?: string;
  }) {
    return managerReturn(async () => {
      const plan = (
        await this.repos.plan.withIdIfUserCanManage(p.planId, p.userAid).result
      ).unwrap();

      if (p.groupId && plan.ownerId !== p.groupId) {
        throw new ManagerRuleViolation("This plan is not owned by this group.");
      }

      if (!p.groupId && plan.ownerType === "group") {
        throw new ManagerRuleViolation(
          "This plan is owned by a group, you are not using a group context.",
        );
      }

      const eventManageRes = await this.repos.event.withIdIfUserCanManage(
        p.eventId,
        p.userAid,
      ).result;

      if (eventManageRes.isOk) {
        const event = eventManageRes.unwrap();

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

        if (event.state === -1) {
          throw new ManagerRuleViolation(
            "Draft events cannot be linked to a plan",
          );
        }

        // at this point, we know if groupId is passed in,
        // the event and plan are owned by the group
        // and the user can manage the group, or
        // the event and plan are owned by the user

        // todo: update the plan's access to the plan's

        await this.repos.plan.linkEvent(p.planId, p.eventId, {
          linkPlanToEventPartOf: true,
        }).result;
        return;
      }

      const event = (await this.repos.getEvent(p.eventId)).unwrap();
      if (event.state === 1 && event.accessRef.type === "public") {
        // otherwise, the event is published and public
        // so link it to the plan, without making the event "partOf" the plan
        await this.repos.plan.linkEvent(p.planId, p.eventId).result;
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
      (
        await this.repos.plan.withIdIfUserCanManage(p.planId, p.userAid).result
      ).unwrap();

      await this.repos.plan.unlinkEvent(p.planId, p.eventId).result;
    });
  }

  async deletePlan(p: { userAid: string; planId: string }) {
    return managerReturn(async () => {
      (
        await this.repos.plan.withIdIfUserCanManage(p.planId, p.userAid).result
      ).unwrap();

      // create new access for each event, clone of plan's and update each membership

      await this.repos.plan.delete(p.planId).result;
    });
  }
}
