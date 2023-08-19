import { Hono } from "hono";

type Bindings = {
  FAUNA_SECRET: string;
};

const _getFaunaClient = (env: Bindings) => faunaClient(env.FAUNA_SECRET);

const restRouter = new Hono<{ Bindings: Bindings }>();

restRouter.use("*", (c, next) => {
  console.log("we're in rest bby!");
  return next();
});

restRouter.get("/", (c) => c.text("Vibefire Webhooks!"));

restRouter.post("/img/upload", async (c) => {
  console.log("in /img upload");

  return c.json({ status: "ok" });
});

export { restRouter };
