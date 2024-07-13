import { fql, type Client, type Page } from "fauna";
import { type PartialDeep } from "type-fest";

import {
  ModelVibefirePlan,
  type TModelVibefireEvent,
  type TModelVibefirePlan,
} from "@vibefire/models";
import { tbClean } from "@vibefire/utils";

import { faunaNullableQuery, faunaQuery } from "!services/fauna/utils";

export class FaunaPlansRepository {
  constructor(private readonly faunaClient: Client) {}

  create(plan: TModelVibefirePlan) {
    return faunaQuery<{ id: string }>(
      this.faunaClient,
      fql`
        Plans.create(${plan}) {
          id
        }
      `,
    );
  }

  getById(planId: string) {
    return faunaNullableQuery<TModelVibefirePlan>(
      this.faunaClient,
      fql`
        Plans.byId(${planId})
      `,
    );
  }

  getPlanEvents(planId: string, limit = 10) {
    return faunaNullableQuery<TModelVibefireEvent[]>(
      this.faunaClient,
      fql`
        let p = ${this.getById(planId).query}
        let r = p?.eventIds?.toSet().map((planEventId) => Events.byId(planEventId))
        if (${limit} != 0) {
          r.take(${limit})
        } else {
          r
        }
      `,
    );
  }

  allByOwner(ownerId: string, limit = 0) {
    return faunaQuery<Page<TModelVibefirePlan>>(
      this.faunaClient,
      fql`
        let r = Plans.byOwnerId(${ownerId})
        if (${limit} != 0) {
          r.pageSize(${limit})
        } else {
          r
        }
      `,
    );
  }

  update(eventId: string, data: PartialDeep<TModelVibefirePlan>) {
    return faunaQuery<boolean>(
      this.faunaClient,
      fql`
        let data = ${data}
        let plan = ${this.getById(eventId).query}
        plan?.update(data)
      `,
    );
  }

  linkEvent(planId: string, eventId: string) {
    return faunaQuery<boolean>(
      this.faunaClient,
      fql`
        let plan = ${this.getById(planId).query}
        plan?.update({
          eventIds: plan?.eventIds.append(${eventId}).distinct()
        })
      `,
    );
  }

  unlinkEvent(planId: string, eventId: string) {
    return faunaQuery<boolean>(
      this.faunaClient,
      fql`
        let plan = ${this.getById(planId).query}
        plan?.update({
          eventIds: plan?.eventIds.filter((id) => id != ${eventId})
        })
      `,
    );
  }

  delete(planId: string) {
    return faunaQuery<boolean>(
      this.faunaClient,
      fql`
        let plan = ${this.getById(planId).query}
        plan?.delete()
      `,
    );
  }

  page(hash: string) {
    return faunaQuery<Page<TModelVibefirePlan>>(
      this.faunaClient,
      fql`
        Set.paginate(${hash})
      `,
      {
        postProcess: (d) => {
          const data = tbClean(ModelVibefirePlan, d.data);
          return { ...d, data };
        },
      },
    );
  }
}
