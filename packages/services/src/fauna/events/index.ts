import { fql, type Client, type Page } from "fauna";
import { type PartialDeep } from "type-fest";

import {
  ModelVibefireEvent,
  newVibefireEventModel,
  type TModelEventType,
  type TModelVibefireEvent,
} from "@vibefire/models";
import { tbClean } from "@vibefire/utils";

import { faunaNullableQuery, faunaQuery } from "!services/fauna/utils";

export class FaunaEventsRepository {
  constructor(private readonly faunaClient: Client) {}

  create(
    type: TModelEventType["type"],
    publicVis: TModelEventType["public"],
    ownerId: TModelVibefireEvent["ownerId"],
    ownerName: TModelVibefireEvent["ownerName"],
    ownerType: TModelVibefireEvent["ownerType"],
    title: TModelVibefireEvent["title"],
    epochCreated: TModelVibefireEvent["epochCreated"],
  ) {
    const d = newVibefireEventModel({
      type,
      public: publicVis,
      ownerId,
      ownerName,
      ownerType,
      title,
      epochCreated,
      epochLastUpdated: epochCreated,
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
    return faunaNullableQuery<TModelVibefireEvent>(
      this.faunaClient,
      fql`
        Events.byId(${eventId})
      `,
    );
  }

  allByOwner(ownerId: string, limit = 0) {
    return faunaQuery<Page<TModelVibefireEvent>>(
      this.faunaClient,
      fql`
        let r = Events.byOwnerId(${ownerId})
        if (${limit} != 0) {
          r.pageSize(${limit})
        } else {
          r
        }
      `,
    );
  }

  allByOwnerByState(
    ownerId: string,
    state: TModelVibefireEvent["state"],
    limit = 0,
  ) {
    return faunaQuery<TModelVibefireEvent[]>(
      this.faunaClient,
      fql`
        let r = ${this.allByOwner(ownerId).query}
          .where(.state == ${state})
        if (${limit} != 0) {
          r.pageSize(${limit})
        } else {
          r
        }
      `,
    );
  }

  allByOwnerByStates(
    ownerId: string,
    states: TModelVibefireEvent["state"][],
    limit = 0,
  ) {
    return faunaQuery<Page<TModelVibefireEvent>>(
      this.faunaClient,
      fql`
        let states = ${states}.toSet()
        let r = states.flatMap((state) => {
          ${this.allByOwner(ownerId).query}.where(.state == state)
        })
        if (${limit} != 0) {
          r.pageSize(${limit})
        } else {
          r
        }
      `,
    );
  }

  allByPlanByState(
    planId: string,
    state: TModelVibefireEvent["state"],
    limit = 0,
  ) {
    return faunaQuery<TModelVibefireEvent[]>(
      this.faunaClient,
      fql`
        let r = Events.byPlanId(${planId})
          .where(.state == ${state})
        if (${limit} != 0) {
          r.pageSize(${limit})
        }
      `,
    );
  }

  update(eventId: string, data: PartialDeep<TModelVibefireEvent>) {
    return faunaQuery<boolean>(
      this.faunaClient,
      fql`
        let data = ${data}
        let event = ${this.getById(eventId).query}
        event?.update(data)
      `,
    );
  }

  page(hash: string) {
    // This doesn't fit into the model of separating each collection
    // into its own repository.
    // Maybe there will be some way to associate the hash with user aid
    // in the future, but I'm not sure how
    return faunaQuery<Page<TModelVibefireEvent>>(
      this.faunaClient,
      fql`
        Set.paginate(${hash})
      `,
      {
        collectionName: "Events",
        postProcess: (d) => {
          const data = tbClean(ModelVibefireEvent, d.data);
          return { ...d, data };
        },
      },
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
