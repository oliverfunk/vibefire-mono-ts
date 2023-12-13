import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { timing } from "hono/timing";

type Bindings = {
  VIBEFIRE_APPLE_APP_ID: string;
  VIBEFIRE_ANDROID_APP_ID: string;
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

app.get("/", (c) => {
  return c.html("");
});

app.get("/.well-known/apple-app-site-association", (c) => {
  return c.json({
    // This section enables Universal Links
    applinks: {
      apps: [],
      details: [
        {
          appID: c.env.VIBEFIRE_APPLE_APP_ID,
          // All paths that should support redirecting
          paths: ["/*"],
        },
      ],
    },
    // This section enables Apple Handoff
    activitycontinuation: {
      apps: [c.env.VIBEFIRE_APPLE_APP_ID],
    },
    // This section enable Shared Web Credentials
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
        sha256_cert_fingerprints: [
          // Supports multiple fingerprints for different apps and keys
          "{sha256_cert_fingerprints}",
        ],
      },
    },
  ]);
});
export default app;
