import { fql, type Client, type Page } from "fauna";

import {
  ModelVibefireEvent,
  tbClean,
  type AccessAction,
  type TModelVibefireEntityAccess,
  type TModelVibefireEvent,
  type TModelVibefireEventNoId,
} from "@vibefire/models";
import { type PartialDeep } from "@vibefire/utils";

import { type FaunaFunctions } from "!services/fauna/functions";
import {
  accessActionQuery,
  faunaNullableQuery,
  faunaQuery,
} from "!services/fauna/utils";

export class FaunaEventRepository {
  constructor(
    private readonly faunaClient: Client,
    private readonly funcs: FaunaFunctions,
  ) {}

  async create(event: TModelVibefireEventNoId, accAct: AccessAction) {
    const acc = await faunaQuery<TModelVibefireEntityAccess>(
      this.faunaClient,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      accessActionQuery(this.funcs, accAct),
    ).result;
    event.accessRef = acc;
    return faunaQuery<{ id: string }>(
      this.faunaClient,
      fql`
        // let acc = ${accessActionQuery(this.funcs, accAct)}
        let d = ${event}
        // d.accessRef = acc
        Event.create(d) {
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

  allUserIsPart(userAid: string, limit = 0) {
    return faunaQuery<Page<TModelVibefireEvent>>(
      this.faunaClient,
      fql`
        let q = ${this.funcs.eventsUserIsPart(userAid).query}
        if (${limit} != 0) {
          q.pageSize(${limit})
        } else {
          q
        }
      `,
    );
  }

  allByOwner(
    ownerId: string,
    ownerType: TModelVibefireEvent["eventOwnerType"],
    limit = 0,
  ) {
    return faunaQuery<Page<TModelVibefireEvent>>(
      this.faunaClient,
      fql`
        let q = Event.byOwnerWithType(${ownerId}, ${ownerType})
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
    ownerType: TModelVibefireEvent["eventOwnerType"],
    state: TModelVibefireEvent["state"],
    limit = 0,
  ) {
    return faunaQuery<Page<TModelVibefireEvent>>(
      this.faunaClient,
      fql`
        ${this.allByOwner(ownerId, ownerType).query}.where(.state == ${state})
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
    ownerType: TModelVibefireEvent["eventOwnerType"],
    states: TModelVibefireEvent["state"][],
    limit = 0,
  ) {
    return faunaQuery<Page<TModelVibefireEvent>>(
      this.faunaClient,
      fql`
        let states = ${states}.toSet()
        let q = states.flatMap((state) => {
          ${this.allByOwner(ownerId, ownerType).query}.where(.state == state)
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

  geoPeriodQueryForUser(
    minLat: number,
    minLon: number,
    maxLat: number,
    maxLon: number,
    datePeriod: number,
    userAid?: string,
  ) {
    return this.funcs.eventsGeoPeriodQuery(
      userAid ?? null,
      minLat,
      minLon,
      maxLat,
      maxLon,
      datePeriod,
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
