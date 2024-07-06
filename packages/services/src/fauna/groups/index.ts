import { fql, type Client } from "fauna";

import { type TVibefireGroup } from "@vibefire/models";

import { faunaNullableQuery, faunaQuery } from "!services/fauna/utils";

export class FaunaGroupsRepository {
  constructor(private readonly faunaClient: Client) {}

  getById(groupId: string) {
    return faunaNullableQuery<TVibefireGroup>(
      this.faunaClient,
      fql`
        Groups.byId(${groupId})
      `,
    );
  }

  allManagedByUser(userAid: string) {
    return faunaQuery<string[]>(
      this.faunaClient,
      fql`
      Get(Match(Index("groups_by_manager"), ${userAid}))
    `,
    );
  }
}
