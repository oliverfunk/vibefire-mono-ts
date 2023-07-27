import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";

import { BASEPATH_TRPC, BASEPATH_WEBHOOKS } from "@vibefire/api/basepaths";
import { apiRouter, createContext } from "@vibefire/api/trpc";
import { webhooksRouter } from "@vibefire/api/webhooks";

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
  CLERK_PEM: string;
  FAUNA_SECRET: string;
  SUPABASE_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

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
        faunaClientKey: c.env.FAUNA_SECRET,
        supabaseClientKey: c.env.SUPABASE_SECRET,
      }),
  });
  return trpcHandler(c, next);
});

app.all("/rest/*", (c) => c.text("hello"));

app.route(`${BASEPATH_WEBHOOKS}`, webhooksRouter);

export default app;
