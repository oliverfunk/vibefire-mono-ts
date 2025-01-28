import { View } from "react-native";
import { type FormikProps } from "formik";

import { type CoordT, type TModelVibefireEvent } from "@vibefire/models";
import { type PartialDeep } from "@vibefire/utils";

import { TextB, TextLL } from "!/components/atomic/text";
import { BContC, DivLineH } from "!/components/atomic/view";
import { LinearRedOrangeContainer } from "!/components/layouts/SheetScrollViewGradientVF";
import { LocationSelectionMap } from "!/components/map/LocationSelectionMap";

export const EventSelectLocationForm = (props: {
  formik: FormikProps<PartialDeep<TModelVibefireEvent>>;
}) => {
  const { formik } = props;
  const { values: event, handleBlur, handleChange, setFieldValue } = formik;

  return (
    <View>
      <LinearRedOrangeContainer>
        <BContC className="items-start">
          <TextLL className="w-full text-center">Select a location</TextLL>

          <DivLineH />

          <TextB>
            To set the event location, tap on the map to select a place and then
            tap update.
          </TextB>
        </BContC>
      </LinearRedOrangeContainer>
      <View className="h-2/3">
        <LocationSelectionMap
          eventId={event.id!}
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
  );
};
