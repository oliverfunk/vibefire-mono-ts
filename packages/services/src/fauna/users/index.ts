import { Client, fql } from "fauna";

import { VibefireUserInfoT } from "@vibefire/models";

import { faunaQuery } from "!services/fauna/utils";

export class FaunaUsersRepository {
  constructor(private readonly faunaClient: Client) {}

  getUserProfile(userAid: string) {
    return faunaQuery<VibefireUserInfoT | null>(
      this.faunaClient,
      fql`
        Users.withAid(${userAid}).first()
      `,
    );
  }
}
