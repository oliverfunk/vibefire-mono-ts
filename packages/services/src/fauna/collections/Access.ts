import { fql, type Client, type Page } from "fauna";

import {
  type AccessAction,
  type TModelVibefireAccess,
  type TModelVibefireMembership,
  type TModelVibefireOwnership,
} from "@vibefire/models";
import { randomAlphaNumeric, randomDigits } from "@vibefire/utils";

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

  create(accessType: TModelVibefireAccess["type"], userAid: string) {
    return this.funcs.createNewAccess(
      accessType,
      userAid,
      randomAlphaNumeric(10),
    );
  }

  makeAccessOpen(accessId: string, userAid: string) {
    return this.funcs.makeAccessOpen(accessId, userAid);
  }

  makeAccessInvite(accessId: string, userAid: string) {
    return this.funcs.makeAccessInvite(accessId, userAid);
  }

  setManager(accessId: string, userAid: string, toSetUserAid: string) {
    return this.funcs.setManagerForAccess(accessId, userAid, toSetUserAid);
  }

  joinAccess(accessId: string, userAid: string, shareCode?: string) {
    return this.funcs.joinAccess(
      accessId,
      userAid,
      shareCode ?? null,
      randomAlphaNumeric(10),
    );
  }

  leaveAccess(accessId: string, userAid: string) {
    return this.funcs.leaveAccess(accessId, userAid);
  }

  /**
   * Generates a share code for a user for a specific access.
   * The user must be a member to successfully generate a share code.
   *
   * @param accessId - The ID of the access resource.
   * @param userAid - The ID of the user for whom the share code is being generated.
   * @param regenerate - A boolean indicating whether to regenerate the share code if it already exists.
   * @returns A promise that resolves to the share code for the user.
   */
  generateShareCodeForUser(
    accessId: string,
    userAid: string,
    regenerate: boolean,
  ) {
    return this.funcs.shareCodeOfAccessForUser(
      accessId,
      userAid,
      crypto.randomUUID(),
      regenerate,
    );
  }

  // todo: move to Ownership file
  createOwnership(
    ownerType: TModelVibefireOwnership["ownerType"],
    ownerName: string,
  ) {
    return faunaQuery<TModelVibefireOwnership>(
      this.faunaClient,
      fql`
        Ownership.create({ ownerType: ${ownerType}, ownerName: ${ownerName} })
      `,
    );
  }
  ownershipWithId(ownershipId: string) {
    return faunaNullableQuery<TModelVibefireOwnership>(
      this.faunaClient,
      fql`
        Ownership.byId(${ownershipId})
      `,
    );
  }

  // todo: Move to Membership file
  membershipWithId(membershipId: string) {
    return faunaNullableQuery<TModelVibefireMembership>(
      this.faunaClient,
      fql`
        Membership.byId(${membershipId})
      `,
    );
  }

  membershipForUser(accessId: string, userAid?: string) {
    return this.funcs.membershipOfAccessForUser(accessId, userAid);
  }
}
