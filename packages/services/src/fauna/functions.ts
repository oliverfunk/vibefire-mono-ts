import { fql, type Client } from "fauna";

import {
  type TModelVibefireEvent,
  type TModelVibefireGroup,
  type TModelVibefireGroupMembership,
  type TModelVibefirePlan,
} from "@vibefire/models";

import { faunaAbortableQuery } from "./utils";

export class FaunaFunctions {
  constructor(private readonly faunaClient: Client) {}

  userGroupMembership(groupId: string, userAid: string) {
    return faunaAbortableQuery<TModelVibefireGroupMembership | null>(
      this.faunaClient,
      fql`
        UserGroupMembership(${groupId}, ${userAid})
      `,
    );
  }

  userMemberships(userAid: string) {
    return faunaAbortableQuery<TModelVibefireGroupMembership[]>(
      this.faunaClient,
      fql`
        UserMemberships(${userAid})
      `,
    );
  }

  groupMemberships(groupId: string) {
    return faunaAbortableQuery<TModelVibefireGroupMembership[]>(
      this.faunaClient,
      fql`
        GroupMemberships(${groupId})
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

  planEventsUserCanManage(planId: string, userAid: string) {
    return faunaAbortableQuery<TModelVibefireEvent[]>(
      this.faunaClient,
      fql`
        PlanEventsUserCanManage(${planId}, ${userAid})
      `,
    );
  }

  planEventsUserCanView(planId: string, userAid?: string) {
    return faunaAbortableQuery<TModelVibefireEvent[]>(
      this.faunaClient,
      fql`
        PlanEventsUserCanView(${planId}, ${userAid ?? null})
      `,
    );
  }
}
