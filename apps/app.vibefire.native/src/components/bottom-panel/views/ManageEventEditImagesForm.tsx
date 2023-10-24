import { useEffect, useMemo, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import _ from "lodash";
import { type PartialDeep } from "type-fest";

import { type VibefireEventT } from "@vibefire/models";

import { EventImage } from "~/components/EventImage";
import { EventImageCarousel } from "~/components/EventImageCarousel";
import { vfImgUrlDebug } from "~/apis/base-urls";
import { trpc } from "~/apis/trpc-client";
import { navManageEventEditReview } from "~/nav";
import {
  LinearRedOrangeView,
  ReviewSaveNextFormButtons,
  ScrollViewSheet,
  ScrollViewSheetWithHeader,
} from "../_shared";

const selectImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    base64: true,
  });

  if (result.canceled || !result.assets) {
    return undefined;
  }

  const b64 = result.assets[0].base64;
  if (!b64) {
    return undefined;
  }
  return b64;
};

export const ManageEventEditImagesForm = (props: {
  eventId: string;
  currentEventData: PartialDeep<VibefireEventT> | undefined;
  dataRefetch: () => void;
}) => {
  const { eventId, currentEventData, dataRefetch } = props;

  const [formErrors, setFormErrors] = useState<string[]>([]);

  const currentEventFormData = useMemo(
    () => ({
      banner: vfImgUrlDebug(currentEventData?.images?.banner),
      additional:
        currentEventData?.images?.additional?.map(
          (imgKey) => vfImgUrlDebug(imgKey)!,
        ) ?? [],
    }),
    [currentEventData],
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

  const uploadBannerImage = trpc.events.uploadBannerImage.useMutation();
  const uploadAdditionalImage = trpc.events.uploadAdditionalImage.useMutation();
  const removeAdditionalImage = trpc.events.removeAdditionalImage.useMutation();

  useEffect(() => {
    if (uploadBannerImage.status === "success") {
      dataRefetch();
    }
  }, [uploadBannerImage.status, dataRefetch]);
  useEffect(() => {
    if (uploadAdditionalImage.status === "success") {
      dataRefetch();
    }
  }, [uploadAdditionalImage.status, dataRefetch]);
  useEffect(() => {
    if (removeAdditionalImage.status === "success") {
      dataRefetch();
    }
  }, [removeAdditionalImage.status, dataRefetch]);

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
          {selectedFormData.banner ? (
            <TouchableOpacity
              onPress={async () => {
                const img_b64 = await selectImage();
                if (!img_b64) {
                  return;
                }
                uploadBannerImage.mutate({
                  eventId,
                  b64_image: img_b64,
                });
              }}
            >
              <EventImage
                vfImgKey={selectedFormData.banner}
                alt="Event Banner"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="aspect-[4/4] w-full items-center justify-center bg-slate-200"
              onPress={async () => {
                const img_b64 = await selectImage();
                if (!img_b64) {
                  return;
                }
                uploadBannerImage.mutate({
                  eventId,
                  b64_image: img_b64,
                });
              }}
            >
              <Text className="text-center text-lg text-black">
                Add banner image
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="w-full flex-col space-y-2">
          <Text className="mx-5 text-lg">Additional images:</Text>
          <View className="items-center">
            <EventImageCarousel
              width={width}
              vfImgKeys={selectedAdditionalImages}
              renderItem={({ index, item }) => {
                if (item === "") {
                  return (
                    <TouchableOpacity
                      className="aspect-[4/4] w-full items-center justify-center bg-slate-200"
                      onPress={async () => {
                        const img_b64 = await selectImage();
                        if (!img_b64) {
                          return;
                        }

                        uploadAdditionalImage.mutate({
                          eventId,
                          b64_image: img_b64,
                        });
                      }}
                    >
                      <Text className="text-center text-lg text-black">
                        Add additional image
                      </Text>
                    </TouchableOpacity>
                  );
                }
                return (
                  <View className="relative items-center">
                    <EventImage
                      vfImgKey={item}
                      alt={`Additional Image ${index}`}
                    />
                    <TouchableOpacity
                      className="absolute right-2 top-2 h-7 w-7 items-center justify-center rounded-full bg-black/50"
                      onPress={() => {
                        const imgKey =
                          currentEventData?.images?.additional?.at(index);
                        if (!imgKey) {
                          return;
                        }
                        removeAdditionalImage.mutate({
                          eventId,
                          additionalImageKey: imgKey,
                        });
                      }}
                    >
                      <FontAwesome name="close" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
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
              // updateImages.mutate({
              //   eventId,
              // });
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
