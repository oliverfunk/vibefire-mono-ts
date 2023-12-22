import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { timing } from "hono/timing";

type Bindings = {
  VIBEFIRE_APPLE_APP_ID: string;
  VIBEFIRE_ANDROID_APP_ID: string;
  VIBEFIRE_ANDROID_APP_SHA256: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", timing());

app.onError((err, c) => {
  console.error(JSON.stringify(err, null, 2));
  if (err instanceof HTTPException) {
    // Get the custom response
    return err.getResponse();
  }
  return c.text("internal error", 500);
});

app.get("/.well-known/apple-app-site-association", (c) => {
  return c.json({
    applinks: {
      details: [
        {
          appIDs: [c.env.VIBEFIRE_APPLE_APP_ID],
          components: [
            {
              "/": "*",
              comment: "Matches any URL",
            },
          ],
        },
      ],
    },
    activitycontinuation: {
      apps: [c.env.VIBEFIRE_APPLE_APP_ID],
    },
    webcredentials: {
      apps: [c.env.VIBEFIRE_APPLE_APP_ID],
    },
  });
});

app.get("/.well-known/assetlinks.json", (c) => {
  return c.json([
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: c.env.VIBEFIRE_ANDROID_APP_ID,
        sha256_cert_fingerprints: [c.env.VIBEFIRE_ANDROID_APP_SHA256],
      },
    },
  ]);
});

app.get("/*", (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vibefire</title>
        <meta charset="UTF-8" />
        <meta http-equiv="refresh" content="3; URL=https://vibefire.app/" />
      </head>
      <body></body>
    </html>
  `);
});

export default app;
