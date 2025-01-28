import { DateTime } from "luxon";

import {
  ModelVibefireUser,
  newVibefireUser,
  tbValidator,
} from "@vibefire/models";
import { getClerkService, type ClerkService } from "@vibefire/services/clerk";
import { resourceLocator, trimAndCropText } from "@vibefire/utils";

import { getReposManager, type ReposManager } from "!managers/repos-manager";
import { managerReturn } from "!managers/utils";

export const ufUsersManagerSymbol = Symbol("ufUsersManagerSymbol");
export const getUFUsersManager = () =>
  resourceLocator().bindResource(ufUsersManagerSymbol, () => {
    return new UFUsersManager(getReposManager(), getClerkService());
  });

export class UFUsersManager {
  constructor(
    private readonly repos: ReposManager,
    private readonly clerk: ClerkService,
  ) {}

  async createNewUser(
    userAid: string,
    firstName: string | undefined,
    primaryEmail: string | undefined,
    primaryPhone: string | undefined,
    birthdayISO: string | undefined,
  ) {
    if (!userAid) {
      throw new Error("aid is required");
    }

    const maybeUser = await this.repos.user.withAid(userAid).result;
    if (maybeUser) {
      return { id: maybeUser.id };
    }

    if (firstName && firstName.length < 2) {
      firstName = trimAndCropText(firstName, 100);
      throw new Error("firstName must be at least 2 characters long");
    }

    if (primaryEmail) {
      primaryEmail = tbValidator(ModelVibefireUser.properties.email)(
        trimAndCropText(primaryEmail, 500),
      );
    }
    if (primaryPhone) {
      primaryPhone = tbValidator(ModelVibefireUser.properties.phoneNumber)(
        trimAndCropText(primaryPhone, 100),
      );
    }

    const dateOfBirth = birthdayISO
      ? (DateTime.fromISO(birthdayISO).toISODate() ?? undefined)
      : undefined;

    const ownershipRef = await this.repos.access.createOwnership(
      "user",
      firstName || "User",
    ).result;

    const u = newVibefireUser({
      ownershipRef,
      aid: userAid,
      name: firstName,
      email: primaryEmail,
      phoneNumber: primaryPhone,
      dateOfBirth,
      epochCreated: DateTime.utc().toMillis(),
    });

    return await this.repos.user.create(u).result;
  }

  async getUserProfileWithRetry(
    userAid: string,
    retries = 1,
    retryTimeout = 2000,
  ) {
    for (let i = 0; i < retries; i++) {
      const res = await this.repos.getUserProfile(userAid);
      if (res.isOk) {
        return res.unwrap();
      }
      await new Promise((resolve) => setTimeout(resolve, retryTimeout));
    }
    throw new Error("User not found");
  }

  //   async updateUserInfo(
  //     userAc: ClerkSignedInAuthContext,
  //     userInfo: Partial<VibefireUserInfoT>,
  //   ) {
  //     const res = await updateUserInfo(this.faunaClient, userAc.userId, userInfo);
  //     return res;
  //   }

  async deleteUserAccount(userAid: string) {
    // todo: will take too long, need another way

    // todo: This is a potential security issue, as it allows users to
    // delete their accounts, and then create new ones, and then
    // delete them again, etc.! Need to add a cooldown period
    // before a user's account will actually be deleted.

    // const userEvents = await this.eventsByUser(userAc);
    // if (userEvents.length > 0) {
    //   for (const event of userEvents) {
    //     await this.eventDelete(userAc, event.id!);
    //   }
    // }
    console.log("deleting user", JSON.stringify(userAid, null, 2));
    await this.clerk.deleteUser(userAid);
    await this.repos.user.delete(userAid).result;
  }

  hideEventForUser(userAid: string, eventId: string) {
    return managerReturn(async () => {
      await this.repos.user.hideEvent(userAid, eventId).result;
    });
  }

  hideOwnerForUser(userAid: string, ownershipId: string) {
    return managerReturn(async () => {
      await this.repos.user.hideOwner(userAid, ownershipId).result;
    });
  }

  userRegisterPushToken(userAid: string, token: string) {
    return managerReturn(async () => {
      await this.repos.user.setUserPushToken(userAid, token).result;
    });
  }

  async userUnregisterPushToken(userAid: string) {
    return managerReturn(async () => {
      await this.repos.user.clearUserPushToken(userAid).result;
    });
  }
}
