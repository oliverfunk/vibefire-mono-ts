import { type TModelVibefireEvent } from "@vibefire/models";

import { PlatformSelect } from "!/c/misc/PlatformSelect";
import { VibefireIconImage } from "!/c/misc/VibefireIconImage";

export const EventMapMarker = (props: {
  vibeRating?: TModelVibefireEvent["map"]["vibe"];
}) => {
  const { vibeRating } = props;

  return (
    <PlatformSelect
      android={
        <VibefireIconImage variant="map-marker-neutral" scaleFactor={0.06} />
      }
      ios={
        <VibefireIconImage variant="map-marker-neutral" scaleFactor={0.06} />
      }
    />
  );
  // switch (vibeRating) {
  //   case 2:
  //     return (
  //       <VibefireIconImage variant="map-marker-neutral" scaleFactor={0.06} />
  //     );
  //   case 1:
  //     return (
  //       <VibefireIconImage variant="mapmarker-neutral" scaleFactor={0.06} />
  //     );
  //   case 0:
  //     return (
  //       <VibefireIconImage variant="mapmarker-neutral" scaleFactor={0.06} />
  //     );
  //   case -1:
  //     return (
  //       <VibefireIconImage variant="mapmarker-neutral" scaleFactor={0.06} />
  //     );
  //   case -2:
  //     return (
  //       <VibefireIconImage variant="mapmarker-neutral" scaleFactor={0.06} />
  //     );
  // }
};
