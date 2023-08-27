/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { fql, type Client } from "fauna";

import type { VibefireEventManagementT } from "@vibefire/models";

import { CreateCollectionIfDne, dfq } from "../utils";

export const defineEventsManagementCollection = async (faunaClient: Client) => {
  await dfq(faunaClient, CreateCollectionIfDne("EventsManagement"));
};

export const defineEventsManagementFromEventIdIndex = async (
  faunaClient: Client,
) => {
  const eventIdField: keyof VibefireEventManagementT = "eventId";
  const q = fql`
    EventsManagement.definition.update({
      indexes: {
        fromEventId: {
          terms: [{ field: ${eventIdField}}],
        }
      }
    })
  `;
  await dfq(faunaClient, q);
};

export const defineEventsManagementEventIdUniqueConstraint = async (
  faunaClient: Client,
) => {
  const eventIdField: keyof VibefireEventManagementT = "eventId";
  const q = fql`
    EventsManagement.definition.update({
      constraints: [
        { unique: [ ${eventIdField} ] }
      ]
    })
  `;
  await dfq(faunaClient, q);
};

export const createEventManagement = async (
  faunaClient: Client,
  createData: Partial<VibefireEventManagementT>,
) => {
  const q = fql`
    EventsManagement.create(${createData}) {
      id
    }
  `;
  return await dfq<string>(faunaClient, q);
};

export const getEventManagementByID = async (
  faunaClient: Client,
  createData: Partial<VibefireEventManagementT>,
) => {
  const q = fql`
    EventsManagement.byId(${createData}) {
      id
    }
  `;
  return await dfq<string>(faunaClient, q);
};
