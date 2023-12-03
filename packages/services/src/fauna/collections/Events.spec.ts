import { Client } from "fauna";

import { createUDFFilterEventIsPublishedAndViewable } from "..";

const faunaClient = new Client({
  secret: "***REMOVED***",
});

test("setting up events", async () => {
  await createUDFFilterEventIsPublishedAndViewable(faunaClient);
});
