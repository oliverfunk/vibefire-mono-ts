import "reflect-metadata";

import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { timing } from "hono/timing";

import { BASEPATH_REST, BASEPATH_TRPC } from "@vibefire/api/basepaths";
import { restRouter } from "@vibefire/api/rest";
import { createContext, trpcRouter } from "@vibefire/api/trpc";

type Bindings = {
  CF_ACCOUNT_ID: string;
  CF_IMAGES_API_KEY: string;
  CLERK_PEM: string;
  CLERK_SECRET_KEY: string;
  FAUNA_SECRET: string;
  SUPABASE_SECRET: string;
  GOOGLE_MAPS_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(timing());

app.onError((err, c) => {
  console.error(JSON.stringify(err, null, 2));
  if (err instanceof HTTPException) {
    // Get the custom response
    return err.getResponse();
  }
  return c.text("internal error!", 500);
});

app.all(
  `${BASEPATH_TRPC}/*`,
  trpcServer({
    router: trpcRouter,
    onError({ error }) {
      console.error(error);
    },
    createContext: (opts, c) =>
      createContext({
        ...opts,
        env: {
          // cfAccountId: c.env.CF_ACCOUNT_ID,
          // cfImagesApiKey: c.env.CF_IMAGES_API_KEY,
          clerkPemString: c.env.CLERK_PEM,
          clerkSecretKey: c.env.CLERK_SECRET_KEY,
          faunaClientKey: c.env.FAUNA_SECRET,
          googleMapsApiKey: c.env.GOOGLE_MAPS_API_KEY,
        },
      }),
  }),
);

app.route(BASEPATH_REST, restRouter);

export default app;
