import { Hono } from "hono";

import { getUFUsersManager } from "@vibefire/managers/userfacing";
import { validateClerkWebhook } from "@vibefire/services/svix";
import { resourceLocator } from "@vibefire/utils";

import { BASEPATH_WEBHOOKS } from "!api/basepaths";

import { validateToHttpExp } from "./utils";

type Bindings = {
  FAUNA_ROLE_KEY: string;
  CLERK_PEM_STRING: string;
  CLERK_SECRET_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
  WEBHOOK_CLERK_SIGNING_SECRET: string;
};

const webhooksRouter = new Hono<{ Bindings: Bindings }>();

webhooksRouter.use("*", async (c, next) => {
  resourceLocator().setCtx({
    fauna: {
      roleKey: c.env.FAUNA_ROLE_KEY,
    },
    clerk: {
      pemString: c.env.CLERK_PEM_STRING,
      secretKey: c.env.CLERK_SECRET_KEY,
      publishableKey: c.env.CLERK_PUBLISHABLE_KEY,
    },
  });
  await next();
});

webhooksRouter.get("/", (c) => c.text("Vibefire Webhooks!"));

webhooksRouter.post(BASEPATH_WEBHOOKS + "/clerk", async (c) => {
  const usersManager = getUFUsersManager();

  const headers = c.req.header();
  const payload = await c.req.text();

  const event = validateToHttpExp(() =>
    validateClerkWebhook(headers, payload, c.env.WEBHOOK_CLERK_SIGNING_SECRET),
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
      } = event.data;

      const contactEmail = email_addresses.find(
        (e) => e.id == primary_email_address_id,
      )?.email_address;

      const phoneNumber = phone_numbers.find(
        (p) => p.id == primary_phone_number_id,
      )?.phone_number;

      const _userID = await usersManager.createNewUser(
        aid,
        first_name ?? undefined,
        contactEmail,
        phoneNumber,
        undefined,
      );
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
    }
    case "user.deleted": {
      // const { id: aid, object } = payload.data;
      // if (aid == undefined) {
      //   console.log("aid undefined in delete", JSON.stringify(object, null, 2));
      //   return c.json({ status: "ok" }, 200);
      // }
      // const client = _getFaunaClient(c.env);
      // const userID = await deleteUser(client, aid);
    }
  }
  console.log("handled", event.type, JSON.stringify(event, null, 2));
  return c.json({ status: "ok" }, 200);
});

export { webhooksRouter };
