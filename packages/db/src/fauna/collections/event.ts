import { fql, Query, type Client, type QuerySuccess } from "fauna";

import type { VibefireEvent } from "@vibefire/types";
import { VibefireLocEvent } from "@vibefire/types/src/vibefire_event";

import { CreateCollectionIfDne } from "../utils";

const cPublicEvents = "PublicEvents";

const CreatePublicEventsCollection = CreateCollectionIfDne(cPublicEvents);

export const doCreatePublicEventsCollection = (faunaClient: Client) => {
  return faunaClient.query(CreatePublicEventsCollection);
};

export const createPublicEvent = async (
  faunaClient: Client,
  event: VibefireEvent,
): Promise<QuerySuccess<string>> => {
  const q = fql`
    PublicEvents.create(${event}) {
      id
    }
  `;
  return faunaClient.query(q);
};

export const doAddPublicLocEvent = async (
  faunaClient: Client,
  locEvent: VibefireLocEvent,
): Promise<QuerySuccess<string>> => {
  const q = fql`
    PublicEvents.create(${locEvent}) {
        id
    }
  `;
  return faunaClient.query(q);
};

export const queryPublicEventsWhenWhere = async (
  faunaClient: Client,
  inp: { tp: string; h3p: number }[],
) => {
  const q = fql`
    queryPublicEventsWhenWhere(${inp})
  `;
  return faunaClient.query(q);
};
