import { useEffect } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { type VibefireUserT } from "@vibefire/models";

import { trpc } from "~/apis/trpc-client";

const getExpoPushNotificationToken = async () => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  if (Device.isDevice) {
    const { status: currentNotfStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = currentNotfStatus;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (finalStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (finalStatus !== "granted") {
      console.log("Insufficient permission for push notifications!");
      return "";
    }

    const token = await Notifications.getExpoPushTokenAsync({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      projectId: Constants.expoConfig!.extra!.eas.projectId,
    });
    return token;
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  return undefined;
};

export const useRegisterPushToken = (userInfo: VibefireUserT) => {
  const registerUserTokenMut = trpc.user.registerToken.useMutation();
  const unregisterUserTokenMut = trpc.user.unregisterToken.useMutation();

  useEffect(() => {
    getExpoPushNotificationToken()
      .then(async (token) => {
        if (token === undefined) {
          return;
        }
        if (token === "") {
          await unregisterUserTokenMut.mutateAsync();
        } else {
          const expoPushToken = token.data;
          if (userInfo.pushToken === expoPushToken) {
            return;
          }
          await registerUserTokenMut.mutateAsync({ token: expoPushToken });
        }
      })
      .catch((error) => {
        console.error(
          "An error occurred while registering for push notifications",
          JSON.stringify(error, null, 2),
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.pushToken]);
};
