import { Hono } from "hono";
import { logger } from "hono/logger";

import {
  getWebhooksClerkManager,
  getWebhooksDataManager,
} from "@vibefire/managers/webhooks";

import { validateToHttpExp } from "./utils";

type Bindings = {
  FAUNA_SECRET: string;
  CLERK_WEBHOOK_SECRET: string;
};

const webhooksRouter = new Hono<{ Bindings: Bindings }>();

webhooksRouter.use("*", logger());

webhooksRouter.get("/", (c) => c.text("Vibefire Webhooks!"));

webhooksRouter.post("/clerk/user", async (c) => {
  const webhooksDataManager = getWebhooksDataManager(c.env.FAUNA_SECRET);
  const webhooksClerkManager = getWebhooksClerkManager(
    c.env.CLERK_WEBHOOK_SECRET,
  );

  const headers = c.req.headers;
  const payload = await c.req.text();

  const h: Record<string, string> = {};
  headers.forEach((v, k) => {
    h[k] = v;
  });

  const event = validateToHttpExp(() =>
    webhooksClerkManager.validateUserWebhookEvent(h, payload),
  );
  switch (event.type) {
    case "user.created": {
      const {
        id: aid,
        primary_email_address_id,
        primary_phone_number_id,
        email_addresses,
        first_name,
        phone_numbers,
        birthday,
      } = event.data;

      const contactEmail = email_addresses.find(
        (e) => e.id == primary_email_address_id,
      )?.email_address;

      const phoneNumber = phone_numbers.find(
        (p) => p.id == primary_phone_number_id,
      )?.phone_number;

      const _userID = await webhooksDataManager.userCreate(
        aid,
        first_name,
        contactEmail,
        phoneNumber,
        birthday,
      );

      return c.json({ status: "ok" }, 200);
    }
    case "user.updated": {
      // const {
      //   id: aid,
      //   primary_email_address_id,
      //   primary_phone_number_id,
      //   email_addresses,
      //   first_name,
      //   phone_numbers,
      //   birthday,
      // } = payload.data;

      // let dateOfBirth;
      // try {
      //   dateOfBirth = new Date(Date.parse(birthday));
      // } catch (err) {
      //   dateOfBirth = undefined;
      // }

      // const contactEmail = email_addresses.find(
      //   (e) => e.id == primary_email_address_id,
      // )?.email_address;

      // const phoneNumber = phone_numbers.find(
      //   (p) => p.id == primary_phone_number_id,
      // )?.phone_number;

      // const client = _getFaunaClient(c.env);
      // const userID = await updateUserInfo(client, aid, {
      //   name: first_name,
      //   contactEmail,
      //   phoneNumber,
      //   dateOfBirth,
      // });

      return c.json({ status: "ok" }, 200);
    }
    case "user.deleted": {
      // const { id: aid, object } = payload.data;

      // if (aid == undefined) {
      //   console.log("aid undefined in delete", JSON.stringify(object, null, 2));
      //   return c.json({ status: "ok" }, 200);
      // }

      // const client = _getFaunaClient(c.env);
      // const userID = await deleteUser(client, aid);

      return c.json({ status: "ok" }, 200);
    }
  }
});

export { webhooksRouter };
