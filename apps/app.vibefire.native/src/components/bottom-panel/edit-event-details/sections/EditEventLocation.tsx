import { useLayoutEffect } from "react";
import { View } from "react-native";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import _ from "lodash";

import { type CoordT } from "@vibefire/models";

import { LocationSelectionMap } from "~/components/LocationSelectionMap";
import { FormTitleInput, FormTitleTextInput } from "../../_shared";
import { type FormSectionProps } from "./types";

export const EditEventLocation = (props: FormSectionProps) => {
  const {
    currentEventData,
    editedEventData,
    setEditedEventData,
    setMayProceed,
  } = props;

  useLayoutEffect(() => {
    setMayProceed(
      !!editedEventData.location?.position &&
        !!editedEventData.location?.addressDescription,
    );
  }, [editedEventData, setMayProceed]);

  return (
    <View className="w-full flex-col space-y-4 p-4">
      <View>
        <FormTitleInput
          title="Location (tap to select)"
          inputRequired={!editedEventData.location?.position}
        >
          <View className="aspect-[4/4] border-2 border-slate-200">
            <LocationSelectionMap
              initialPosition={
                (currentEventData.location?.position as CoordT) ?? undefined
              }
              onPositionInfo={(position, addressDescription) => {
                setEditedEventData(
                  _.merge({}, editedEventData, {
                    location: { position, addressDescription },
                  } as typeof editedEventData),
                );
              }}
            />
          </View>
        </FormTitleInput>
      </View>

      <View>
        <FormTitleTextInput
          title="Address description"
          inputRequired={!editedEventData.location?.addressDescription}
          multiline={true}
          onChangeText={(text) => {
            setEditedEventData(
              _.merge({}, editedEventData, {
                location: { addressDescription: text },
              } as typeof editedEventData),
            );
          }}
          value={editedEventData.location?.addressDescription}
        />
      </View>
    </View>
  );
};
