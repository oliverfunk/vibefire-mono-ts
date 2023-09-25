import { type R2Bucket } from "@cloudflare/workers-types";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import {
  BASEPATH_REST,
  BASEPATH_TRPC,
  BASEPATH_WEBHOOKS,
} from "@vibefire/api/basepaths";
import { restRouter } from "@vibefire/api/rest";
import { apiRouter, createContext } from "@vibefire/api/trpc";
import { webhooksRouter } from "@vibefire/api/webhooks";

type Bindings = {
  CLERK_PEM: string;
  CLERK_ISSUER_API_URL: string;
  CLERK_WEBHOOK_SECRET: string;
  FAUNA_SECRET: string;
  SUPABASE_SECRET: string;
  GOOGLE_MAPS_API_KEY: string;
  // services
  BUCKET_IMAGES_EU: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();

app.onError((err, c) => {
  console.error(JSON.stringify(err, null, 2));
  if (err instanceof HTTPException) {
    // Get the custom response
    return err.getResponse();
  }
  return c.text("internal error", 500);
});

app.all(`${BASEPATH_TRPC}/*`, (c, next) => {
  const trpcHandler = trpcServer({
    router: apiRouter,
    onError({ error }) {
      console.error(error);
    },
    createContext: async (opts) =>
      await createContext({
        ...opts,
        clerkPemString: c.env.CLERK_PEM,
        clerkIssuerApiUrl: c.env.CLERK_ISSUER_API_URL,
        faunaClientKey: c.env.FAUNA_SECRET,
        supabaseClientKey: c.env.SUPABASE_SECRET,
        googleMapsApiKey: c.env.GOOGLE_MAPS_API_KEY,
        bucketImagesEU: c.env.BUCKET_IMAGES_EU,
      }),
  });
  return trpcHandler(c, next);
});

app.route(BASEPATH_REST, restRouter);

app.route(BASEPATH_WEBHOOKS, webhooksRouter);

export default app;
