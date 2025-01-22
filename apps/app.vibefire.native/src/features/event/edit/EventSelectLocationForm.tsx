import { View } from "react-native";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import { type FormikProps } from "formik";

import { type CoordT, type TModelVibefireEvent } from "@vibefire/models";
import { type PartialDeep } from "@vibefire/utils";

import { TextB, TextLL } from "!/components/atomic/text";
import { LocationSelectionMap } from "!/components/map/LocationSelectionMap";

export const EventSelectLocationForm = (props: {
  formik: FormikProps<PartialDeep<TModelVibefireEvent>>;
}) => {
  const { formik } = props;
  const { values: event, handleBlur, handleChange, setFieldValue } = formik;
  return (
    <NativeViewGestureHandler disallowInterruption={true}>
      <View className="h-full flex-col space-y-4">
        <TextLL className="text-center">Select a location</TextLL>
        <TextB className="px-4">Tap on the map to select a location</TextB>

        <View>
          <LocationSelectionMap
            initialPosition={event.location?.position as CoordT | undefined}
            onPositionSelected={async (position) => {
              await setFieldValue("location.position", position);
            }}
            onAddressDescription={async (addressDescription) => {
              await setFieldValue(
                "location.addressDescription",
                addressDescription,
              );
            }}
          />
        </View>
      </View>
    </NativeViewGestureHandler>
  );
};
