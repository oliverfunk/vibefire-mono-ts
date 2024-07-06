import { fql, type Client, type Page } from "fauna";
import { type PartialDeep } from "type-fest";

import { ModelVibefirePlan, type TModelVibefirePlan } from "@vibefire/models";
import { tbClean } from "@vibefire/utils";

import { faunaNullableQuery, faunaQuery } from "!services/fauna/utils";

export class FaunaPlansRepository {
  constructor(private readonly faunaClient: Client) {}

  create() {}

  getById(planId: string) {
    return faunaNullableQuery<TModelVibefirePlan>(
      this.faunaClient,
      fql`
        Plans.byId(${planId})
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

  page(hash: string) {
    return faunaQuery<Page<TModelVibefirePlan>>(
      this.faunaClient,
      fql`
        Set.paginate(${hash})
      `,
      {
        collectionName: "Plans",
        postProcess: (d) => {
          const data = tbClean(ModelVibefirePlan, d.data);
          return { ...d, data };
        },
      },
    );
  }
}
