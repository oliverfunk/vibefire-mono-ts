// import { type R2Bucket } from "@cloudflare/workers-types";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { timing } from "hono/timing";

import { BASEPATH_REST, BASEPATH_TRPC } from "@vibefire/api/basepaths";
import { restRouter } from "@vibefire/api/rest";
import { apiRouter, createContext } from "@vibefire/api/trpc";

type Bindings = {
  CF_ACCOUNT_ID: string;
  CF_IMAGES_API_KEY: string;
  CLERK_PEM: string;
  CLERK_ISSUER_API_URL: string;
  CLERK_WEBHOOK_SECRET: string;
  FAUNA_SECRET: string;
  SUPABASE_SECRET: string;
  GOOGLE_MAPS_API_KEY: string;
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

app.all(`${BASEPATH_TRPC}/*`, (c, next) => {
  const trpcHandler = trpcServer({
    router: apiRouter,
    onError({ error }) {
      console.error(error);
    },
    createContext: async (opts) =>
      await createContext({
        ...opts,
        env: {
          cfAccountId: c.env.CF_ACCOUNT_ID,
          cfImagesApiKey: c.env.CF_IMAGES_API_KEY,
          clerkPemString: c.env.CLERK_PEM,
          clerkIssuerApiUrl: c.env.CLERK_ISSUER_API_URL,
          faunaClientKey: c.env.FAUNA_SECRET,
          supabaseClientKey: c.env.SUPABASE_SECRET,
          googleMapsApiKey: c.env.GOOGLE_MAPS_API_KEY,
        },
      }),
  });
  return trpcHandler(c, next);
});

app.route(BASEPATH_REST, restRouter);

export default app;
