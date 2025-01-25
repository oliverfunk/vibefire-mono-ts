import { DateTime } from "luxon";

import {
  newVibefirePlan,
  type Pageable,
  type TModelPlanItem,
  type TModelVibefireAccess,
  type TModelVibefirePlan,
} from "@vibefire/models";
import {
  resourceLocator,
  trimAndCropText,
  type PartialDeep,
} from "@vibefire/utils";

import { ManagerRuleViolation } from "!managers/errors";
import { getReposManager, type ReposManager } from "!managers/repos-manager";
import { managerReturn } from "!managers/utils";

export const ufPlansManagerSymbol = Symbol("ufPlansManagerSymbol");
export const getUFPlansManager = () =>
  resourceLocator().bindResource(ufPlansManagerSymbol, () => {
    return new UFPlansManager(getReposManager());
  });

export class UFPlansManager {
  constructor(private readonly repos: ReposManager) {}

  // createNewPlan(p: {
  //   userAid: string;
  //   name: string;
  //   description: string;
  //   accessType: TModelVibefireAccess["type"];
  //   groupId?: string;
  // }) {
  //   return managerReturn(async () => {
  //     const forGroup = !!p.groupId;

  //     if (forGroup) {
  //       const g = (
  //         await this.repos.group.withIdIfUserCanManage(p.groupId!, p.userAid)
  //           .result
  //       ).unwrap();
  //       if (g.accessRef.type !== "public" && p.accessType === "public") {
  //         throw new ManagerRuleViolation(
  //           "You cannot create a public plan in a private group",
  //         );
  //       }
  //       accAct = { action: "link", accessId: g.accessRef.id };
  //     } else {
  //       if (p.accessType === "public") {
  //         throw new ManagerRuleViolation(
  //           "Public plans can only be made through public groups",
  //         );
  //       }
  //       accAct = {
  //         action: "create",
  //         access: newVibefireAccess({ type: p.accessType }),
  //         userId: p.userAid,
  //       };
  //     }

  //     const name = trimAndCropText(p.name, 100);
  //     const description = trimAndCropText(p.description, 1000);

  //     const newPlan = newVibefirePlan({
  //       ownerId: p.groupId ?? p.userAid,
  //       ownerType: p.groupId ? "group" : "user",
  //       organiserId: p.userAid,
  //       linkEnabled: true,
  //       linkId: crypto.randomUUID(),
  //       name,
  //       description,
  //       epochCreated: DateTime.utc().toMillis(),
  //     });
  //     const { id: planId } = await this.repos.plan.create(newPlan, accAct)
  //       .result;

  //     return planId;
  //   });
  // }

  // plansUserIsPart(p: {
  //   userAid: string;
  // }): ManagerAsyncResult<Pageable<PartialDeep<TModelVibefirePlan>>> {
  //   return managerReturn<Pageable<TModelVibefirePlan>>(async () => {
  //     const { data, after: afterKey } = await this.repos.plan.allUserIsPart(
  //       p.userAid,
  //       10,
  //     ).result;
  //     return {
  //       data,
  //       afterKey,
  //       limit: 10,
  //     };
  //   });
  // }

  // viewPlan(p: {
  //   userAid?: string;
  //   planId: string;
  //   scope: "manage" | "published";
  // }) {
  //   return managerReturn(async () => {
  //     if (p.scope === "manage" && !p.userAid) {
  //       throw new ManagerRuleViolation("You must be signed to view this");
  //     }

  //     let plan;
  //     if (p.scope === "manage") {
  //       plan = (
  //         await this.repos.plan.withIdIfUserCanManage(p.planId, p.userAid!)
  //           .result
  //       ).unwrap();
  //     } else if (p.scope === "published") {
  //       plan = (
  //         await this.repos.plan.withIdIfUserCanView(p.planId, p.userAid).result
  //       ).unwrap();
  //     } else {
  //       throw new ManagerRuleViolation("Invalid scope");
  //     }

  //     return plan;
  //   });
  // }

