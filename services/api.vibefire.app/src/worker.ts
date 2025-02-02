/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { timing } from "hono/timing";

import { BASEPATH_REST, BASEPATH_TRPC } from "@vibefire/api/basepaths";
import { restRouter } from "@vibefire/api/rest";
import { createContext, trpcRouter } from "@vibefire/api/trpc";

type Bindings = {
  CF_ACCOUNT_ID: string;
  CF_IMAGES_API_KEY: string;
  CLERK_PEM: string;
  CLERK_SECRET_KEY: string;
  FAUNA_ROLE_KEY: string;
  SUPABASE_SECRET: string;
  GOOGLE_MAPS_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(timing());

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
          FAUNA_ROLE_KEY: c.env.FAUNA_ROLE_KEY,

          CLERK_PEM_STRING: c.env.CLERK_PEM_STRING,
          CLERK_SECRET_KEY: c.env.CLERK_SECRET_KEY,
          CLERK_PUBLISHABLE_KEY: c.env.CLERK_PUBLISHABLE_KEY,

          GOOGLE_MAPS_API_KEY: c.env.GOOGLE_MAPS_API_KEY,

          CF_ACCOUNT_ID: c.env.CF_ACCOUNT_ID,
          CF_IMAGES_API_KEY: c.env.CF_IMAGES_API_KEY,
        },
      }),
  }),
);

app.route(BASEPATH_REST, restRouter);

export default app;
