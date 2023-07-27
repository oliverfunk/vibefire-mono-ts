import { Hono } from "hono";
import { Webhook } from "svix";

import { faunaClient } from "@vibefire/db";

type Bindings = {
  FAUNA_SECRET: string;
};

const wss = "whsec_EEMHOW6Z9Ey/rvQKAfT+J426BbmPEt5P";

const _getFaunaClient = (env: Bindings) => faunaClient(env.FAUNA_SECRET);

const webhooksRouter = new Hono<{ Bindings: Bindings }>();

webhooksRouter.use("*", (c, next) => {
  console.log("we're in webhooks bby!");
  console.log("c.env", c.env);
  return next();
});

webhooksRouter.get("/", (c) => c.text("Vibefire Webhooks!"));

webhooksRouter.post("/clerk/user.cud", async (c) => {
  console.log("in clerk user.cud");

  const headers = c.req.headers;
  const payload = await c.req.text();

  const h: Record<string, string> = {};
  headers.forEach((v, k) => {
    h[k] = v;
  });

  console.log("payload", payload);
  console.log("h", JSON.stringify(h, null, 2));

  const wh = new Webhook(wss);
  let msg;
  try {
    msg = wh.verify(payload, h);
  } catch (err) {
    return c.json({ status: "invalid" }, 400);
  }

  return c.json({ status: "ok" });
});

export { webhooksRouter };
