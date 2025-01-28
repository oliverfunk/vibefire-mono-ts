import { useState } from "react";
import { Marker } from "react-native-maps";

import { type TModelVibefireEvent } from "@vibefire/models";

import { PlatformSelect } from "!/c/misc/PlatformSelect";
import { VibefireIconImage } from "!/c/misc/VibefireIconImage";

export const EventMapMarker = (props: {
  eventId: string;
  vibeRating?: TModelVibefireEvent["map"]["vibe"];
  markerPosition: TModelVibefireEvent["location"]["position"];
  onPress?: () => void;
}) => {
  const { eventId, vibeRating, markerPosition, onPress } = props;

  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  return (
    <Marker
      key={eventId}
      identifier={eventId}
      tracksViewChanges={tracksViewChanges}
      centerOffset={{ x: 0, y: -((750 * 0.06) / 2) }}
      coordinate={{
        latitude: markerPosition.lat,
        longitude: markerPosition.lng,
      }}
      onPress={onPress}
    >
      <PlatformSelect
        android={
          <VibefireIconImage
            variant="map-marker-neutral"
            scaleFactor={0.06}
            onLoad={() => {
              setTracksViewChanges(false);
            }}
          />
        }
        ios={
          <VibefireIconImage
            variant="map-marker-neutral"
            scaleFactor={0.06}
            onLoad={() => {
              setTracksViewChanges(false);
            }}
          />
        }
      />
    </Marker>
  );
};
