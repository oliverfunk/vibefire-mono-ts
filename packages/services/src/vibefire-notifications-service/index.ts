//api url - https://webhooks.vibefire.app/eMFLssyIDapK - post
// set header - X-Vibefire-Expo-Notf-Service-Key - b0a0ddd5a3f7df947bd435f30b093a6b5d72909766c9a9bd9f7a9c88de2eccbb

const API_URL = "";
const API_KEY = "";

export type ExpoNotificationsService = {
  endpoint: string;
  secret: string;
};

type MessageType = "notification/check" | "notification/send";

const connector = async (
  s: ExpoNotificationsService,
  route: string,
  type: MessageType,
  payload: Record<string, string>,
) => {
  if (route[0] !== "/") {
    throw new Error("Route must start with /");
  }
  return fetch(s.endpoint + route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Vibefire-Webhooks-Permit-Secret": s.secret,
    },
    body: JSON.stringify({
      type,
      data: payload,
    }),
  });
};

export const sendUserNotification = async (
  s: ExpoNotificationsService,
  userAid: string,
  content: {
    title: string;
    body: string;
    toEventLinkId?: string;
  },
) => {
  const response = await connector(
    s,
    `/send/user/${userAid}`,
    "notification/send",
    content,
  );

  console.log(JSON.stringify(response, null, 2));

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

export const checkNotification = async (s: ExpoNotificationsService) => {
  const response = await connector(s, `/check`, "notification/check", {});

  console.log(JSON.stringify(response, null, 2));

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};
