// read https://docs.expo.dev/push-notifications/sending-notifications/#push-receipts

import express, { type RequestHandler } from "express";

import { setManagersContext } from "@vibefire/managers/context";
import { getExpoManager } from "@vibefire/managers/expo";
import { getFaunaManager } from "@vibefire/managers/fauna";
import {
  checkNotification,
  type ExpoNotificationsService,
} from "@vibefire/services/vibefire-notifications-service";
import { vibefireEventShareLocalURL } from "@vibefire/utils";

setManagersContext({
  faunaClientKey: process.env.FAUNA_SECRET,
  expoAccessToken: process.env.EXPO_API_ACCESS_TOKEN,
});
const faunaManager = getFaunaManager();
const expoManager = getExpoManager();

const vibefireNotificationService: ExpoNotificationsService = {
  endpoint: process.env.VIBEFIRE_NOTIFICATIONS_SERVICE_ENDPOINT!,
  secret: process.env.VIBEFIRE_NOTIFICATIONS_SERVICE_SECRET!,
};

const app = express();

const logger: RequestHandler = (req, res, next) => {
  console.log(
    "incoming request:",
    JSON.stringify(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      { method: req.method, url: req.url, body: req.body },
      null,
      2,
    ),
  );
  next();
};

app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.send("Hello from the Vibefire Expo Notifications Service!");
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post("/send/user/:userAid", async (req, res) => {
  const { userAid } = req.params;

  const { title, body, toEventLinkId } = req.body as {
    title: string;
    body: string;
    toEventLinkId?: string;
  };

  let sendEventURL = false;

  try {
    const userPushToken = await faunaManager.externalGetUserPushToken(userAid);
    if (toEventLinkId) {
      // makes sure the user can see the event
      await faunaManager.publishedEventForExternalView(userAid, toEventLinkId);
      sendEventURL = true;
    }
    const ticket = await expoManager.sendPushNotification(
      userPushToken,
      title,
      body,
      sendEventURL
        ? {
            url: vibefireEventShareLocalURL(toEventLinkId!),
          }
        : undefined,
    );
    console.log("notfi ticket", JSON.stringify(ticket, null, 2));
    await checkNotification(vibefireNotificationService);
  } catch (err) {
    res.status(400).json({ status: "error", reason: err });
    return;
  }
  res.json({ status: "ok" });
});

app.post("/send/group/:groupId", (req, res) => {});

app.post("/send/event/:eventId", (req, res) => {});

app.post("/check", (req, res) => {
  res.json({ status: "ok" });
});

export const service = app;

app.routes;