  // viewPlanItems(p: {
  //   userAid?: string;
  //   planId: string;
  //   scope: "manage" | "published";
  // }) {
  //   return managerReturn(async () => {
  //     if (p.scope === "manage" && !p.userAid) {
  //       throw new ManagerRuleViolation("You must be signed to view this");
  //     }

  //     let events;
  //     if (p.scope === "manage") {
  //       events = (
  //         await this.repos.plan.allItemsUserCanManage(p.planId, p.userAid!)
  //           .result
  //       ).unwrap();
  //     } else if (p.scope === "published") {
  //       events = (
  //         await this.repos.plan.allItemsUserCanView(p.planId, p.userAid).result
  //       ).unwrap();
  //     } else {
  //       throw new ManagerRuleViolation("Invalid scope");
  //     }

  //     return events;
  //   });
  // }

  // linkEventToPlan(p: {
  //   userAid: string;
  //   planId: string;
  //   planItem: TModelPlanItem;
  //   groupId?: string;
  // }) {
  //   return managerReturn(async () => {
  //     const plan = (
  //       await this.repos.plan.withIdIfUserCanManage(p.planId, p.userAid).result
  //     ).unwrap();

  //     if (p.groupId && plan.ownerId !== p.groupId) {
  //       throw new ManagerRuleViolation("This plan is not owned by this group.");
  //     }

  //     if (!p.groupId && plan.planOwnerType === "group") {
  //       throw new ManagerRuleViolation(
  //         "This plan is owned by a group, you are not in a group context.",
  //       );
  //     }

  //     if (plan.items.length >= 10) {
  //       throw new ManagerRuleViolation(
  //         "A plan can only have a maximum of 10 events",
  //       );
  //     }

  //     const eventManageRes = await this.repos.event.withIdIfUserCanManage(
  //       p.planItem.eventId,
  //       p.userAid,
  //     ).result;

  //     if (eventManageRes.isOk) {
  //       const event = eventManageRes.unwrap();

  //       // could happen if the user is trying to link
  //       // an event that the user owns,
  //       // to a plan owned by a group that user manages

  //       // this actually might be quite nice
  //       if (p.groupId && event.ownerId !== p.groupId) {
  //         throw new ManagerRuleViolation(
  //           "This event is not owned by this group",
  //         );
  //       }

  //       if (event.partOf && event.partOf !== p.planId) {
  //         throw new ManagerRuleViolation(
  //           "This event is already part of a plan, unlink it from that plan first.",
  //         );
  //       }

  //       if (event.state === -1) {
  //         throw new ManagerRuleViolation(
  //           "Draft events cannot be linked to a plan",
  //         );
  //       }

  //       // at this point, we know if groupId is passed in,
  //       // the event and plan are owned by the group
  //       // and the user can manage the group, or
  //       // the event and plan are owned by the user

  //       await this.repos.plan.linkEvent(p.planId, p.planItem, {
  //         // this implies merging the event's access with the plan's
  //         // if needed
  //         linkPlanToEventPartOfAndMergeAccess: true,
  //         userId: p.userAid,
  //       }).result;
  //       return;
  //     }

  //     const _event = await this.repos.eventIfViewer(
  //       p.planItem.eventId,
  //       p.userAid,
  //     );
  //     // otherwise, the event is published and public
  //     // so link it to the plan, without making the event "partOf" the plan
  //     await this.repos.plan.linkEvent(p.planId, p.planItem).result;
  //   });
  // }

  // unlinkEventFromPlan(p: { userAid: string; planId: string; eventId: string }) {
  //   return managerReturn(async () => {
  //     (
  //       await this.repos.plan.withIdIfUserCanManage(p.planId, p.userAid).result
  //     ).unwrap();

  //     await this.repos.plan.unlinkEvent(p.planId, p.eventId).result;
  //   });
  // }

  // deletePlan(p: { userAid: string; planId: string }) {
  //   return managerReturn(async () => {
  //     (
  //       await this.repos.plan.withIdIfUserCanManage(p.planId, p.userAid).result
  //     ).unwrap();

  //     // create new access for each event, clone of plan's and update each membership

  //     await this.repos.plan.delete(p.planId).result;
  //   });
  // }
}
