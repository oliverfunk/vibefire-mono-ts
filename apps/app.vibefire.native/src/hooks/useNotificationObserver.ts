import { useEffect, useLayoutEffect } from "react";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";

export const useNotificationObserver = () => {
  useLayoutEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        // do stuff based on the type of notification
        console.log("notification rec", JSON.stringify(notification, null, 2));
      },
    );
    return () => subscription.remove();
  }, []);

  useLayoutEffect(() => {
    let isMounted = true;

    const redirectOnNotificationURL = (
      notification: Notifications.Notification,
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const url: string | undefined = notification.request.content.data?.url;
      if (url) {
        router.push(url);
      }
    };

    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (!isMounted || !response?.notification) {
          return;
        }
        redirectOnNotificationURL(response.notification);
      })
      .catch((err) => {
        console.error(err);
      });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("notification res", JSON.stringify(response, null, 2));
        redirectOnNotificationURL(response.notification);
      },
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
};
