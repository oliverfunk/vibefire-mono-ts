import { fql, Query, type Client, type QuerySuccess } from "fauna";

import type { VibefireEventLocationT, VibefireEventT } from "@vibefire/models";

import { CreateCollectionIfDne, dfq } from "../utils";

export const createEventsCollection = async (faunaClient: Client) =>
  await dfq(faunaClient, CreateCollectionIfDne("Events"));

export const createGeoTemporalIndex = async (faunaClient: Client) => {
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

export const createPublicEvent = async (
  faunaClient: Client,
  event: VibefireEventT,
) => {
  // todo: use udf and validate if the event is public and the user if the owner of the org
  const q = fql`
    Events.create(${event}) {
        id
    }
  `;
  return await dfq<string>(faunaClient, q);
};
