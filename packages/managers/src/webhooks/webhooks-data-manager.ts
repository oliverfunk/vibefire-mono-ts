import { Value } from "@sinclair/typebox/value";
import { Client } from "fauna";
import { DateTime } from "luxon";

import { VibefireUserSchema } from "@vibefire/models";
import { createUser } from "@vibefire/services/fauna";
import { removeUndef } from "@vibefire/utils";

export class WebhooksDataManager {
  private faunaClient: Client;
  constructor(faunaKey: string) {
    this.faunaClient = new Client({
      secret: faunaKey,
    });
  }

  async userCreate(
    aid: string,
    firstName: string,
    primaryEmail: string | undefined,
    primaryPhone: string | undefined,
    birthdayISO: string | undefined,
  ) {
    if (!aid) {
      throw new Error("aid is required");
    }
    if (firstName.length < 2) {
      throw new Error("firstName must be at least 2 characters long");
    }
    if (
      primaryEmail &&
      !Value.Check(VibefireUserSchema.properties.contactEmail, primaryEmail)
    ) {
      console.error("primaryEmail is invalid");
      primaryEmail = undefined;
    }
    if (
      primaryPhone &&
      !Value.Check(VibefireUserSchema.properties.phoneNumber, primaryPhone)
    ) {
      console.error("primaryPhone is invalid");
      primaryPhone = undefined;
    }

    const dateOfBirth = !!birthdayISO
      ? DateTime.fromISO(birthdayISO).toISODate() ?? undefined
      : undefined;

    const u = Value.Create(VibefireUserSchema);

    u.aid = aid;
    u.name = firstName;
    u.contactEmail = primaryEmail;
    u.phoneNumber = primaryPhone;
    u.dateOfBirth = dateOfBirth;

    removeUndef(u);

    const res = await createUser(this.faunaClient, u);
    return res;
  }
}
