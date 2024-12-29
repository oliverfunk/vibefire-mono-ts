import React, { useMemo } from "react";
import { Text, TextInput, useWindowDimensions, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { type FormikProps } from "formik";

import {
  type CoordT,
  type TModelVibefireEvent,
  type TModelVibefireMembership,
} from "@vibefire/models";
import { type PartialDeep } from "@vibefire/utils";

import { EventActionsBar } from "!/c/event/EventActionBar";
import { EventInfoAddressBarEditable } from "!/c/event/EventInfoBars";
import { ImageCarousel } from "!/c/image/ImageCarousel";
import { UploadableVibefireImage } from "!/c/image/UploadableVibefireImage";
import { VibefireImage } from "!/c/image/VibefireImage";
import { LocationSelectionMap } from "!/c/map/LocationSelectionMap";
import { LinearRedOrangeView } from "!/c/misc/sheet-utils";
import { OrganiserBarView } from "!/c/OrganiserBarView";

import { AddEventDetailWidgetButton } from "./ui/AddEventDetailWidgetButton";
import { EditableEventDetailWidget } from "./ui/EditableEventDetailWidget";
import { EditableIconWrapper } from "./ui/EditableIconWrapper";
import {
  EditInfoDisplay,
  type TEventManageHandles,
} from "./ui/EditInfoDisplay";
import { SelectEventTimesButton } from "./ui/SelectEventTimesButton";

// const DeleteConfirmationModal = (props: {
//   showModal: boolean;
//   hideModal: () => void;
//   eventId?: string;
// }) => {
//   const { showModal, hideModal, eventId } = props;

//   const utils = trpc.useUtils();

//   const deleteEventMut = trpc.events.deleteEvent.useMutation();

//   return (
//     <Modal visible={showModal} transparent animationType="fade">
//       <Pressable
//         className="h-full w-full items-center justify-center bg-black/50 p-4"
//         onPress={() => hideModal()}
//       >
//         <View className="flex-col space-y-4 overflow-hidden rounded bg-white p-4">
//           <Text className="text-xl font-bold">Delete Event</Text>
//           <Text className="text-base">
//             {"Are you sure you want to delete the event?"}
//           </Text>
//           <View className="flex-col items-end space-y-2">
//             <TouchableOpacity
//               onPress={async () => {
//                 if (!eventId) return;
//                 await deleteEventMut.mutateAsync({ eventId });
//                 await utils.invalidate();
//                 hideModal();
//               }}
//             >
//               <Text className="text-base font-bold text-red-500">Delete</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Pressable>
//     </Modal>
//   );
// };

export const EditableEventForm = (
  props: {
    formik: FormikProps<PartialDeep<TModelVibefireEvent>>;
    membership: TModelVibefireMembership;
  } & TEventManageHandles,
) => {
  const { formik, membership } = props;
  const { values: event, handleBlur, handleChange, setFieldValue } = formik;

  const { width } = useWindowDimensions();

  const bannerImgKeys = useMemo(() => {
    const keys = event?.images?.bannerImgKeys || [""];
    return keys.length < 5 ? [...keys, ""] : keys;
  }, [event?.images?.bannerImgKeys]);

  const details = event.details;

  return (
    <>
      <EditInfoDisplay event={event} {...props} />

      {/* header */}
      <View className="relative">
        <ImageCarousel
          width={width}
          imgIdKeys={bannerImgKeys}
          renderItem={({ index, item }) => {
            if (!event.id) {
              return <VibefireImage />;
            }
            return (
              <UploadableVibefireImage
                eventId={event.id}
                imgIdKey={item}
                alt={`Banner image ${index}`}
                onClosePress={async () => {
                  const newKeys = [...bannerImgKeys];
                  newKeys.splice(index, 1);
                  await setFieldValue("images.bannerImgKeys", newKeys);
                }}
                onImageUploaded={async (imgKeyId: string) => {
                  const newKeys = [...bannerImgKeys];
                  newKeys[index] = imgKeyId;
                  await setFieldValue("images.bannerImgKeys", newKeys);
                }}
              />
            );
          }}
        />

        <LinearGradient
          className="absolute bottom-0 w-full px-4 pt-2"
          colors={["rgba(0,0,0,0)", "rgba(0, 0, 0, 0.8)"]}
          locations={[0, 1]}
        >
          <EditableIconWrapper center>
            <TextInput
              className="py-2 text-center text-2xl text-white"
              multiline={false}
              placeholderTextColor={"#909090FF"}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={event["name"]}
            />
          </EditableIconWrapper>
        </LinearGradient>
      </View>

      {/* black bars */}
      <OrganiserBarView
        ownerRef={event.ownerRef}
        showLeaveJoin={false}
        membership={membership}
        threeDotsDisabled={true}
        leaveJoinDisabled={true}
      />
      <EventActionsBar location={event?.location} disabled={true} />

      {/* infos */}
      <LinearRedOrangeView className="flex-col p-0.5">
        <View className="flex-col space-y-4 rounded-md bg-black p-3.5">
          <View>
            <EditableIconWrapper>
              <SelectEventTimesButton
                event={event}
                onSetStart={async (d) => {
                  await setFieldValue("times.ntzStart", d.toISOString());
                }}
                onSetEnd={async (d) => {
                  await setFieldValue(
                    "times.ntzEnd",
                    d ? d.toISOString() : null,
                  );
                }}
              />
            </EditableIconWrapper>
          </View>
          <View>
            <EditableIconWrapper>
              <EventInfoAddressBarEditable
                className="text-white"
                multiline={true}
                numberOfLines={2}
                placeholderTextColor={"#909090FF"}
                placeholder="(Set a location description)"
                onChangeText={handleChange("location.addressDescription")}
                onBlur={handleBlur("location.addressDescription")}
                value={event.location?.addressDescription}
              />
            </EditableIconWrapper>
          </View>
        </View>
      </LinearRedOrangeView>

      {/* map */}
      <View>
        <Text className="p-2 text-center text-white">
          (Tap the map to set a location)
        </Text>
        <View className="aspect-[4/4]">
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

      {/*
      todo: abstarct call backs up to parent
      check for empty strings in desc's
      */}

      {/* details */}
      <View className="flex-col space-y-4 p-4">
        {details &&
          details.map((detail, index) => (
            <View key={index}>
              <EditableEventDetailWidget
                formik={formik}
                n={index}
                nDetails={details.length}
                detail={detail}
                detailsPath={`details`}
              />
            </View>
          ))}
        <View>
          <AddEventDetailWidgetButton
            onAdd={async (detail) => {
              await formik.setFieldValue("details", [
                ...(details ?? []),
                detail,
              ]);
            }}
          />
        </View>
      </View>
    </>
  );
};
