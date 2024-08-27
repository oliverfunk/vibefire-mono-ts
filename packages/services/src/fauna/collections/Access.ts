import { fql, type Client, type Page } from "fauna";

import {
  type AccessAction,
  type TModelVibefireEntityAccess,
  type TModelVibefireGroup,
  type TModelVibefireMembership,
} from "@vibefire/models";

import { type FaunaFunctions } from "!services/fauna//functions";
import {
  accessActionQuery,
  faunaNullableQuery,
  faunaQuery,
} from "!services/fauna/utils";

export class FaunaAccessRepository {
  constructor(
    private readonly faunaClient: Client,
    private readonly funcs: FaunaFunctions,
  ) {}

  withId(accessId: string) {
    return faunaNullableQuery<TModelVibefireEntityAccess>(
      this.faunaClient,
      fql`
        Access.byId(${accessId})
      `,
    );
  }

  membershipWithId(membershipId: string) {
    return faunaNullableQuery<TModelVibefireMembership>(
      this.faunaClient,
      fql`
        Membership.byId(${membershipId})
      `,
    );
  }

  setManager(accessId: string, userAid: string, toSetUserAid: string) {
    return this.funcs.setManagerForAccess(accessId, userAid, toSetUserAid);
  }

  setMember(accessId: string, toSetUserAid: string, epochExpires?: number) {
    return this.funcs.setMemberForAccess(
      accessId,
      toSetUserAid,
      epochExpires ?? null,
    );
  }

  setPending(
    accessId: string,
    toSetUserAid: string,
    scope: "request" | "invite",
  ) {
    switch (scope) {
      case "request":
        return this.funcs.createPendingRequestForAccess(accessId, toSetUserAid);
      case "invite":
        return this.funcs.createPendingInviteForAccess(accessId, toSetUserAid);
    }
  }

  membershipAcceptOrDenyPending(
    membershipId: string,
    userAid: string,
    scope: "accept" | "deny",
    epochExpires?: number,
  ) {
    const deny = scope === "deny";
    return this.funcs.acceptOrDenyPendingForMembership(
      membershipId,
      userAid,
      deny,
      epochExpires ?? null,
    );
  }
}
