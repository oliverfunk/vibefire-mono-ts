import { DateTime } from "luxon";

import {
  newVibefireEntityAccess,
  newVibefireGroup,
  type AccessAction,
  type Pageable,
  type TModelVibefireEntityAccess,
  type TModelVibefireGroup,
} from "@vibefire/models";
import {
  resourceLocator,
  trimAndCropText,
  type PartialDeep,
} from "@vibefire/utils";

import { ManagerRuleViolation } from "!managers/errors";
import { type ManagerAsyncResult } from "!managers/manager-result";
import { getReposManager, ReposManager } from "!managers/repos-manager";
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
    accessType: TModelVibefireEntityAccess["type"];
    forOrgId?: string;
  }) {
    return managerReturn(async () => {
      const forOrg = !!p.forOrgId;
      let accAct: AccessAction | undefined = undefined;

      // if (forOrg) {
      //   const org = (
      //     await this.repos.org.withIdIfUserCanManage(p.forOrgId, p.userAid)
      //       .result
      //   ).unwrap();
      //   accAct = { action: "link", accessId: org.accessRef.id };
      // }

      if (!accAct) {
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
        accAct = {
          action: "create",
          access: newVibefireEntityAccess({ type: "invite" }), // default
          userId: p.userAid,
        };
      }

      const name = trimAndCropText(p.name, 100);
      const description = trimAndCropText(p.description, 500);

      const g = newVibefireGroup({
        ownerId: p.forOrgId ?? p.userAid,
        ownerType: forOrg ? "org" : "user",
        linkEnabled: true,
        linkId: crypto.randomUUID(),
        name,
        description,
        epochCreated: DateTime.utc().toMillis(),
      });
      const { id } = await this.repos.group.create(g, accAct).result;

      return id;
    });
  }

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
