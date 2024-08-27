import { fql, type Client } from "fauna";

import {
  type TModelPlanItem,
  type TModelVibefireEntityAccess,
  type TModelVibefireEvent,
  type TModelVibefireGroup,
  type TModelVibefireMembership,
  type TModelVibefirePlan,
} from "@vibefire/models";

import { faunaAbortableQuery } from "./utils";

export class FaunaFunctions {
  constructor(private readonly faunaClient: Client) {}

  groupsUserIsPart(userAid: string) {
    return faunaAbortableQuery<TModelVibefireGroup[]>(
      this.faunaClient,
      fql`
        GroupsUserIsPart(${userAid})
      `,
    );
  }

  groupIfUserCanManage(groupId: string, userAid: string) {
    return faunaAbortableQuery<TModelVibefireGroup>(
      this.faunaClient,
      fql`
        GroupIfUserCanManage(${groupId}, ${userAid})
      `,
    );
  }

  groupIfUserCanView(groupId: string, userAid?: string) {
    return faunaAbortableQuery<TModelVibefireGroup>(
      this.faunaClient,
      fql`
        GroupIfUserCanView(${groupId}, ${userAid ?? null})
      `,
    );
  }

  groupIfUserCanViewViaLink(groupLinkId: string, userAid?: string) {
    return faunaAbortableQuery<TModelVibefireGroup>(
      this.faunaClient,
      fql`
        GroupIfUserCanViewViaLink(${groupLinkId}, ${userAid ?? null})
      `,
    );
  }

  eventsUserIsPart(userAid: string) {
    return faunaAbortableQuery<TModelVibefireEvent[]>(
      this.faunaClient,
      fql`
        EventsUserIsPart(${userAid})
      `,
    );
  }

  eventIfUserCanManage(eventId: string, userAid: string) {
    return faunaAbortableQuery<TModelVibefireEvent>(
      this.faunaClient,
      fql`
        EventIfUserCanManage(${eventId}, ${userAid})
      `,
    );
  }

  eventIfUserCanView(eventId: string, userAid?: string) {
    return faunaAbortableQuery<TModelVibefireEvent>(
      this.faunaClient,
      fql`
        EventIfUserCanView(${eventId}, ${userAid ?? null})
      `,
    );
  }

  eventIfUserCanViewViaLink(eventLinkId: string, userAid?: string) {
    return faunaAbortableQuery<TModelVibefireEvent>(
      this.faunaClient,
      fql`
        EventIfUserCanViewViaLink(${eventLinkId}, ${userAid ?? null})
      `,
    );
  }

  plansUserIsPart(userAid: string) {
    return faunaAbortableQuery<TModelVibefirePlan[]>(
      this.faunaClient,
      fql`
        PlansUserIsPart(${userAid})
      `,
    );
  }

  planIfUserCanManage(planId: string, userAid: string) {
    return faunaAbortableQuery<TModelVibefirePlan>(
      this.faunaClient,
      fql`
        PlanIfUserCanManage(${planId}, ${userAid})
      `,
    );
  }

  planIfUserCanView(planId: string, userAid?: string) {
    return faunaAbortableQuery<TModelVibefirePlan>(
      this.faunaClient,
      fql`
        PlanIfUserCanView(${planId}, ${userAid ?? null})
      `,
    );
  }

  planIfUserCanViewViaLink(planLinkId: string, userAid?: string) {
    return faunaAbortableQuery<TModelVibefirePlan>(
      this.faunaClient,
      fql`
        PlanIfUserCanViewViaLink(${planLinkId}, ${userAid ?? null})
      `,
    );
  }

  planItemsUserCanManage(planId: string, userAid: string) {
    return faunaAbortableQuery<TModelPlanItem[]>(
      this.faunaClient,
      fql`
        PlanItemsUserCanManage(${planId}, ${userAid})
      `,
    );
  }

  planItemsUserCanView(planId: string, userAid?: string) {
    return faunaAbortableQuery<TModelPlanItem[]>(
      this.faunaClient,
      fql`
        PlanEventsUserCanView(${planId}, ${userAid ?? null})
      `,
    );
  }

  createNewAccess(
    accessType: TModelVibefireEntityAccess["type"],
    userAid: string,
  ) {
    return faunaAbortableQuery<string>(
      this.faunaClient,
      fql`
        CreateNewAccess(${accessType}, ${userAid})
      `,
    );
  }

  setManagerForAccess(accessId: string, userAid: string, toSetUserAid: string) {
    return faunaAbortableQuery<TModelVibefireMembership>(
      this.faunaClient,
      fql`
        SetManagerForAccess(${accessId}, ${userAid}, ${toSetUserAid})
      `,
    );
  }

  setMemberForAccess(
    accessId: string,
    toSetUserAid: string,
    epochExpires: number | null,
  ) {
    return faunaAbortableQuery<TModelVibefireMembership>(
      this.faunaClient,
      fql`
        SetMemberForAccess(${accessId}, ${toSetUserAid}, ${epochExpires})
      `,
    );
  }

  createPendingRequestForAccess(accessId: string, toSetUserAid: string) {
    return faunaAbortableQuery<TModelVibefireMembership>(
      this.faunaClient,
      fql`
        CreatePendingRequestForAccess(${accessId}, ${toSetUserAid})
      `,
    );
  }

  createPendingInviteForAccess(accessId: string, toSetUserAid: string) {
    return faunaAbortableQuery<TModelVibefireMembership>(
      this.faunaClient,
      fql`
        CreatePendingInviteForAccess(${accessId}, ${toSetUserAid})
      `,
    );
  }

  acceptOrDenyPendingForMembership(
    membershipId: string,
    userAid: string,
    deny: boolean,
    epochExpires: number | null,
  ) {
    return faunaAbortableQuery<TModelVibefireMembership>(
      this.faunaClient,
      fql`
        AcceptOrDenyPendingForMembership(${membershipId}, ${userAid}, ${deny}, ${epochExpires})
    `,
    );
  }
}
