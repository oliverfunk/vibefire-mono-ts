import { useEffect, useMemo } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { DateTime } from "luxon";
import { type PartialDeep } from "type-fest";

import { type CoordT, type VibefireEventT } from "@vibefire/models";

import { EventImage } from "~/components/EventImage";
import { LocationSelectionMap } from "~/components/LocationSelectionMap";
import { vfImgUrlDebug } from "~/apis/base-urls";
import { trpc } from "~/apis/trpc-client";
import {
  navManageEvent,
  navManageEventEditDescription,
  navManageEventEditImages,
  navManageEventEditLocation,
  navManageEventEditTimes,
} from "~/nav";
import { LinearRedOrangeView, ScrollViewSheet } from "../_shared";

export const ManageEventEditReview = (props: {
  eventId: string;
  currentEventData: PartialDeep<VibefireEventT> | undefined;
  dataRefetch: () => void;
}) => {
  const { eventId, currentEventData, dataRefetch } = props;

  const width = Dimensions.get("window").width;

  const readyState: "draft" | "now-ready" | "already-ready" = useMemo(() => {
    const isReady =
      currentEventData?.title &&
      currentEventData?.description &&
      currentEventData?.location?.position &&
      currentEventData?.location?.addressDescription &&
      currentEventData?.timeZone &&
      currentEventData?.timeStartIsoNTZ &&
      currentEventData?.images?.banner;
    if (!isReady) {
      return "draft";
    }
    if (currentEventData.state === "draft") {
      return "now-ready";
    }
    return "already-ready";
  }, [currentEventData]);

  const setReadyMut = trpc.events.setReady.useMutation();

  useEffect(() => {
    if (setReadyMut.status === "success") {
      dataRefetch();
      navManageEvent(eventId);
    }
  }, [setReadyMut.status, dataRefetch, eventId]);

  return (
    <ScrollViewSheet>
      <View className="mt-5 flex h-full flex-col items-center space-y-10">
        {/* Heading */}
        <LinearRedOrangeView className="flex-row p-4">
          <View className="w-full bg-black p-4">
            <Text className="text-center text-2xl font-bold text-white">
              Review
            </Text>
          </View>
        </LinearRedOrangeView>
        {/* Form */}

        {/* Descriptions */}
        <View className="w-full flex-col space-y-5">
          <View className="flex-col">
            <Text className="mx-5 text-lg">Event title</Text>
            <View className="mx-4 rounded-lg bg-slate-200">
              <Text className="ml-4 py-2 text-2xl">
                {currentEventData?.title ?? "No title set"}
              </Text>
            </View>
          </View>

          <View className="flex-col">
            <Text className="mx-5 text-lg">Event description</Text>
            <View className="mx-4 rounded-lg bg-slate-200">
              <Text className="ml-4 py-2 text-lg">
                {currentEventData?.description ?? "No description set"}
              </Text>
            </View>
          </View>

          <View className="items-center">
            <TouchableOpacity
              className="w-min items-center rounded-lg bg-black px-4 py-2"
              onPress={() => {
                navManageEventEditDescription(eventId);
              }}
            >
              <Text className="text-xl text-white">Edit Descriptions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Location */}
        <View className="w-full flex-col space-y-5">
          {/* For some reason, spacing isn't working */}
          <View className="mb-5 h-[300] flex-col">
            <Text className="mx-5 text-lg">Event location</Text>
            <View className="mx-4 border-2 border-slate-200">
              <LocationSelectionMap
                currentSelectedPosition={
                  (currentEventData?.location?.position as CoordT) ?? undefined
                }
                fixed={true}
              />
            </View>
          </View>

          <View className="flex-col">
            <Text className="mx-5 text-lg">Address description</Text>
            <View className="mx-4 rounded-lg bg-slate-200">
              <Text className="ml-4 py-2 text-lg">
                {currentEventData?.location?.addressDescription ??
                  "No address set"}
              </Text>
            </View>
          </View>

          <View className="items-center">
            <TouchableOpacity
              className="w-min items-center rounded-lg bg-black px-4 py-2"
              onPress={() => {
                navManageEventEditLocation(eventId);
              }}
            >
              <Text className="text-xl text-white">Edit Location</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Times */}
        <View className="w-full flex-col space-y-5">
          <View className="flex-col ">
            <View className="mx-4 flex-row items-center justify-center rounded-lg border py-2">
              <Text className="text-lg">
                Time zone: {currentEventData?.timeZone ?? "Not set"}
              </Text>
            </View>
          </View>

          <View className="flex-col">
            <Text className="mx-5 text-lg">Starting time</Text>
            {currentEventData?.timeStartIsoNTZ ? (
              <View className="mx-4 flex-row items-center py-2">
                <View className="rounded-lg bg-slate-200 px-4 py-1">
                  <Text className="text-lg text-black">
                    {DateTime.fromISO(currentEventData?.timeStartIsoNTZ, {
                      zone: "utc",
                    }).toLocaleString(DateTime.DATE_MED)}
                  </Text>
                </View>
                <View className="w-3" />
                <View className="rounded-lg bg-slate-200 px-4 py-1">
                  <Text className="text-lg text-black">
                    {DateTime.fromISO(currentEventData?.timeStartIsoNTZ, {
                      zone: "utc",
                    }).toLocaleString(DateTime.TIME_SIMPLE)}
                  </Text>
                </View>
              </View>
            ) : (
              <View className="mx-4 rounded-lg bg-slate-200">
                <Text className="ml-4 py-2 text-lg">No starting time set</Text>
              </View>
            )}
          </View>

          <View className="flex-col">
            <Text className="mx-5 text-lg">Ending time</Text>
            {currentEventData?.timeEndIsoNTZ ? (
              <View className="mx-4 flex-row items-center py-2">
                <View className="rounded-lg bg-slate-200 px-4 py-1">
                  <Text className="text-lg text-black">
                    {DateTime.fromISO(currentEventData?.timeEndIsoNTZ, {
                      zone: "utc",
                    }).toLocaleString(DateTime.DATE_MED)}
                  </Text>
                </View>
                <View className="w-3" />
                <View className="rounded-lg bg-slate-200 px-4 py-1">
                  <Text className="text-lg text-black">
                    {DateTime.fromISO(currentEventData?.timeEndIsoNTZ, {
                      zone: "utc",
                    }).toLocaleString(DateTime.TIME_SIMPLE)}
                  </Text>
                </View>
              </View>
            ) : (
              <View className="mx-4 rounded-lg bg-slate-200">
                <Text className="ml-4 py-2 text-lg">No ending time set</Text>
              </View>
            )}
          </View>

          <View className="items-center">
            <TouchableOpacity
              className="w-min items-center rounded-lg bg-black px-4 py-2"
              onPress={() => {
                navManageEventEditTimes(eventId);
              }}
            >
              <Text className="text-xl text-white">Edit Times</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Images */}
        <View className="w-full flex-col space-y-5">
          <View className="flex-col">
            <Text className="mx-5 text-lg">Banner image</Text>
            {currentEventData?.images?.banner ? (
              <EventImage
                vfImgKey={currentEventData?.images?.banner}
                alt="Event Banner"
              />
            ) : (
              <View className="mx-4 items-center rounded-lg bg-slate-200 py-2">
                <Text className="text-center text-lg text-black">
                  No banner image set
                </Text>
              </View>
            )}
          </View>

          <View className="flex-col">
            <Text className="mx-5 text-lg">Additional images</Text>
            {currentEventData?.images?.additional &&
            currentEventData?.images?.additional.length > 0 ? (
              <View className="items-center">
                <Carousel
                  width={width}
                  height={width}
                  loop={false}
                  defaultIndex={0}
                  panGestureHandlerProps={{
                    activeOffsetX: [-10, 10],
                  }}
                  data={currentEventData?.images?.additional}
                  renderItem={({ index, item: addImgKey }) => {
                    return (
                      <EventImage
                        vfImgKey={addImgKey}
                        alt={`Additional Image ${index}`}
                      />
                    );
                  }}
                />
              </View>
            ) : (
              <View className="mx-4 rounded-lg bg-slate-200 py-2">
                <Text className="text-center text-lg text-black">
                  No additional images set
                </Text>
              </View>
            )}
          </View>

          <View className="items-center">
            <TouchableOpacity
              className="w-min items-center rounded-lg bg-black px-4 py-2"
              onPress={() => {
                navManageEventEditImages(eventId);
              }}
            >
              <Text className="text-xl text-white">Edit Images</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="w-full flex-col items-center space-y-5 bg-black px-5 py-5">
          <Text className="text-xl text-white">
            {(readyState === "draft" &&
              "Get your event ready by setting a title and description, the location and starting time and adding a banner image.") ||
              (readyState === "now-ready" &&
                "Your event is now ready! Hit the button below to take you the management screen where you can share or invite friends, add to the timeline, publish the event and more.") ||
              (readyState === "already-ready" &&
                "Go back to the management screen")}
          </Text>

          {(readyState === "draft" && (
            <TouchableOpacity className="w-min items-center rounded-lg bg-gray-300 px-6 py-4">
              <Text className="text-2xl text-white">Ready</Text>
            </TouchableOpacity>
          )) ||
            (readyState === "now-ready" && (
              <TouchableOpacity
                className="w-min items-center rounded-lg bg-green-400 px-6 py-4"
                onPress={() => {
                  // set the event ready
                  setReadyMut.mutate({ eventId });
                }}
              >
                <Text className="text-2xl text-black">Ready</Text>
              </TouchableOpacity>
            )) ||
            (readyState === "already-ready" && (
              <TouchableOpacity
                className="w-min items-center rounded-lg bg-orange-400 px-6 py-4"
                onPress={() => {
                  navManageEvent(eventId);
                }}
              >
                <Text className="text-2xl text-white">Manage</Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>
    </ScrollViewSheet>
  );
};
