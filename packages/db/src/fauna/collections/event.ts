import { fql, type Client, type QuerySuccess } from "fauna";

import type { VibefireEvent, VibefireLocEvent } from "@vibefire/models";

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
  timePeriodIndex: string,
  areaH3s: number[],
) => {
  const q = fql`queryPublicEventsAtPeriodInAreas(${timePeriodIndex}, ${areaH3s})`;
  const res = await faunaClient.query<{ data: any[] }>(q);
  console.log("res", res);
  return res.data;
};
