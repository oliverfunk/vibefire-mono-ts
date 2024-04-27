import { useLayoutEffect } from "react";
import { View } from "react-native";
import _ from "lodash";

import { type CoordT } from "@vibefire/models";

import { LocationSelectionMap } from "~/components/map/LocationSelectionMap";
import { FormTitleInput, FormTitleTextInput } from "../../../utils/sheet-utils";
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
          title="Location"
          inputRequired={!editedEventData.location?.position}
        >
          <View className="aspect-[4/4] border-2 border-slate-200">
            <LocationSelectionMap
              initialPosition={
                (currentEventData.location?.position as CoordT) ?? undefined
              }
              onPositionSelected={(position) => {
                setEditedEventData(
                  _.merge({}, editedEventData, {
                    location: { position },
                  } as typeof editedEventData),
                );
              }}
              onAddressDescription={(addressDescription) => {
                setEditedEventData(
                  _.merge({}, editedEventData, {
                    location: { addressDescription },
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
