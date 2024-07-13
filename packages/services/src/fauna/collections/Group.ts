import { fql, type Client } from "fauna";

import { type TModelVibefireGroup } from "@vibefire/models";

import { type FaunaFunctions } from "!services/fauna//functions";
import { faunaNullableQuery } from "!services/fauna/utils";

export class FaunaGroupsRepository {
  constructor(
    private readonly faunaClient: Client,
    private readonly funcs: FaunaFunctions,
  ) {}

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

  membershipOf(groupId: string, userAid: string) {
    return this.funcs.userGroupMembership(groupId, userAid);
  }

  allMembersOf(groupId: string) {
    return this.funcs.groupMemberships(groupId);
  }

  allBelongsTo(userAid: string) {
    return this.funcs.userMemberships(userAid);
  }

  // async allUserIsManager(userAid: string) {
  //   const memsRes = await this.funcs.userMemberships(userAid).result;
  //   return memsRes.map((mems) => mems.filter((mem) => mem.role === "manager"));
  // }

  // async allUserIsMember(userAid: string) {}
}
