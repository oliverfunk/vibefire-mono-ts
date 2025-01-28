import { useEffect, useState } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useAtom } from "jotai";

import { trpc } from "!/api/trpc-client";

import { userAtom } from "!/atoms";

// TODO: this should be refactored
// to be called when the user logs in
// and then you compare the token gotten
// from expo to the one in the database
// and if they are different, then you
// update the database with the new token

const allowsNotifications = async () => {
  const settings = await Notifications.getPermissionsAsync();
  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
};

const requestNotificationsPermissions = async () => {
  const settings = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowProvisional: true,
    },
  });
  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
};

const getExpoPushNotificationToken = async () => {
  if (!Device.isDevice) {
    return undefined;
  }

  let allows = await allowsNotifications();
  if (!allows) {
    allows = await requestNotificationsPermissions();
  }
  if (!allows) {
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

export const useRegisterPushToken = () => {
  const [user] = useAtom(userAtom);
  const [tokenCheckStarted, setTokenCheckStarted] = useState(false);

  const registerUserTokenMut = trpc.user.registerToken.useMutation();
  const unregisterUserTokenMut = trpc.user.unregisterToken.useMutation();

  useEffect(() => {
    if (user.state !== "authenticated") {
      return;
    }
    if (tokenCheckStarted) {
      return;
    }
    setTokenCheckStarted(true);

    const tokenFlow = async () => {
      if (user.userInfo.pushToken) {
        const allows = await allowsNotifications();
        const isDevice = Device.isDevice;
        if (!allows && isDevice) {
          // if it's on an emulator, don't unregister
          console.log("unregistering user push notification token");
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
    };

    tokenFlow().catch((error) => {
      console.error(
        "An error occurred while registering for push notifications",
        JSON.stringify(error, null, 2),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    registerUserTokenMut,
    tokenCheckStarted,
    unregisterUserTokenMut,
    user.state,
  ]);
};
