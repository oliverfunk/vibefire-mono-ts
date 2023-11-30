import { Client } from "fauna";

import {
  createUDFEventPublishedByIdForExternalUser,
  createUDFEventsInAreasDuringPeriodForUser,
  createUDFEventsUpcomingForUser,
  defineBetweenLatLngIndex,
} from "..";

const faunaClient = new Client({
  secret: "fnAFMx9AKBAAzoUj1BsK4dUlZsPlDftHmb99XXfA",
});

test("setting up events", async () => {
  await defineBetweenLatLngIndex(faunaClient);
});
