export type VibefireNotificationsClient = {
  accessToken: string;
  endpoint?: string;
};

const serviceEndpoint = "https://webhooks.vibefire.app/eMFLssyIDapK";

type MessageType = "notification/check" | "notification/send";

const connector = async (
  c: VibefireNotificationsClient,
  route: string,
  type: MessageType,
  payload: Record<string, string>,
) => {
  if (route[0] !== "/") {
    throw new Error("Route must start with /");
  }
  const ep = c.endpoint || serviceEndpoint;
  return fetch(ep + route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Vibefire-Webhooks-Access-Token": c.accessToken,
    },
    body: JSON.stringify({
      type,
      data: payload,
    }),
  });
};

export const sendUserNotification = async (
  c: VibefireNotificationsClient,
  userAid: string,
  content: {
    title: string;
    body: string;
    toEventLinkId?: string;
  },
) => {
  const response = await connector(
    c,
    `/send/user/${userAid}`,
    "notification/send",
    content,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

export const checkNotification = async (
  c: VibefireNotificationsClient,
  notificationId: string,
) => {
  const response = await connector(c, `/check`, "notification/check", {
    notificationId,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};
