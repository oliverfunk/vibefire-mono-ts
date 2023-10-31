import { useEffect, useMemo, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import _ from "lodash";
import { type PartialDeep } from "type-fest";

import { type VibefireEventT } from "@vibefire/models";

import { EventImageCarousel } from "~/components/EventImageCarousel";
import { UploadableEventImage } from "~/components/UploadableEventImage";
import { trpc } from "~/apis/trpc-client";
import { navManageEventEditReview } from "~/nav";
import {
  ReviewSaveNextFormButtons,
  ScrollViewSheetWithHeader,
} from "../_shared";

export const ManageEventEditImagesForm = (props: {
  eventId: string;
  currentEventData: PartialDeep<VibefireEventT> | undefined;
  dataRefetch: () => void;
}) => {
  const { eventId, currentEventData, dataRefetch } = props;

  const [formErrors, setFormErrors] = useState<string[]>([]);

  const currentEventFormData = useMemo(
    () => ({
      banner: currentEventData?.images?.banner,
      additional: currentEventData?.images?.additional ?? [],
    }),
    [currentEventData?.images?.additional, currentEventData?.images?.banner],
  );

  const [selectedFormData, setSelectedFormData] =
    useState(currentEventFormData);
  const hasEdited = !_.isEqual(selectedFormData, currentEventFormData);

  const selectedAdditionalImages = useMemo(() => {
    const addImages = selectedFormData.additional;
    if (!addImages) {
      return [""];
    }
    if (addImages.length < 5) {
      return [...selectedFormData.additional, ""];
    }
    return addImages;
  }, [selectedFormData]);

  const updateImages = trpc.events.updateImages.useMutation();

  useEffect(() => {
    if (updateImages.status === "success") {
      dataRefetch();
    }
  }, [updateImages.status, dataRefetch]);

  useEffect(() => {
    setSelectedFormData(currentEventFormData);
  }, [currentEventFormData]);

  const width = Dimensions.get("window").width;

  return (
    <ScrollViewSheetWithHeader header="Edit">
      <View className="flex-col items-center space-y-10 py-5">
        {formErrors.length > 0 && (
          <View className="w-full flex-col">
            <View className="mx-4 space-y-2 rounded-lg bg-slate-200 p-4">
              {formErrors.map((error) => (
                <Text key={error} className="text-lg text-red-500">
                  {error}
                </Text>
              ))}
            </View>
          </View>
        )}

        <View className="w-full flex-col space-y-2">
          <Text className="mx-5 text-lg">Banner image (tap to change):</Text>
          <UploadableEventImage
            eventId={eventId}
            imgIdKey={selectedFormData.banner}
            alt={`Banner image`}
            unsetImageText="Add Banner Image"
            selectNewOnSelected={true}
            onImageUploaded={(imgKeyId: string) => {
              setSelectedFormData((prev) => {
                return {
                  ...prev,
                  banner: imgKeyId,
                };
              });
            }}
          />
        </View>

        <View className="w-full flex-col space-y-2">
          <Text className="mx-5 text-lg">Additional images:</Text>
          <View className="items-center">
            <EventImageCarousel
              width={width}
              eventId={eventId}
              imgIdKeys={selectedAdditionalImages}
              renderItem={({ index, item }) => {
                return (
                  <UploadableEventImage
                    eventId={eventId}
                    imgIdKey={item}
                    alt={`Additional image ${index}`}
                    unsetImageText="Add Additional Image"
                    onClosePress={() => {
                      setSelectedFormData((prev) => {
                        const newAdditional = [...prev.additional];
                        newAdditional.splice(index, 1);
                        return {
                          ...prev,
                          additional: newAdditional,
                        };
                      });
                    }}
                    onImageUploaded={(imgKeyId: string) => {
                      setSelectedFormData((prev) => {
                        const newAdditional = [...prev.additional];
                        newAdditional[index] = imgKeyId;
                        return {
                          ...prev,
                          additional: newAdditional,
                        };
                      });
                    }}
                  />
                );
              }}
            />
          </View>
        </View>

        <View className="w-full">
          <ReviewSaveNextFormButtons
            eventId={eventId}
            savedEnabled={hasEdited}
            onPressSave={() => {
              if (!hasEdited) {
                return;
              }
              setFormErrors([]);
              updateImages.mutate({
                eventId,
                bannerImageId: selectedFormData.banner,
                additionalImageIds: selectedFormData.additional,
              });
            }}
            onPressNext={() => {
              navManageEventEditReview(eventId);
            }}
          />
        </View>
      </View>
    </ScrollViewSheetWithHeader>
  );
};
