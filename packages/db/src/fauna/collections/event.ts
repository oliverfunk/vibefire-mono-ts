import { fql, type Client, type QuerySuccess } from "fauna";

import type { VibefireEvent } from "@vibefire/types";

import { CreateCollectionIfDne } from "../utils";

const cPublicEvents = "public_events";

const CreatePublicEventsCollection = CreateCollectionIfDne(cPublicEvents);

const AddPublicEvent = (event: VibefireEvent) => {
  return fql`
    ${cPublicEvents}.create(${event}) {
        id
    }
`;
};

export const doCreatePublicEventsCollection = (faunaClient: Client) => {
  return faunaClient.query(CreatePublicEventsCollection);
};

export const doAddPublicEvent = async (
  faunaClient: Client,
  event: VibefireEvent,
) => {
  const a: QuerySuccess<string> = await faunaClient.query(
    AddPublicEvent(event),
  );
  return a;
};
