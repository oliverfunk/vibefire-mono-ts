import { Client, fql } from "fauna";

import {
  newVibefireEventModel,
  TEventType,
  TVibefireEvent,
} from "@vibefire/models";

import { faunaQuery } from "!services/fauna/utils";

export class FaunaEventsRepository {
  constructor(private readonly faunaClient: Client) {}

  create(
    type: TEventType["type"],
    publicVis: TEventType["public"],
    ownerId: TVibefireEvent["ownerId"],
    ownerName: TVibefireEvent["ownerName"],
    ownerType: TVibefireEvent["ownerType"],
    title: TVibefireEvent["title"],
    createdEpoch: TVibefireEvent["timeCreatedEpoch"],
  ) {
    const d = newVibefireEventModel({
      type,
      public: publicVis,
      ownerId,
      ownerName,
      ownerType,
      title,
      timeCreatedEpoch: createdEpoch,
      timeUpdateEpoch: createdEpoch,
    });
    return faunaQuery<string>(
      this.faunaClient,
      fql`
        Events.create(${d}) {
          id
        }
      `,
    );
  }

  getById(eventId: string) {
    return faunaQuery<TVibefireEvent | null>(
      this.faunaClient,
      fql`
        Events.byId(${eventId})
      `,
    );
  }

  allByStateFor(
    userAid: string,
    state: TVibefireEvent["state"],
    ownerType: TVibefireEvent["ownerType"],
    limit = 6,
  ) {
    return faunaQuery<TVibefireEvent[]>(
      this.faunaClient,
      fql`
        Events.byOwnerId(${userAid})
          .where(.ownerType == ${ownerType})
          .where(.state == ${state})
          .paginate(${limit})
      `,
    );
  }

  // getEventsByUserBetween(userAid: string, start: string, end: string) {
  //   return faunaQuery<TVibefireEvent[]>(
  //     this.faunaClient,
  //     fql`
  //       Events.byOwnerId(${userAid})

  //     `,
  //   );
  // }

  // export const getEventsByOrganiser = async (
  //   faunaClient: Client,
  //   organiserId: string,
  // ) => {
  //   const _organiserField: keyof VibefireEventT = "organiserId";
  //   const q = fql`
  //     Events.byOrganiserID(${organiserId})
  //       .where(.state == "ready" || .state == "draft")
  //       .paginate(30)
  //   `;
  //   return (await dfq<{ data: PartialDeep<VibefireEventT>[] }>(faunaClient, q))
  //     .data;
  // };
}
