import { UserWebhookEvent } from "@clerk/backend";
import { Hono } from "hono";
import { DateTime } from "luxon";

import {
  createUser,
  deleteUser,
  faunaClient,
  updateUserInfo,
} from "@vibefire/db";

import { validateClerkWebhook } from "./utils";

type Bindings = {
  FAUNA_SECRET: string;
};

const _getFaunaClient = (env: Bindings) => faunaClient(env.FAUNA_SECRET);

const webhooksRouter = new Hono<{ Bindings: Bindings }>();

webhooksRouter.use("*", (c, next) => {
  return next();
});

webhooksRouter.get("/", (c) => c.text("Vibefire Webhooks!"));

webhooksRouter.post("/clerk/user", async (c) => {
  const payload = await validateClerkWebhook<UserWebhookEvent>(c);
  switch (payload.type) {
    case "user.created": {
      const {
        id: aid,
        primary_email_address_id,
        primary_phone_number_id,
        email_addresses,
        first_name,
        phone_numbers,
        birthday,
      } = payload.data;

      const luxBirthday = DateTime.fromISO(birthday);
      const dateOfBirth = luxBirthday.isValid
        ? luxBirthday.toJSDate()
        : undefined;

      const contactEmail = email_addresses.find(
        (e) => e.id == primary_email_address_id,
      )?.email_address;

      const phoneNumber = phone_numbers.find(
        (p) => p.id == primary_phone_number_id,
      )?.phone_number;

      const client = _getFaunaClient(c.env);
      const userID = await createUser(client, aid, {
        name: first_name,
        contactEmail,
        phoneNumber,
        dateOfBirth,
      });

      return c.json({ status: "ok" }, 200);
    }
    case "user.updated": {
      const {
        id: aid,
        primary_email_address_id,
        primary_phone_number_id,
        email_addresses,
        first_name,
        phone_numbers,
        birthday,
      } = payload.data;

      let dateOfBirth;
      try {
        dateOfBirth = new Date(Date.parse(birthday));
      } catch (err) {
        dateOfBirth = undefined;
      }

      const contactEmail = email_addresses.find(
        (e) => e.id == primary_email_address_id,
      )?.email_address;

      const phoneNumber = phone_numbers.find(
        (p) => p.id == primary_phone_number_id,
      )?.phone_number;

      const client = _getFaunaClient(c.env);
      const userID = await updateUserInfo(client, aid, {
        name: first_name,
        contactEmail,
        phoneNumber,
        dateOfBirth,
      });

      return c.json({ status: "ok" }, 200);
    }
    case "user.deleted": {
      const { id: aid, object } = payload.data;

      if (aid == undefined) {
        console.log("aid undefined in delete", JSON.stringify(object, null, 2));
        return c.json({ status: "ok" }, 200);
      }

      const client = _getFaunaClient(c.env);
      const userID = await deleteUser(client, aid);

      return c.json({ status: "ok" }, 200);
    }
  }
});

export { webhooksRouter };
