import { fql, type Client } from "fauna";

import { type TModelVibefireUser } from "@vibefire/models";

import { faunaNullableQuery } from "!services/fauna/utils";

export class FaunaUsersRepository {
  constructor(private readonly faunaClient: Client) {}

  getUserProfile(userAid: string) {
    return faunaNullableQuery<TModelVibefireUser>(
      this.faunaClient,
      fql`
        Users.withAid(${userAid}).first()
      `,
    );
  }
}
