import { fql, type Client, type Page } from "fauna";

import {
  ModelVibefirePlan,
  tbClean,
  type TModelPlanItem,
  type TModelVibefirePlan,
} from "@vibefire/models";
import { type PartialDeep } from "@vibefire/utils";

import { type FaunaFunctions } from "!services/fauna/functions";
import { faunaNullableQuery, faunaQuery } from "!services/fauna/utils";

export class FaunaPlanRepository {
  constructor(
    private readonly faunaClient: Client,
    private readonly funcs: FaunaFunctions,
  ) {}

  create(plan: TModelVibefirePlan) {
    return faunaQuery<{ id: string }>(
      this.faunaClient,
      fql`
        let d = ${plan}
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
    return this.funcs.entityIfUserCanManage<TModelVibefirePlan>(
      planId,
      "plan",
      userAid,
    );
  }

  withIdIfUserCanView(planId: string, userAid?: string) {
    return this.funcs.entityIfUserCanView<TModelVibefirePlan>(
      planId,
      "plan",
      userAid,
    );
  }

  // allUserIsPart(userAid: string, limit = 0) {
  //   return faunaQuery<Page<TModelVibefirePlan>>(
  //     this.faunaClient,
  //     fql`
  //       let q = ${this.funcs.plansUserIsPart(userAid).query}
  //       if (${limit} != 0) {
  //         q.pageSize(${limit})
  //       } else {
  //         q
  //       }
  //     `,
  //   );
  // }

  // allItemsUserCanManage(planId: string, userAid: string) {
  //   return this.funcs.planItemsUserCanManage(planId, userAid);
  // }

  // allItemsUserCanView(planId: string, userAid?: string) {
  //   return this.funcs.planItemsUserCanView(planId, userAid);
  // }

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
    p: { linkPlanToEventPartOfAndMergeAccess: boolean; userId: string } = {
      linkPlanToEventPartOfAndMergeAccess: false,
      userId: "",
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
          // nop if acc's are same
          let newAcc = MergeAccess(event.accessRef, plan.accessRef, ${p.userId})
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
