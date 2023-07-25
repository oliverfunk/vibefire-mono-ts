import { trpcServer } from "@hono/trpc-server"; // Deno 'npm:@hono/trpc-server'
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";

// import { error, json, Router } from "itty-router";

import { BASEPATH_TRPC } from "@vibefire/api/basepaths";
import { appRouter, createContext } from "@vibefire/api/trpc";

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
// export interface Env {
//   FAUNA_SECRET: string;
//   SUPABASE_SECRET: string;
//   // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
//   // MY_KV_NAMESPACE: KVNamespace;
//   //
//   // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
//   // MY_DURABLE_OBJECT: DurableObjectNamespace;
//   //
//   // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
//   // MY_BUCKET: R2Bucket;
//   //
//   // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
//   // MY_SERVICE: Fetcher;
//   //
//   // Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
//   // MY_QUEUE: Queue;
// }

type Bindings = {
  FAUNA_SECRET: string;
  SUPABASE_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.all(`${BASEPATH_TRPC}/*`, (c, next) => {
  const trpcHandler = trpcServer({
    router: appRouter,
    onError({ error }) {
      console.error(error);
    },
    createContext: (opts) =>
      createContext({
        ...opts,
        faunaClientKey: c.env.FAUNA_SECRET,
        supabaseClientKey: c.env.SUPABASE_SECRET,
      }),
  });
  return trpcHandler(c, next);
});

app.all("/rest/*", (c) => c.text("hello"));

app.post("/webhooks/*", async (c) => {
  const r = await c.req.json();
  console.log("webhook", JSON.stringify(r, null, 2));
  return c.json({ status: "success" });
});

export default app;
