import { fql, type Client, type Page } from "fauna";

import {
  type TModelVibefireEvent,
  type TModelVibefireEventNoId,
  type TModelVibefireOwnership,
} from "@vibefire/models";
import { type PartialDeep } from "@vibefire/utils";

import { type FaunaFunctions } from "!services/fauna/functions";
import { faunaNullableQuery, faunaQuery } from "!services/fauna/utils";

export class FaunaEventRepository {
  constructor(
    private readonly faunaClient: Client,
    private readonly funcs: FaunaFunctions,
  ) {}

  create(event: TModelVibefireEventNoId) {
    return faunaQuery<{ id: string }>(
      this.faunaClient,
      fql`
        let d = ${event}
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
    return this.funcs.entityIfUserCanManage<TModelVibefireEvent>(
      eventId,
      "event",
      userAid,
    );
  }

  withIdIfUserCanView(eventId: string, userAid?: string) {
    return this.funcs.entityIfUserCanView<TModelVibefireEvent>(
      eventId,
      "event",
      userAid,
    );
  }

  withIdIfUserCanViewWithShareCode(eventId: string, shareCode: string) {
    return this.funcs.entityIfUserCanViewWithShareCode<TModelVibefireEvent>(
      eventId,
      "event",
      shareCode,
    );
  }

  allUserManagerOf(userAid: string, limit = 0) {
    return faunaQuery<Page<TModelVibefireEvent>>(
      this.faunaClient,
      fql`
        let q = ${this.funcs.entitiesUserIsManagerOf<TModelVibefireEvent>("event", userAid).query}
        if (${limit} != 0) {
          q.pageSize(${limit})
        } else {
          q
        }
      `,
    );
  }

  allUserMemberOf(userAid: string, limit = 0) {
    return faunaQuery<Page<TModelVibefireEvent>>(
      this.faunaClient,
      fql`
        let q = ${this.funcs.entitiesUserIsMemberOf<TModelVibefireEvent>("event", userAid).query}
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
    ownerType: TModelVibefireOwnership["ownerType"],
    limit = 0,
  ) {
    return faunaQuery<Page<TModelVibefireEvent>>(
      this.faunaClient,
      fql`
        let ownerOwnership = ${this.funcs.ownershipByOwnerIdAndType(ownerId, ownerType).query}
        let q = Event.byOwner(ownerOwnership)
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
    ownerType: TModelVibefireOwnership["ownerType"],
    state: TModelVibefireEvent["state"],
    limit = 0,
  ) {
    return faunaQuery<Page<TModelVibefireEvent>>(
      this.faunaClient,
      fql`
        let q = {${this.allByOwner(ownerId, ownerType).query}.where(.state == ${state})}
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
        let event = ${this.withId(eventId).query}
        event?.update(${data})
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
    );
  }
}
