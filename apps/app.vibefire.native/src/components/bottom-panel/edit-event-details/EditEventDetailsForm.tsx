import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import _ from "lodash";
import { type PartialDeep } from "type-fest";

import { type CoordT, type VibefireEventT } from "@vibefire/models";

import { trpc } from "~/apis/trpc-client";
import { navEditEventClose, navEditEventEditSection } from "~/nav";
import { type EditEventFormSectionT } from "~/types";
import { BackNextButtons, ScrollViewSheetWithHeader } from "../_shared";
import { EditEventDescription } from "./sections/EditEventDescriptions";
import { EditEventImages } from "./sections/EditEventImages";
import { EditEventLocation } from "./sections/EditEventLocation";
import { EditEventTimes } from "./sections/EditEventTimes";

// const [formErrors, setFormErrors] = useState<string[]>([]);
// {formErrors.length > 0 && (
//   <View className="w-full flex-col">
//     <View className="mx-4 space-y-2 rounded-lg bg-slate-200 p-4">
//       {formErrors.map((error) => (
//         <Text key={error} className="text-lg text-red-500">
//           {error}
//         </Text>
//       ))}
//     </View>
//   </View>
// )}

export const EditEventForm = (props: {
  eventId: string;
  currentEventData: PartialDeep<VibefireEventT>;
  dataRefetch: () => void;
  section: EditEventFormSectionT;
}) => {
  const { eventId, currentEventData, dataRefetch, section } = props;

  const [editedEventData, setEditedEventData] = useState(currentEventData);
  const hasEdited = !_.isEqual(currentEventData, editedEventData);

  useEffect(() => {
    setEditedEventData(currentEventData);
  }, [currentEventData]);

  // set by each section
  const [mayProceed, setMayProceed] = useState(false);
  const [formValidations, setFormValidations] = useState<string[]>([]);

  // const readyState: "draft" | "now-ready" | "already-ready" = useMemo(() => {
  //   const isReady =
  //     currentEventData?.title &&
  //     currentEventData?.description &&
  //     currentEventData?.location?.position &&
  //     currentEventData?.location?.addressDescription &&
  //     currentEventData?.timeZone &&
  //     currentEventData?.timeStartIsoNTZ &&
  //     currentEventData?.images?.banner;
  //   if (!isReady) {
  //     return "draft";
  //   }
  //   if (currentEventData.state === "draft") {
  //     return "now-ready";
  //   }
  //   return "already-ready";
  // }, [currentEventData]);

  const updateEventMut = trpc.events.updateEvent.useMutation();

  return (
    <ScrollViewSheetWithHeader header="Edit Details">
      <View className="pb-4">
        <View className="flex-col bg-black p-4 ">
          <Text className="text-lg text-white">
            Get your event ready by setting the event details. Fields in{" "}
            <Text className="text-[#ff1111]">red</Text> still need to be set.
          </Text>
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
        <BackNextButtons
          nextText={section === "images" ? "Save" : "Next"}
          nextAfterLoading={currentEventData.state === "draft"}
          onBackPressed={() => {
            setMayProceed(false);
            // reset
            setEditedEventData(currentEventData);
            switch (section) {
              case "description":
                navEditEventClose();
                break;
              case "location":
                navEditEventEditSection(eventId, "description");
                break;
              case "times":
                navEditEventEditSection(eventId, "location");
                break;
              case "images":
                navEditEventEditSection(eventId, "times");
                break;
            }
          }}
          onSavePressed={async () => {
            if (formValidations.length > 0) {
              // set errors
              return;
            }
            if (hasEdited) {
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
              });
              dataRefetch();
            }
          }}
          onNextPressed={() => {
            if (mayProceed) {
              setMayProceed(false);
              switch (section) {
                case "description":
                  navEditEventEditSection(eventId, "location");
                  break;
                case "location":
                  navEditEventEditSection(eventId, "times");
                  break;
                case "times":
                  navEditEventEditSection(eventId, "images");
                  break;
                case "images":
                  // navEditEventEditSection(eventId, "location");
                  break;
              }
            }
          }}
          mayProceed={mayProceed}
          canSave={hasEdited}
          isLoading={updateEventMut.isLoading}
        />
      </View>
    </ScrollViewSheetWithHeader>
  );
};
