import { fql, type Client } from "fauna";
import type { PartialDeep } from "type-fest";

import { CreateCollectionIfDne, dfq } from "../utils";

export const createEvent = async (
  faunaClient: Client,
  createData: PartialDeep<VibefireEventT>,
) => {
  const _linkIdField: keyof VibefireEventT = "linkId";
  const q = fql`
    Events.create(${createData}) {
      id,
      linkId
    }
  `;
  return await dfq<{ id: string; linkId: string }>(faunaClient, q);
};

export const updateEvent = async (
  faunaClient: Client,
  eventId: string,
  organiserId: string,
  updateData: PartialDeep<VibefireEventT>,
) => {
  delete updateData.id;
  delete updateData.organiserId;

  const q = fql`
    let e = Events.byId(${eventId})
    if (e?.organiserId == ${organiserId}) {
      e?.update(${updateData})
    } else {
      null
    }
  `;

  const res = await dfq<PartialDeep<VibefireEventT> | null>(faunaClient, q);
  if (res === null) {
    throw new Error("Error updating event");
  }
  return res;
};

export const deleteEvent = async (
  faunaClient: Client,
  eventId: string,
  organiserId: string,
) => {
  const q = fql`
    let e = Events.byId(${eventId})
    if (e?.organiserId == ${organiserId}) {
      e!.delete()
    } else {
      null
    }
  `;
  return await dfq<{ id: string }>(faunaClient, q);
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

export const getEventFromLinkIdByOrganiser = async (
  faunaClient: Client,
  linkId: string,
  organiserId: string,
) => {
  const _organiserField: keyof VibefireEventT = "organiserId";
  const q = fql`
    let e = Events.byLinkID(${linkId}).first()
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
      .where(.state == "ready" || .state == "draft")
      .paginate(30)
  `;
  return (await dfq<{ data: PartialDeep<VibefireEventT>[] }>(faunaClient, q))
    .data;
};
