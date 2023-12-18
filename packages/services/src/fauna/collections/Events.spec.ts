import { Client } from "fauna";

import { createUDFFilterEventIsPublishedAndViewable, defineByLinkID } from "..";

const faunaClient = new Client({
  secret: "fnAFMx9AKBAAzoUj1BsK4dUlZsPlDftHmb99XXfA",
});

test("setting up events", async () => {
  await defineByLinkID(faunaClient);
});
