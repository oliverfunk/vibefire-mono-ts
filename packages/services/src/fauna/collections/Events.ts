/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { fql, Query, type Client, type QuerySuccess } from "fauna";

import type { VibefireEventLocationT, VibefireEventT } from "@vibefire/models";
import { WithPartial } from "@vibefire/utils";

import { CreateCollectionIfDne, dfq } from "../utils";

export const defineEventsCollection = async (faunaClient: Client) =>
  await dfq(faunaClient, CreateCollectionIfDne("Events"));

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
  return await dfq<string>(faunaClient, q);
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
  return await dfq<string>(faunaClient, q);
};

export const updateEvent = async (
  faunaClient: Client,
  eventId: string,
  updateData: WithPartial<VibefireEventT>,
  organId: string,
): Promise<unknown> => {
  const _organiserField: keyof VibefireEventT = "organiserId";
  const _typeField: keyof VibefireEventT = "type";
  const _userType: VibefireEventT["type"] = "user";
  const q = fql`
    let e = Events.byId(${eventId})
    if (e == null) {
      null
    }
    let isUserEvent = e.type == ${_userType}
    if (isUserEvent){
      if (e.organiserId == ${byUserId}) {
        e.update(${updateData})
      }
    } else {
      let org = Organisations.byId(e.organiserId)
      if (org == null) {
        null
      }
      if (org.admins.contains(${byUserId}) && e.organiserId == ${forOrganisationId}) {
        e.update(${updateData})
      }
    }
    null
  `;
  return await dfq<any>(faunaClient, q);
};

export const getPublishedPublicEventFromID = async (
  faunaClient: Client,
  id: string,
) => {
  const q = fql`
    let e = Events.byId(${id})
    if (e.visibility == "public" && e.published == true) {
      e
    }
    null
  `;
  return await dfq<any>(faunaClient, q);
};

export const getOrganisationEventFromID = async (
  faunaClient: Client,
  orgId: string,
  eventId: string,
) => {
  // todo: wip
  const q = fql`
    let e = Events.byId(${eventId})
    if (e.organisationId == ${orgId}}) {
      e
    }
    null
  `;
  return await dfq<any>(faunaClient, q);
};
