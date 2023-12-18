import { Client } from "fauna";

import { createUDFFilterEventIsPublishedAndViewable, defineByLinkID } from "..";

const faunaClient = new Client({
  secret: "***REMOVED***",
});

test("setting up events", async () => {
  await defineByLinkID(faunaClient);
});
