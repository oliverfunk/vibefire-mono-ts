import { Client } from "fauna";

import {
  createUDFEventPublishedByIdForExternalUser,
  createUDFEventsInAreasDuringPeriodForUser,
  createUDFEventsUpcomingForUser,
  defineBetweenLatLngIndex,
} from "..";

const faunaClient = new Client({
  secret: "***REMOVED***",
});

test("setting up events", async () => {
  await defineBetweenLatLngIndex(faunaClient);
});
