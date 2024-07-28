import { fql, type Client, type Page } from "fauna";

import { ModelVibefirePlan, type TModelVibefirePlan } from "@vibefire/models";
import { tbClean, type PartialDeep } from "@vibefire/utils";

import { type FaunaFunctions } from "!services/fauna/functions";
import { faunaNullableQuery, faunaQuery } from "!services/fauna/utils";

export class FaunaPlansRepository {
  constructor(
    private readonly faunaClient: Client,
    private readonly funcs: FaunaFunctions,
  ) {}

  create(plan: TModelVibefirePlan) {
    return faunaQuery<{ id: string }>(
      this.faunaClient,
      fql`
        Plan.create(${plan}) {
          id
        }
      `,
    );
  }

  withId(planId: string) {
    return faunaNullableQuery<TModelVibefirePlan>(
      this.faunaClient,
      fql`
        Plan.byId(${planId})
      `,
    );
  }

  withIdIfUserCanManage(planId: string, userAid: string) {
    return this.funcs.planIfUserCanManage(planId, userAid);
  }

  withIdIfUserCanView(planId: string, userAid?: string) {
    return this.funcs.planIfUserCanView(planId, userAid);
  }

  allEventsUserCanManage(planId: string, userAid: string) {
    return this.funcs.planItemsUserCanManage(planId, userAid);
  }

  allEventsUserCanView(planId: string, userAid?: string) {
    return this.funcs.planItemsUserCanView(planId, userAid);
  }

  allByOwner(ownerId: string, limit = 0) {
    return faunaQuery<Page<TModelVibefirePlan>>(
      this.faunaClient,
      fql`
        let r = Plan.byOwnerId(${ownerId})
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
        let plan = ${this.withId(eventId).query}
        plan?.update(data)
      `,
    );
  }

  linkEvent(
    planId: string,
    eventId: string,
    p: { linkPlanToEventPartOf: boolean } = { linkPlanToEventPartOf: false },
  ) {
    return faunaQuery<boolean>(
      this.faunaClient,
      fql`
        let plan = ${this.withId(planId).query}
        plan?.update({
          eventIds: plan?.eventIds.append(${eventId}).distinct()
        })
        if (${p.linkPlanToEventPartOf}) {
          let event = ${this.withId(eventId).query}
          event?.update({
            partOf: ${planId}
          })
        }
      `,
    );
  }

  unlinkEvent(planId: string, eventId: string) {
    return faunaQuery<boolean>(
      this.faunaClient,
      fql`
        let plan = ${this.withId(planId).query}
        plan?.update({
          eventIds: plan?.eventIds.filter((id) => id != ${eventId})
        })
        let event = ${this.withId(eventId).query}
        if (event.partOf == ${planId}) {
          event?.update({
            partOf: null
          })
        }
      `,
    );
  }

  delete(planId: string) {
    return faunaQuery<boolean>(
      this.faunaClient,
      fql`
        let plan = ${this.withId(planId).query}
        plan?.delete()
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
