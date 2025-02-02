// NOTE: this service requires a node runtime
// (this is the expo node sdk)

import { Expo } from "expo-server-sdk";

import { resourceLocator } from "@vibefire/utils";

export const expoServiceSymbol = Symbol("expoServiceSymbol");

export { type ExpoPushTicket, type ExpoPushReceipt } from "expo-server-sdk";

export const getExpoService = (options?: {
  expoAccessToken: string;
}): ExpoService =>
  resourceLocator().bindResource<ExpoService>(expoServiceSymbol, (ctx) => {
    const expoConfig = options || ctx.expo;
    if (!expoConfig) {
      throw new Error("Expo configuration is missing");
    }
    const expoClient = new Expo({
      accessToken: expoConfig.expoAccessToken,
    });
    return new ExpoService(expoClient);
  });

export class ExpoService {
  constructor(private readonly client: Expo) {}

  async sendPushNotification(
    pushToken: string,
    title: string,
    body: string,
    data: { [key: string]: string } = {},
  ) {
    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      throw Error(`Push token ${pushToken} is not a valid Expo push token`);
    }

    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    const message = {
      to: pushToken,
      sound: "default" as const,
      title,
      body,
      data,
    };

    const sendRes = await this.client.sendPushNotificationsAsync([message]);

    if (sendRes.length !== 1) {
      throw new Error(
        `Expected sendRes.length to be 1, but got ${sendRes.length}`,
      );
    }

    const ticket = sendRes[0]!;
    return ticket;
  }

  async sendPushNotifications(
    pushTokens: string[],
    title: string,
    body: string,
    data: { [key: string]: string } = {},
  ) {
    // Check that all your push tokens appear to be valid Expo push tokens
    const validPushTokens: string[] = [];
    const invalidPushTokens: string[] = [];

    pushTokens.forEach((token) => {
      if (Expo.isExpoPushToken(token)) {
        validPushTokens.push(token);
      } else {
        invalidPushTokens.push(token);
      }
    });

    if (invalidPushTokens.length > 0) {
      console.error(
        `Some push tokens are not valid Expo push tokens: ${invalidPushTokens}`,
      );
    }

    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    const messages = validPushTokens.map((pushToken) => ({
      to: pushToken,
      sound: "default" as const,
      title,
      body,
      data,
    }));

    const chunks = this.client.chunkPushNotifications(messages);
    const tickets = [];

    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.client.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error);
      }
    }

    return tickets;
  }

  async checkNotifications(receiptIds: string[]) {
    const recps =
      await this.client.getPushNotificationReceiptsAsync(receiptIds);

    return recps;
  }
}
