import { Hono } from "hono";

import { getClerkManager } from "@vibefire/managers/clerk";
import { setManagersContext } from "@vibefire/managers/context";
import { getFaunaUserManager } from "@vibefire/managers/fauna-user";

import { BASEPATH_WEBHOOKS } from "~/basepaths";
import { validateToHttpExp } from "./utils";

type Bindings = {
  FAUNA_SECRET: string;
  CLERK_WEBHOOK_EVENT_SECRET: string;
};

const webhooksRouter = new Hono<{ Bindings: Bindings }>();

webhooksRouter.use("*", async (c, next) => {
  setManagersContext({
    faunaClientKey: c.env.FAUNA_SECRET,
    clerkWebhookEventSecret: c.env.CLERK_WEBHOOK_EVENT_SECRET,
  });
  await next();
});

webhooksRouter.get("/", (c) => c.text("Vibefire Webhooks!"));

webhooksRouter.post(BASEPATH_WEBHOOKS + "/clerk", async (c) => {
  const fauna = getFaunaUserManager();
  const clerkManager = getClerkManager();

  const headers = c.req.header();
  const payload = await c.req.text();

  const event = validateToHttpExp(() =>
    clerkManager.validateWebhookEvent(headers, payload),
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

      const _userID = await fauna.userCreate(
        aid,
        first_name,
        contactEmail,
        phoneNumber,
        birthday,
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
