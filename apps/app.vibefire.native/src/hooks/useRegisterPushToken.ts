import { useEffect, useState } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { atom, useAtomValue } from "jotai";

import { type VibefireUserT } from "@vibefire/models";

import { trpc } from "~/apis/trpc-client";
import { userAtom } from "~/atoms";

const allowsNotifications = async () => {
  const settings = await Notifications.getPermissionsAsync();
  return settings.granted;
};

const requestNotificationsPermissions = async () => {
  const settings = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });
  return settings.granted;
};

const getExpoPushNotificationToken = async () => {
  if (!Device.isDevice) {
    console.log("Must use physical device for Push Notifications");
    return undefined;
  }

  let allows = await allowsNotifications();
  if (!allows) {
    allows = await requestNotificationsPermissions();
  }
  if (!allows) {
    console.log("Insufficient permission for push notifications!");
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const token = await Notifications.getExpoPushTokenAsync({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    projectId: Constants.expoConfig!.extra!.eas.projectId,
  });
  return token;
};

const userPushTokenAtom = atom((get) => {
  const user = get(userAtom);
  if (user.state !== "authenticated") {
    return undefined;
  }
  return (user.userInfo as VibefireUserT).pushToken ?? null;
});

export const useRegisterPushToken = () => {
  const userPushToken = useAtomValue(userPushTokenAtom);
  const [tokenChecked, setTokenChecked] = useState(false);

  const registerUserTokenMut = trpc.user.registerToken.useMutation();
  const unregisterUserTokenMut = trpc.user.unregisterToken.useMutation();

  useEffect(() => {
    if (userPushToken === undefined) {
      return;
    }
    if (tokenChecked) {
      return;
    }

    const tokenFlow = async () => {
      if (userPushToken) {
        const allows = await allowsNotifications();
        const isDevice = Device.isDevice;
        if (!allows && isDevice) {
          // if it's on an emulator, don't unregister
          await unregisterUserTokenMut.mutateAsync();
        }
      } else {
        const token = await getExpoPushNotificationToken();
        if (token) {
          const expoPushToken = token.data;
          console.log("registering user push notification token");
          await registerUserTokenMut.mutateAsync({ token: expoPushToken });
        }
      }
      setTokenChecked(true);
    };

    tokenFlow().catch((error) => {
      console.error(
        "An error occurred while registering for push notifications",
        JSON.stringify(error, null, 2),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPushToken]);
};
