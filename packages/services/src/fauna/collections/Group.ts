import { fql, type Client, type Page } from "fauna";

import {
  type TModelVibefireAccess,
  type TModelVibefireGroup,
} from "@vibefire/models";

import { type FaunaFunctions } from "!services/fauna//functions";
import { faunaNullableQuery, faunaQuery } from "!services/fauna/utils";

export class FaunaGroupRepository {
  constructor(
    private readonly faunaClient: Client,
    private readonly funcs: FaunaFunctions,
  ) {}

  create(group: TModelVibefireGroup) {
    return faunaQuery<{ id: string }>(
      this.faunaClient,
      fql`
        let d = ${group}
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
    return this.funcs.entityIfUserCanManage<TModelVibefireGroup>(
      groupId,
      "group",
      userAid,
    );
  }

  withIdIfUserCanView(groupId: string, userAid?: string) {
    return this.funcs.entityIfUserCanView<TModelVibefireGroup>(
      groupId,
      "group",
      userAid,
    );
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
    accessType: TModelVibefireAccess["type"],
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
        let q = ${this.funcs.entitiesUserIsPart("group", userAid).query}
        if (${limit} != 0) {
          q.pageSize(${limit})
        } else {
          q
        }
      `,
    );
  }
}
