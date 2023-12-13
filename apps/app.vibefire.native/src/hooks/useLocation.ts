import { useEffect, useState } from "react";
import * as Location from "expo-location";

async function getLocationWithRetry(
  retries = 2,
  timeoutMillis = 1000,
): Promise<Location.LocationObject | undefined> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Timeout exceeded")), timeoutMillis),
  );
  try {
    return await Promise.race([Location.getCurrentPositionAsync({}), timeout]);
  } catch (error) {
    if (retries > 0) {
      return getLocationWithRetry(retries - 1);
    } else {
      return undefined;
    }
  }
}

export const useLocationOnce = () => {
  const [location, setLocation] = useState<Location.LocationObject | undefined>(
    undefined,
  );
  const [locPermDeniedMsg, setLocPermDeniedMsg] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    void (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        setLocPermDeniedMsg("Permission to access location was denied");
        return;
      }
      const location = await getLocationWithRetry(10);
      setLocation(location);
    })();
  }, []);

  return { location, locPermDeniedMsg };
};
