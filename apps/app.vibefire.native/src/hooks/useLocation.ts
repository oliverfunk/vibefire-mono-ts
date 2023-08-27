import { useEffect, useState } from "react";
import * as Location from "expo-location";

export const useLocationOnce = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [locPermDeniedMsg, setlocPermDeniedMsg] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setlocPermDeniedMsg("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return { location, locPermDeniedMsg };
};
