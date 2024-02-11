import { useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";
import {
  useBottomSheet,
  type BottomSheetScrollViewMethods,
} from "@gorhom/bottom-sheet";
import _ from "lodash";
import { type PartialDeep } from "type-fest";

import { type CoordT, type VibefireEventT } from "@vibefire/models";

import { VibefireIconImage } from "~/components/VibefireIconImage";
import { trpc } from "~/apis/trpc-client";
import { navEditEventSetSection, navManageEvent } from "~/nav";
import { type EditEventFormSectionT } from "~/types";
import { BackNextButtons, ScrollViewSheetWithRef } from "../_shared";
import { EditEventDescription } from "./sections/EditEventDescriptions";
import { EditEventImages } from "./sections/EditEventImages";
import { EditEventLocation } from "./sections/EditEventLocation";
import { EditEventTimes } from "./sections/EditEventTimes";

export const EditEventForm = (props: {
  eventId: string;
  linkId: string;
  currentEventData: PartialDeep<VibefireEventT>;
  dataRefetch: () => void;
  section: EditEventFormSectionT;
}) => {
  const { eventId, linkId, currentEventData, dataRefetch, section } = props;

  const { close } = useBottomSheet();

  const formRef = useRef<BottomSheetScrollViewMethods>(null);

  const [editedEventData, setEditedEventData] = useState(currentEventData);
  const isEdited = !_.isEqual(currentEventData, editedEventData);

  const [displayValidations, setDisplayValidations] = useState(false);

  useEffect(() => {
    // poor detection of draft -> ready transition, on images section
    if (
      editedEventData.state === "draft" &&
      currentEventData.state === "ready" &&
      section === "images"
    ) {
      close();
      navManageEvent(linkId);
    }
    setEditedEventData(currentEventData);
  }, [close, currentEventData, editedEventData.state, linkId, section]);

  // set by each section
  const [mayProceed, setMayProceed] = useState(false);
  const [formValidations, setFormValidations] = useState<string[]>([]);

  const mayProceedForm = useMemo(() => {
    if (section === "images") {
      return mayProceed && currentEventData.state === "ready";
    }
    return mayProceed;
  }, [currentEventData, mayProceed, section]);

  const updateEventMut = trpc.events.updateEvent.useMutation();

  return (
    <ScrollViewSheetWithRef ref={formRef}>
      <View className="flex-col bg-black p-4">
        {currentEventData.state === "draft" ? (
          <Text className="text-lg text-white">
            Get your event ready by setting the event details. Fields in{" "}
            <Text className="text-[#ff3333]">red</Text> still need to be set.
          </Text>
        ) : (
          <Text className="text-lg text-white">
            &#x1F525; Your event is{" "}
            <Text className="text-[#11ff11]">ready</Text>!
          </Text>
        )}
        {displayValidations && (
          <View className="w-full flex-col space-y-2 pt-4">
            {formValidations.map((error) => (
              <Text key={error} className="text-lg text-[#ff3333]">
                {error}
              </Text>
            ))}
          </View>
        )}
      </View>
      {section === "description" && (
        <EditEventDescription
          currentEventData={currentEventData}
          editedEventData={editedEventData}
          setEditedEventData={setEditedEventData}
          setMayProceed={setMayProceed}
          setFormValidations={setFormValidations}
        />
      )}
      {section === "location" && (
        <EditEventLocation
          currentEventData={currentEventData}
          editedEventData={editedEventData}
          setEditedEventData={setEditedEventData}
          setMayProceed={setMayProceed}
          setFormValidations={setFormValidations}
        />
      )}
      {section === "times" && (
        <EditEventTimes
          currentEventData={currentEventData}
          editedEventData={editedEventData}
          setEditedEventData={setEditedEventData}
          setMayProceed={setMayProceed}
          setFormValidations={setFormValidations}
        />
      )}
      {section === "images" && (
        <EditEventImages
          currentEventData={currentEventData}
          editedEventData={editedEventData}
          setEditedEventData={setEditedEventData}
          setMayProceed={setMayProceed}
          setFormValidations={setFormValidations}
        />
      )}
      <View className="py-4 pb-6">
        <BackNextButtons
          nextText={section === "images" ? "Manage" : "Next"}
          nextAfterLoading={true}
          onBackPressed={() => {
            setMayProceed(false);
            setDisplayValidations(false);
            // reset
            setEditedEventData(currentEventData);
            switch (section) {
              case "description":
                close();
                break;
              case "location":
                navEditEventSetSection("description");
                break;
              case "times":
                navEditEventSetSection("location");
                break;
              case "images":
                navEditEventSetSection("times");
                break;
            }
            formRef.current?.scrollTo({
              x: 0,
              y: 0,
              animated: false,
            });
          }}
          onCancelPressed={() => {
            setMayProceed(false);
            setDisplayValidations(false);
            // reset
            setEditedEventData(currentEventData);
          }}
          onSavePressed={async () => {
            if (formValidations.length > 0) {
              setDisplayValidations(true);
              return;
            }
            if (isEdited) {
              await updateEventMut.mutateAsync({
                eventId,
                title: editedEventData.title,
                description: editedEventData.description,
                position: editedEventData.location?.position as CoordT,
                addressDescription:
                  editedEventData.location?.addressDescription,
                timeStartIsoNTZ: editedEventData.timeStartIsoNTZ,
                timeEndIsoNTZ: editedEventData.timeEndIsoNTZ,
                bannerImageId: editedEventData.images?.banner,
                additionalImageIds: editedEventData.images?.additional,
                timeline: editedEventData.timeline,
              });
              dataRefetch();
            }
          }}
          onNextPressed={() => {
            if (mayProceed) {
              setMayProceed(false);
              setDisplayValidations(false);
              switch (section) {
                case "description":
                  navEditEventSetSection("location");
                  break;
                case "location":
                  navEditEventSetSection("times");
                  break;
                case "times":
                  navEditEventSetSection("images");
                  break;
                case "images":
                  navManageEvent(currentEventData.linkId!);
                  break;
              }
            }
            formRef.current?.scrollTo({
              x: 0,
              y: 0,
              animated: false,
            });
          }}
          mayProceed={mayProceedForm}
          // sets the background to orange for goto manage
          mayProceedBg={section === "images" ? "bg-[#FF4500]" : undefined}
          isEdited={isEdited}
          isLoading={updateEventMut.isPending}
        />
      </View>
      <VibefireIconImage />
    </ScrollViewSheetWithRef>
  );
};
