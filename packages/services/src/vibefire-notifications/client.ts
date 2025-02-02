// for routing the request in hookdeck
type MessageType = "notification/check" | "notification/send";

export class VibefireNotificationsClient {
  private readonly serviceEndpoint: string;
  constructor(private readonly authToken: string) {
    this.serviceEndpoint = "https://webhooks.vibefire.app/eMFLssyIDapK";
  }

  _connector(
    route: string,
    type: MessageType,
    payload: Record<string, string>,
  ) {
    const url = new URL(route, this.serviceEndpoint);
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Vibefire-Notifications-Auth-Token": this.authToken,
      },
      body: JSON.stringify({
        type,
        data: payload,
      }),
    });
  }

  sendUserNotification(
    userAid: string,
    payload: { title: string; body: string; toEventId?: string },
  ) {
    return this._connector(
      `/send/user/${userAid}`,
      "notification/send",
      payload,
    );
  }

  checkNotification(notificationId: string) {
    return this._connector(
      `/check/${notificationId}`,
      "notification/check",
      {},
    );
  }
}
