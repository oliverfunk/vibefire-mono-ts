import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

import type { TRPCRouter } from ".";

describe("events uf manager", () => {
  let trpcClient: ReturnType<typeof createTRPCClient<TRPCRouter>>;

  beforeAll(() => {
    trpcClient = createTRPCClient<TRPCRouter>({
      links: [
        httpBatchLink({
          url: "http://localhost:8787/trpc",
          transformer: superjson,
          headers() {
            const authToken = "";
            return {
              Authorization: authToken,
            };
          },
        }),
      ],
    });
  });

  it("testing integ. test", async () => {
    const r = await trpcClient.events.viewPublished.query({ eventId: "123" });
    console.log(r);
  });
});
