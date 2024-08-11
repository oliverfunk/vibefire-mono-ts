import { fql, type Client, type Page } from "fauna";

import {
  ModelVibefirePlan,
  type AccessAction,
  type TModelPlanItem,
  type TModelVibefirePlan,
} from "@vibefire/models";
import { tbClean, type PartialDeep } from "@vibefire/utils";

import { type FaunaFunctions } from "!services/fauna/functions";
import {
  accessActionQuery,
  faunaNullableQuery,
  faunaQuery,
} from "!services/fauna/utils";

export class FaunaPlansRepository {
  constructor(
    private readonly faunaClient: Client,
    private readonly funcs: FaunaFunctions,
  ) {}

  create(plan: TModelVibefirePlan, accAct: AccessAction) {
    return faunaQuery<{ id: string }>(
      this.faunaClient,
      fql`
        let acc = ${accessActionQuery(accAct)}
        let d = ${plan}
        d["accessRef"] = acc
        Plan.create(d) {
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
    planItem: TModelPlanItem,
    p: { linkPlanToEventPartOfAndMergeAccess: boolean } = {
      linkPlanToEventPartOfAndMergeAccess: false,
    },
  ) {
    return faunaQuery<boolean>(
      this.faunaClient,
      fql`
        let plan = ${this.withId(planId).query}
        plan?.update({
          items: plan?.items.append(${planItem}).distinct()
        })
        if (${p.linkPlanToEventPartOfAndMergeAccess}) {
          let event = ${this.withId(planItem.eventId).query}
          // works if the acc's are the same
          let newAcc = MergeAccess(event.accessRef, plan.accessRef)
          event?.update({
            partOf: ${planId},
            accessRef: newAcc
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
          items: plan?.items.filter((itm) => itm.eventId != ${eventId})
        })
        let event = ${this.withId(eventId).query}
        let eventAcc = event.accessRef
        if (event.partOf == ${planId}) {
          event?.update({
            partOf: null
            accessRef: Access.create({
              type: eventAcc.type,
            })
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
