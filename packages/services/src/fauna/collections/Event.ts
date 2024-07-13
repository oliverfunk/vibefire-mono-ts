import { fql, type Client, type Page } from "fauna";
import { type PartialDeep } from "type-fest";

import { ModelVibefireEvent, type TModelVibefireEvent } from "@vibefire/models";
import { tbClean } from "@vibefire/utils";

import { type FaunaFunctions } from "!services/fauna/functions";
import { faunaNullableQuery, faunaQuery } from "!services/fauna/utils";

export class FaunaEventsRepository {
  constructor(
    private readonly faunaClient: Client,
    private readonly funcs: FaunaFunctions,
  ) {}

  create(event: TModelVibefireEvent) {
    return faunaQuery<{ id: string }>(
      this.faunaClient,
      fql`
        Event.create(${event}) {
          id
        }
      `,
    );
  }

  withId(eventId: string) {
    return faunaNullableQuery<TModelVibefireEvent>(
      this.faunaClient,
      fql`
        Event.byId(${eventId})
      `,
    );
  }

  withIdIfUserCanManage(eventId: string, userAid: string) {
    return this.funcs.eventIfUserCanManage(eventId, userAid);
  }

  withIdIfUserCanView(eventId: string, userAid?: string) {
    return this.funcs.eventIfUserCanView(eventId, userAid);
  }

  withLinkIdIfUserCanView(linkId: string, userAid?: string) {
    return this.funcs.eventIfUserCanViewViaLink(linkId, userAid);
  }

  allByOwner(ownerId: string, limit = 0) {
    return faunaQuery<Page<TModelVibefireEvent>>(
      this.faunaClient,
      fql`
        let q = Event.byOwnerId(${ownerId})
        if (${limit} != 0) {
          q.pageSize(${limit})
        } else {
          q
        }
      `,
    );
  }

  allByOwnerByState(
    ownerId: string,
    state: TModelVibefireEvent["state"],
    limit = 0,
  ) {
    return faunaQuery<Page<TModelVibefireEvent>>(
      this.faunaClient,
      fql`
        ${this.allByOwner(ownerId).query}.where(.state == ${state})
        if (${limit} != 0) {
          q.pageSize(${limit})
        } else {
          q
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
        let q = states.flatMap((state) => {
          ${this.allByOwner(ownerId).query}.where(.state == state)
        })
        if (${limit} != 0) {
          q.pageSize(${limit})
        } else {
          q
        }
      `,
    );
  }

  update(eventId: string, data: PartialDeep<TModelVibefireEvent>) {
    return faunaQuery<PartialDeep<TModelVibefireEvent>>(
      this.faunaClient,
      fql`
        let data = ${data}
        let event = ${this.withId(eventId).query}
        event?.update(data)
      `,
    );
  }

  linkPartOf(eventId: string, partOf: string) {
    return faunaQuery<null>(
      this.faunaClient,
      fql`
        let event = ${this.withId(eventId).query}
        event?.update({
          partOf: ${partOf}
        })
      `,
    );
  }

  unlinkPartOfIfMatches(eventId: string, planId: string) {
    return faunaQuery<null>(
      this.faunaClient,
      fql`
        let event = ${this.withId(eventId).query}
        if (event.partOf == ${planId}) {
          event?.update({
            partOf: null
          })
        }
      `,
    );
  }

  unlinkAllPartOf(planId: string) {
    return faunaQuery<null>(
      this.faunaClient,
      fql`
        let events = Event.byPartOf(${planId})
        events.map((event) => {
          event.update({
            partOf: null
          })
        })
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
        postProcess: (d) => {
          const data = tbClean(ModelVibefireEvent, d.data);
          return { ...d, data };
        },
      },
    );
  }
}
