import { fql, type Client } from "fauna";
import type { PartialDeep } from "type-fest";

import type { VibefireEventLocationT, VibefireEventT } from "@vibefire/models";
import { type PartialDeepExceptRequired } from "@vibefire/utils";

import { CreateCollectionIfDne, dfq } from "../utils";

export const defineEventsCollection = async (faunaClient: Client) => {
  await dfq(faunaClient, CreateCollectionIfDne("Events"));
};

export const defineGeoTemporalIndex = async (faunaClient: Client) => {
  const locField: keyof VibefireEventT = "location";
  const h3pField: keyof VibefireEventLocationT = "h3Parents";
  const locH3Field = `${locField}.${h3pField}`;
  const dtpField: keyof VibefireEventT = "displayTimePeriods";
  const visField: keyof VibefireEventT = "visibility";
  const pubField: keyof VibefireEventT = "published";
  const rankField: keyof VibefireEventT = "rank";

  const q = fql`
    Events.definition.update({
      indexes: {
        geoTemporal: {
          terms: [
            {
              field: ${locH3Field},
              mva: true
            },
            {
              field: ${dtpField},
              mva: true
            },
            {
              field: ${visField},
            },
            {
              field: ${pubField}
            }
          ],
          values: [
            {
              field: ${rankField},
              order: "desc"
            }
          ],
        },
      }
    })
  `;
  await dfq(faunaClient, q);
};

export const defineByOrganiserIDIndex = async (faunaClient: Client) => {
  const organiserIdField: keyof VibefireEventT = "organiserId";
  const q = fql`
    Events.definition.update({
      indexes: {
        byOrganiserID: {
          terms: [
            {
              field: ${organiserIdField},
            }
          ],
        },
      }
    })
  `;
  await dfq(faunaClient, q);
};

export const createEvent = async (
  faunaClient: Client,
  createData: Partial<VibefireEventT>,
) => {
  const q = fql`
    Events.create(${createData}) {
        id
    }
  `;
  return await dfq<{ id: string }>(faunaClient, q);
};

export const updateEvent = async (
  faunaClient: Client,
  updateData: PartialDeepExceptRequired<VibefireEventT, "id" | "organiserId">,
) => {
  const eventId = updateData.id;
  const organiserId = updateData.organiserId;

  const newUpdateData: PartialDeep<VibefireEventT> = { ...updateData };
  delete newUpdateData.id;
  delete newUpdateData.organiserId;

  const q = fql`
    let e = Events.byId(${eventId})
    if (e?.organiserId == ${organiserId}) {
      e?.update(${newUpdateData}){
        id
      }
    } else {
      null
    }
  `;

  const res = await dfq<{ id: string } | null>(faunaClient, q);
  if (res === null) {
    throw new Error("Error updating event");
  }
  return res;
};

export const getPublishedEventFromID = async (
  faunaClient: Client,
  eventId: string,
) => {
  // this method is somewhat insecure because it would allow anyone to get the event
  // even if it's invite-only
  const _stateField: keyof VibefireEventT = "state";
  const _publishedField: keyof VibefireEventT = "published";
  const q = fql`
    let e = Events.byId(${eventId})
    if (e?.state == "ready" && e?.published == true) {
      e
    } else {
      null
    }
  `;
  return await dfq<Partial<VibefireEventT> | null>(faunaClient, q);
};

export const getEventFromIDByOrganiser = async (
  faunaClient: Client,
  eventId: string,
  organiserId: string,
) => {
  const _organiserField: keyof VibefireEventT = "organiserId";
  const q = fql`
    let e = Events.byId(${eventId})
    if (e?.organiserId == ${organiserId}) {
      e
    } else {
      null
    }
  `;
  return await dfq<Partial<VibefireEventT> | null>(faunaClient, q);
};

export const getEventsByOrganiser = async (
  faunaClient: Client,
  organiserId: string,
) => {
  const _organiserField: keyof VibefireEventT = "organiserId";
  const q = fql`
    Events.byOrganiserID(${organiserId})
  `;
  return (await dfq<{ data: PartialDeep<VibefireEventT>[] }>(faunaClient, q))
    .data;
};
