import { Client } from "fauna";

import { getUserPushToken } from "@vibefire/services/fauna";

import { managersContext } from "~/managers-context";

let _FaunaExternalManager: FaunaExternalManager | undefined;
export const getFaunaExternalManager = (): FaunaExternalManager => {
  "use strict";
  if (!_FaunaExternalManager) {
    const faunaKey = managersContext().faunaClientKey!;
    _FaunaExternalManager = new FaunaExternalManager(faunaKey);
  }
  return _FaunaExternalManager;
};

export class FaunaExternalManager {
  private faunaClient: Client;
  constructor(faunaKey: string) {
    this.faunaClient = new Client({
      secret: faunaKey,
    });
  }

  async getUserPushToken(userAid: string): Promise<string> {
    const token = await getUserPushToken(this.faunaClient, userAid);
    if (!token) {
      throw new Error("Token not set for user");
    }
    return token;
  }
}
