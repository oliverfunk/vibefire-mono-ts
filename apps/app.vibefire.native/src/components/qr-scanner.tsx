import { StyleSheet, Text } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";

const NoCameraDeviceError = () => {
  return <Text>No camera device found!</Text>;
};

export const QrScanner = () => {
  const { hasPermission, requestPermission } = useCameraPermission();

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: (codes) => {
      console.log(`Scanned ${codes.length} codes!`);
    },
  });
  const device = useCameraDevice("back");
  console.log("hasPermission", device === undefined);

  if (device == null) return <NoCameraDeviceError />;
  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      codeScanner={codeScanner}
    />
  );
};
