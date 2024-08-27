import { fql, type Client, type Page } from "fauna";

import {
  type AccessAction,
  type TModelVibefireEntityAccess,
  type TModelVibefireGroup,
} from "@vibefire/models";

import { type FaunaFunctions } from "!services/fauna//functions";
import {
  accessActionQuery,
  faunaNullableQuery,
  faunaQuery,
} from "!services/fauna/utils";

export class FaunaGroupRepository {
  constructor(
    private readonly faunaClient: Client,
    private readonly funcs: FaunaFunctions,
  ) {}

  create(group: TModelVibefireGroup, accAct: AccessAction) {
    return faunaQuery<{ id: string }>(
      this.faunaClient,
      fql`
        let acc = ${accessActionQuery(this.funcs, accAct)}
        let d = ${group}
        d["accessRef"] = acc
        Group.create(d) {
          id
        }
      `,
    );
  }

  withId(groupId: string) {
    return faunaNullableQuery<TModelVibefireGroup>(
      this.faunaClient,
      fql`
        Group.byId(${groupId})
      `,
    );
  }

  withIdIfUserCanManage(groupId: string, userAid: string) {
    return this.funcs.groupIfUserCanManage(groupId, userAid);
  }

  withIdIfUserCanView(groupId: string, userAid: string) {
    return this.funcs.groupIfUserCanView(groupId, userAid);
  }

  // todo: not sure about pageing here

  allUserOwned(userAid: string) {
    return faunaQuery<TModelVibefireGroup[]>(
      this.faunaClient,
      fql`
        Group.byOwnerWithType(${userAid}, "user")
      `,
    );
  }

  allUserOwnedWithAccessType(
    userAid: string,
    accessType: TModelVibefireEntityAccess["type"],
  ) {
    return faunaQuery<TModelVibefireGroup[]>(
      this.faunaClient,
      fql`
        let userOwned = ${this.allUserOwned(userAid).query}
        userOwned.where(.accessRef.type == ${accessType})
      `,
    );
  }

  // allUserBelongsTo(userAid: string) {
  //   return this.funcs.userMemberships(userAid);
  // }

  // async allUserIsManager(userAid: string) {
  //   const memsRes = await this.funcs.userMemberships(userAid).result;
  //   return memsRes.map((mems) => mems.filter((mem) => mem.role === "manager"));
  // }

  // allUserIsPart(userAid: string) {
  //   return this.funcs.groupsUserIsPart(userAid);
  // }

  allUserIsPart(userAid: string, limit = 0) {
    return faunaQuery<Page<TModelVibefireGroup>>(
      this.faunaClient,
      fql`
        let q = ${this.funcs.groupsUserIsPart(userAid).query}
        if (${limit} != 0) {
          q.pageSize(${limit})
        } else {
          q
        }
      `,
    );
  }
}
