import { type ManagerAsyncResult } from "@vibefire/models";
import {
  ExpoPushReceipt,
  getExpoService,
  type ExpoPushTicket,
  type ExpoService,
} from "@vibefire/services/expo";
import { resourceLocator } from "@vibefire/utils";

import { getReposManager, type ReposManager } from "!managers/repos-manager";
import { managerReturn } from "!managers/utils";

export const notificationsManager = Symbol("notificationsManager");
export const getNotificationsManager = () =>
  resourceLocator().bindResource(notificationsManager, () => {
    return new SFNotificationsManager(getExpoService(), getReposManager());
  });

export class SFNotificationsManager {
  constructor(
    private readonly expoService: ExpoService,
    private readonly repos: ReposManager,
  ) {}

  sendUserNotification(p: {
    userAid: string;
    title: string;
    body: string;
    toEventId?: string;
  }): ManagerAsyncResult<ExpoPushTicket> {
    return managerReturn(async () => {
      const { userAid, title, body, toEventId } = p;
      const user = (await this.repos.getUserProfile(userAid)).unwrap();
      const { pushToken } = user;
      if (!pushToken) {
        throw Error(
          `Attempting to send notification to user (aid: ${userAid}) but has no pushToken`,
        );
      }

      const pushTicket = await this.expoService.sendPushNotification(
        pushToken,
        title,
        body,
        toEventId
          ? {
              toEventId,
            }
          : undefined,
      );

      if (pushTicket.status === "error") {
        console.error("expo ticket error", JSON.stringify(pushTicket, null, 2));
      }

      return pushTicket;
    });
  }

  checkPushReceipts(receiptIds: string[]): ManagerAsyncResult<{
    [id: string]: ExpoPushReceipt;
  }> {
    return managerReturn(async () => {
      return await this.expoService.checkNotifications(receiptIds);
    });
  }
}
