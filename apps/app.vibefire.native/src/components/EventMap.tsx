import React from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

const EventMap = () => {
  return (
    <MapView
      className="h-full w-full"
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
    />
  );
};
export default EventMap;

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     height: 400,
//     width: 400,
//     justifyContent: "flex-end",
//     alignItems: "center",
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
// });

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     width: "100%",
//     height: "100%",
//   },
// });
