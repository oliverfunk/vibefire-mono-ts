import {
  checkNotification,
  sendUserNotification,
  type VibefireNotificationsClient,
} from "@vibefire/services/vibefire-notifications";

import { managersContext } from "~/managers-context";

let _VibefireNotificationManager: VibefireNotificationManager | undefined;
export const getVibefireNotificationManager =
  (): VibefireNotificationManager => {
    "use strict";
    if (!_VibefireNotificationManager) {
      const { vfNotifServiceAccessToken } = managersContext();
      _VibefireNotificationManager = new VibefireNotificationManager(
        vfNotifServiceAccessToken!,
      );
    }
    return _VibefireNotificationManager;
  };

export class VibefireNotificationManager {
  private vfNotifClient: VibefireNotificationsClient;
  constructor(accessToken: string) {
    this.vfNotifClient = { accessToken };
  }

  // make more methods that are
  // specific to their useage
  // i.e. sendUserEventNotification
  async sendUserNotification(
    userAid: string,
    title: string,
    body: string,
    toEventLinkId?: string,
  ): Promise<void> {
    await sendUserNotification(this.vfNotifClient, userAid, {
      title,
      body,
      toEventLinkId,
    });
  }

  async checkNotification(notificationId: string): Promise<void> {
    await checkNotification(this.vfNotifClient, notificationId);
  }
}
