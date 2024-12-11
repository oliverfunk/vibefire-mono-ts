import { fql, type Client, type Page } from "fauna";

import {
  type AccessAction,
  type TModelVibefireAccess,
  type TModelVibefireMembership,
} from "@vibefire/models";

import { type FaunaFunctions } from "!services/fauna//functions";
import {
  faunaAbortableQuery,
  faunaNullableQuery,
  faunaQuery,
} from "!services/fauna/utils";

export class FaunaAccessRepository {
  constructor(
    private readonly faunaClient: Client,
    private readonly funcs: FaunaFunctions,
  ) {}

  withId(accessId: string) {
    return faunaNullableQuery<TModelVibefireAccess>(
      this.faunaClient,
      fql`
        Access.byId(${accessId})
      `,
    );
  }

  createOrGetAccess(accAct: AccessAction) {
    if (accAct.action === "link") {
      return faunaAbortableQuery<TModelVibefireAccess>(
        this.faunaClient,
        fql`
          Access.byId(${accAct.accessId})
        `,
      );
    } else {
      return this.funcs.createNewAccess(accAct.access.type, accAct.userId);
    }
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
}
