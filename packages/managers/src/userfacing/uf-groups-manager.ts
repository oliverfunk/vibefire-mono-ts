import { DateTime } from "luxon";

import {
  newVibefireGroup,
  type Pageable,
  type TModelVibefireAccess,
  type TModelVibefireGroup,
  type TModelVibefireOwnership,
} from "@vibefire/models";
import {
  resourceLocator,
  trimAndCropText,
  type PartialDeep,
} from "@vibefire/utils";

import { ManagerRuleViolation } from "!managers/errors";
import { type ManagerAsyncResult } from "!managers/manager-result";
import { getReposManager, type ReposManager } from "!managers/repos-manager";
import { managerReturn } from "!managers/utils";

export const ufGroupsManagerSymbol = Symbol("ufGroupsManagerSymbol");
export const getUFGroupsManager = () =>
  resourceLocator().bindResource(ufGroupsManagerSymbol, () => {
    return new UFGroupsManger(getReposManager());
  });

export class UFGroupsManger {
  constructor(private readonly repos: ReposManager) {}

  createNewGroup(p: {
    userAid: string;
    name: string;
    description: string;
    accessType: TModelVibefireAccess["type"];
    forOrgId?: string;
  }) {
    return managerReturn(async () => {
      const forOrg = !!p.forOrgId;

      // if (forOrg) {
      //   const org = (
      //     await this.repos.org.withIdIfUserCanManage(p.forOrgId, p.userAid)
      //       .result
      //   ).unwrap();
      //   accAct = { action: "link", accessId: org.accessRef.id };
      // }
      let accessRef: TModelVibefireAccess;
      let ownerRef: TModelVibefireOwnership;
      // if (forOrg) {
      // }
      // check if the user already owns a public group
      // can only make one
      const userOwnedPublicGroups =
        await this.repos.group.allUserOwnedWithAccessType(p.userAid, "public")
          .result;
      if (userOwnedPublicGroups.length > 0) {
        throw new ManagerRuleViolation(
          "You can only own one public group at a time",
        );
      }
      const u = (await this.repos.getUserProfile(p.userAid)).unwrap();
      // eslint-disable-next-line prefer-const
      accessRef = (
        await this.repos.access.createAccess(p.accessType, p.userAid).result
      ).unwrap();
      // eslint-disable-next-line prefer-const
      ownerRef = u.ownershipRef;

      const ownershipRef = await this.repos.access.createOwnership(
        "group",
        p.name,
      ).result;

      const name = trimAndCropText(p.name, 100);
      const description = trimAndCropText(p.description, 500);

      const g = newVibefireGroup({
        ownershipRef,
        accessRef,
        ownerRef,
        name,
        description,
        epochCreated: DateTime.utc().toMillis(),
      });
      const { id } = await this.repos.group.create(g).result;

      return id;
    });
  }

  // createNewGroupFromEvent(p: {

  groupsUserIsPart(p: {
    userAid: string;
  }): ManagerAsyncResult<Pageable<PartialDeep<TModelVibefireGroup>>> {
    return managerReturn<Pageable<TModelVibefireGroup>>(async () => {
      const { data, after: afterKey } = await this.repos.group.allUserIsPart(
        p.userAid,
        10,
      ).result;
      return {
        data,
        afterKey,
        limit: 10,
      };
    });
  }
}
