import { fql, type Client } from "fauna";

import {
  type TModelVibefireUser,
  type TModelVibefireUserNoId,
} from "@vibefire/models";

import { faunaNullableQuery, faunaQuery } from "!services/fauna/utils";

export class FaunaUserRepository {
  constructor(private readonly faunaClient: Client) {}

  withAid(userAid: string) {
    return faunaNullableQuery<TModelVibefireUser>(
      this.faunaClient,
      fql`
        User.withAid(${userAid}).first()
      `,
    );
  }

  create(user: TModelVibefireUserNoId) {
    return faunaQuery<{ id: string }>(
      this.faunaClient,
      fql`
        let d = ${user}
        User.create(d) {
          id
        }
      `,
    );
  }

  delete(userAid: string) {
    return faunaNullableQuery<TModelVibefireUser>(
      this.faunaClient,
      fql`
        User.withAid(${userAid}).first()?.delete()
      `,
    );
  }

  hideEvent = (userAid: string, eventId: string) => {
    return faunaQuery(
      this.faunaClient,
      fql`
      let user = ${this.withAid(userAid).query}
      let updatedHiddenEvents = user?.hiddenEvents.append(${eventId}).distinct()
      user?.update({ hiddenEvents: updatedHiddenEvents })
    `,
    );
  };

  hideOwner = (userAid: string, ownershipId: string) => {
    return faunaQuery(
      this.faunaClient,
      fql`
      let user = ${this.withAid(userAid).query}
      let updatedBlockedOwners = user?.blockedOrganisers.append(${ownershipId}).distinct()
      user?.update({ blockedOrganisers: updatedBlockedOwners })
    `,
    );
  };

  setUserPushToken = (userAid: string, token: string) => {
    return faunaQuery(
      this.faunaClient,
      fql`
        let user = ${this.withAid(userAid).query}
        user?.update(pushToken: ${token})
      `,
    );
  };

  clearUserPushToken = (userAid: string) => {
    return faunaQuery(
      this.faunaClient,
      fql`
      let user = ${this.withAid(userAid).query}
      user?.update(pushToken: null)
    `,
    );
  };
}
