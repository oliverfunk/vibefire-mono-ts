import { Client, fql } from "fauna";

import { TVibefireGroup } from "@vibefire/models";

import { faunaQuery } from "!services/fauna/utils";

export class FaunaGroupsRepository {
  constructor(private readonly faunaClient: Client) {}

  getGroup(groupId: string) {
    return faunaQuery<TVibefireGroup | null>(
      this.faunaClient,
      fql`
        Groups.byId(${groupId})
      `,
    );
  }

  getGroupsManagedByUserWithAid(userAid: string) {
    return faunaQuery<string[]>(
      this.faunaClient,
      fql`
      Get(Match(Index("groups_by_manager"), ${userAid}))
    `,
    );
  }
}
