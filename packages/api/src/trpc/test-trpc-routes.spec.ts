import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

import { ApiResponse } from "!api/utils";

import type { TRPCRouter } from ".";

const expectRespToBeOk = <T>(res: ApiResponse<T>) => {
  if (!res.ok) {
    console.error(res.error);
  }
  expect(res.ok).toBe(true);
};

const expectRespToBeErr = <T>(res: ApiResponse<T>) => {
  if (res.ok) {
    console.error("expect err, got value:", JSON.stringify(res.value));
  }
  expect(res.ok).toBe(false);
};

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
    expectRespToBeOk(r);
  });
});
