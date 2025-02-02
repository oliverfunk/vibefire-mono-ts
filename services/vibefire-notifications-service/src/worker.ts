import { Hono } from "hono";

import { getNotificationsManager } from "@vibefire/managers/service-facing";
import { resourceLocator } from "@vibefire/utils";

type Bindings = {
  FAUNA_ROLE_KEY: string;
  EXPO_ACCESS_TOKEN: string;
  VF_NOTIF_SERVICE_AUTH_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(async (c, next) => {
  resourceLocator().setCtx({
    fauna: {
      roleKey: c.env.FAUNA_ROLE_KEY,
    },
    expo: {
      expoAccessToken: c.env.EXPO_ACCESS_TOKEN,
    },
    vibefireNotifications: {
      authToken: c.env.VF_NOTIF_SERVICE_AUTH_TOKEN,
    },
  });
  await next();
});

app.get("/", (c) => {
  return c.text("Vibefire Notification Service!");
});

app.post("/send/user/:userAid", async (c) => {
  const { userAid } = c.req.param();

  const { title, body, toEventId } = await c.req.json<{
    title: string;
    body: string;
    toEventId?: string;
  }>();

  const notifsManager = getNotificationsManager();

  try {
    const pushTicket = (
      await notifsManager.sendUserNotification({
        userAid,
        title,
        body,
        toEventId,
      })
    ).unwrap();
    return c.json({ status: "ok", pushTicket });
  } catch (err) {
    return c.json(
      {
        status: "error",
        reason: err,
      },
      400,
    );
  }
});

app.get("/check/:receiptId", async (c) => {
  const { receiptId } = c.req.param();

  const notifsManager = getNotificationsManager();

  try {
    const pushReceipts = (
      await notifsManager.checkPushReceipts([receiptId])
    ).unwrap();
    return c.json({ status: "ok", pushReceipts });
  } catch (err) {
    return c.json(
      {
        status: "error",
        reason: err,
      },
      400,
    );
  }
});

export default app;
