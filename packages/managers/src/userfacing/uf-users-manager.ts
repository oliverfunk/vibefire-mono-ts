import { type RepositoryService } from "@vibefire/services/fauna";

import { ReposManager } from "!managers/repos-manager";

export class UFUsersManager {
  constructor(private readonly repos: ReposManager) {}

  static fromService(repoService: RepositoryService) {
    return new UFUsersManager(ReposManager.fromService(repoService));
  }

  //   async userCreate(
  //     aid: string,
  //     firstName: string,
  //     primaryEmail: string | undefined,
  //     primaryPhone: string | undefined,
  //     birthdayISO: string | undefined,
  //   ) {
  //     if (!aid) {
  //       throw new Error("aid is required");
  //     }
  //     if (firstName.length < 2) {
  //       throw new Error("firstName must be at least 2 characters long");
  //     }

  //     firstName = trimAndCropText(firstName, 100);

  //     if (primaryEmail) {
  //       primaryEmail = tbValidator(ModelVibefireUser.properties.contactEmail)(
  //         trimAndCropText(primaryEmail, 500),
  //       );
  //     }
  //     if (primaryPhone) {
  //       primaryPhone = tbValidator(ModelVibefireUser.properties.phoneNumber)(
  //         trimAndCropText(primaryPhone, 100),
  //       );
  //     }

  //     const dateOfBirth = birthdayISO
  //       ? (DateTime.fromISO(birthdayISO).toISODate() ?? undefined)
  //       : undefined;

  //     const u = Value.Create(ModelVibefireUser);

  //     u.aid = aid;
  //     u.name = firstName;
  //     u.contactEmail = primaryEmail;
  //     u.phoneNumber = primaryPhone;
  //     u.dateOfBirth = dateOfBirth;

  //     removeUndef(u);

  //     const res = await createUser(this.faunaClient, u);
  //     return res;
  //   }

  //   async getUserInfo(userAc: ClerkSignedInAuthContext, retry = false) {
  //     const retries = 3;
  //     const retryTimeout = 2000;

  //     let res = await getUserByAid(this.faunaClient, userAc.userId);
  //     if (retry && !res) {
  //       for (let i = 0; i < retries; i++) {
  //         await new Promise((resolve) => setTimeout(resolve, retryTimeout));
  //         res = await getUserByAid(this.faunaClient, userAc.userId);
  //       }
  //     }

  //     if (!res) {
  //       throw new Error("User not found");
  //     }

  //     res = tbValidator(ModelVibefireUser)(res);
  //     return res;
  //   }

  //   async updateUserInfo(
  //     userAc: ClerkSignedInAuthContext,
  //     userInfo: Partial<VibefireUserInfoT>,
  //   ) {
  //     const res = await updateUserInfo(this.faunaClient, userAc.userId, userInfo);
  //     return res;
  //   }

  //   async deleteUserAccount(userAc: ClerkSignedInAuthContext) {
  //     const userAid = userAc.userId;
  //     // todo: will take too long, need another way

  //     // todo: This is a potential security issue, as it allows users to
  //     // delete their accounts, and then create new ones, and then
  //     // delete them again, etc.! Need to add a cooldown period
  //     // before a user's account will actually be deleted.

  //     // const userEvents = await this.eventsByUser(userAc);
  //     // if (userEvents.length > 0) {
  //     //   for (const event of userEvents) {
  //     //     await this.eventDelete(userAc, event.id!);
  //     //   }
  //     // }
  //     console.log("deleting user", JSON.stringify(userAid, null, 2));
  //     await getClerkManager().userDeleteProfile(userAid);
  //     await deleteUser(this.faunaClient, userAc.userId);
  //   }

  //   async setStarEventForUser(
  //     userAc: ClerkSignedInAuthContext,
  //     eventId: string,
  //     starIt: boolean,
  //   ) {
  //     if (starIt) {
  //       await starEvent(this.faunaClient, userAc.userId, eventId);
  //     } else {
  //       await unstarEvent(this.faunaClient, userAc.userId, eventId);
  //     }
  //   }

  //   async hideEventForUser(userAc: ClerkSignedInAuthContext, eventId: string) {
  //     await hideEvent(this.faunaClient, userAc.userId, eventId);
  //   }

  //   async blockOrganiserForUser(
  //     userAc: ClerkSignedInAuthContext,
  //     organiserId: string,
  //   ) {
  //     if (organiserId === userAc.userId) {
  //       throw new Error("Cannot block yourself");
  //     }
  //     await blockOrganiser(this.faunaClient, userAc.userId, organiserId);
  //   }

  //   async userRegisterPushToken(
  //     userAc: ClerkSignedInAuthContext,
  //     token: string,
  //   ): Promise<void> {
  //     await setUserPushToken(this.faunaClient, userAc.userId, token);
  //   }

  //   async userUnregisterPushToken(
  //     userAc: ClerkSignedInAuthContext,
  //   ): Promise<void> {
  //     await clearUserPushToken(this.faunaClient, userAc.userId);
  //   }
}
