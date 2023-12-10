import { useEffect, useState } from "react";
import * as Location from "expo-location";

async function getLocationWithRetry(
  retries = 2,
): Promise<Location.LocationObject> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Timeout exceeded")), 1000),
  );
  try {
    return await Promise.race([Location.getCurrentPositionAsync({}), timeout]);
  } catch (error) {
    if (retries > 0) {
      return getLocationWithRetry(retries - 1);
    } else {
      throw Error("Could not get location");
    }
  }
}

export const useLocationOnce = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [locPermDeniedMsg, setLocPermDeniedMsg] = useState<string | null>(null);

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
