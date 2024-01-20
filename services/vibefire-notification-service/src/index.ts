// read https://docs.expo.dev/push-notifications/sending-notifications/#push-receipts

import express, { type RequestHandler } from "express";

import { setManagersContext } from "@vibefire/managers/context";
import { getExpoManager } from "@vibefire/managers/expo";
import { getFaunaExternalManager } from "@vibefire/managers/fauna-external";
import { getFaunaUserManager } from "@vibefire/managers/fauna-user";
import { getVibefireNotificationManager } from "@vibefire/managers/vf-notification";
import { vibefireEventShareLocalURL } from "@vibefire/utils";

// this code should live in a
// api-node package (the routes should be importable from the package)

setManagersContext({
  faunaClientKey: process.env.FAUNA_SECRET,
  expoAccessToken: process.env.EXPO_API_ACCESS_TOKEN,
  vfNotifServiceAccessToken: process.env.VF_NOTIF_SERVICE_ACCESS_TOKEN!,
});
const faunaUserManager = getFaunaUserManager();
const faunaExternalManager = getFaunaExternalManager();
const expoManager = getExpoManager();
const vfNotifManager = getVibefireNotificationManager();

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
  res.send("Hello from the Vibefire Notification Service!");
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
    const userPushToken = await faunaExternalManager.getUserPushToken(userAid);
    if (toEventLinkId) {
      // makes sure the event is visible for the user, will throw if not
      await faunaUserManager.publishedEventForExternalView(
        userAid,
        toEventLinkId,
      );
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
    if (ticket.status === "error") {
      // probably should handle the case where the push token is invalid
      // e.g. remove the expo push token?
      console.error("expo ticket error", JSON.stringify(ticket, null, 2));
    } else {
      await vfNotifManager.checkNotification(ticket.id);
    }
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
