import { resourceLocator } from "@vibefire/utils";

import { VibefireNotificationsClient } from "./client";

export const vibefireNotificationsServiceSymbol = Symbol(
  "vibefireNotificationsServiceSymbol",
);

export const getVibefireNotificationsService = (options?: {
  authToken: string;
}) =>
  resourceLocator().bindResource<VibefireNotificationsService>(
    vibefireNotificationsServiceSymbol,
    (ctx) => {
      const vibefireNotificationsConfig = options || ctx.vibefireNotifications;
      if (!vibefireNotificationsConfig) {
        throw new Error("vibefireNotifications config is missing");
      }
      const client = new VibefireNotificationsClient(
        vibefireNotificationsConfig.authToken,
      );
      return new VibefireNotificationsService(client);
    },
  );

export class VibefireNotificationsService {
  constructor(private readonly client: VibefireNotificationsClient) {}

  async sendUserNotification(
    userAid: string,
    content: {
      title: string;
      body: string;
      toEventLinkId?: string;
    },
  ) {
    const response = await this.client.sendUserNotification(userAid, content);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }

  async checkNotification(notificationId: string) {
    const response = await this.client.checkNotification(notificationId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }
}
