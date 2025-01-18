import { type TModelVibefireEvent } from "@vibefire/models";

import { VibefireIconImage } from "!/c/misc/VibefireIconImage";

export const EventMapMarker = (props: {
  vibeRating?: TModelVibefireEvent["map"]["vibe"];
}) => {
  const { vibeRating } = props;
  return <VibefireIconImage variant="map-marker-neutral" scaleFactor={0.06} />;
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
