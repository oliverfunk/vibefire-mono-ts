import { DateTime } from "luxon";

import {
  newVibefireGroup,
  type TModelVibefireAccess,
  type TModelVibefireGroup,
} from "@vibefire/models";
import { resourceLocator, trimAndCropText } from "@vibefire/utils";

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
    accessType: TModelVibefireAccess["accessType"];
    forOrgId?: string;
  }) {
    return managerReturn(async () => {
      const forOrg = !!p.forOrgId;
      const groupIsPublicType = p.accessType === "public";

      if (!forOrg && groupIsPublicType) {
        // todo: check if the user is already an owner of a public group
      }

      const ownershipRef = await this.repos.access.createOwnership(
        "group",
        p.name,
      ).result;

      // let accessRef: TModelVibefireAccess;
      // if (forOrg) {
      // } else {
      //   const u = (await this.repos.getUserProfile(p.userAid)).unwrap();
      //   accessRef = (
      //     await this.repos.access.create(
      //       p.accessType,
      //       u.ownershipRef,
      //       p.userAid,
      //     ).result
      //   ).unwrap();
      // }

      const accessRef = (
        await this.repos.access.create(p.accessType, ownershipRef, p.userAid)
          .result
      ).unwrap();

      const name = trimAndCropText(p.name, 100);
      const description = trimAndCropText(p.description, 500);

      const g = newVibefireGroup({
        ownershipRef,
        accessRef,
        name,
        description,
        epochCreated: DateTime.utc().toMillis(),
      });
      const { id } = await this.repos.group.create(g).result;

      return id;
    });
  }
}
