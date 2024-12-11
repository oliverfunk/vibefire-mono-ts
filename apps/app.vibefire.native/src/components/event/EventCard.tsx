import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { type DateTime } from "luxon";

import {
  type TModelVibefireEvent,
  type TModelVibefireOwnership,
} from "@vibefire/models";

import { IconButton } from "!/c/button/IconButton";
import { VibefireImage } from "!/c/image/VibefireImage";

type EventCardProps = {
  state?: TModelVibefireEvent["state"];
  eventInfo: {
    title: string;
    ownerType: TModelVibefireOwnership["ownerType"];
    ownerName: TModelVibefireOwnership["ownerName"];
    addressDescription?: string;
    timeStart?: DateTime;
    timeEnd?: DateTime;
    bannerImgKey?: string;
  };
  onPress: () => void;
  onCrossPress?: () => void;
  showStatusBanner?: boolean;
};

export const EventCard = ({
  state,
  eventInfo: event,
  onPress,
  onCrossPress,
  showStatusBanner = false,
}: EventCardProps) => {
  return (
    <Pressable className="relative mb-[20px] items-center" onPress={onPress}>
      <VibefireImage
        imgIdKey={event.bannerImgKey}
        rounded={true}
        alt="Event Banner"
      />

      {showStatusBanner && state !== undefined && (
        <View className="absolute top-[50%] w-full flex-row items-center justify-center bg-black/50 py-5">
          <Text className="text-2xl font-bold text-white">
            {state === -1
              ? "Draft"
              : state === 0
                ? "Ready to publish"
                : state === 1
                  ? "Published"
                  : "Archived"}
          </Text>
        </View>
      )}

      <LinearGradient
        className="absolute left-0 top-0 w-full flex-row items-center rounded-t-xl p-2"
        colors={["rgba(50, 40, 40, 1)", "rgba(0,0,0,0)"]}
        locations={[0, 1]}
      >
        {event.ownerType === "group" ? (
          <View className="h-10 w-10 flex-none items-center justify-center rounded-full border-2 border-white bg-black/80">
            <Text className="text-lg text-white">
              {event.ownerName.at(0)!.toUpperCase()}
              {"."}
            </Text>
          </View>
        ) : (
          // <StandardImage
          //   cn="h-10 w-10 flex-none items-center justify-center rounded-full border-2 border-white"
          //   contentFit="cover"
          //   source={}
          //   alt="Event Organizer Profile Picture"
          // />
          <View className="h-10 w-10 flex-none items-center justify-center rounded-full border-2 border-white bg-black/80">
            <Text className="text-lg text-white">
              {event.ownerName.at(0)!.toUpperCase()}
              {"."}
            </Text>
          </View>
        )}
        <Text className="ml-2 text-lg text-white">{event.ownerName}</Text>
      </LinearGradient>

      {onCrossPress && (
        <View className="absolute right-[2%] top-[2%]">
          <IconButton
            onPress={() => {
              onCrossPress();
            }}
            cn="bg-black/80"
          >
            <FontAwesome name="close" size={15} color="white" />
          </IconButton>
        </View>
      )}

      <LinearGradient
        className="absolute bottom-[-20px] left-0 w-full rounded-b-xl p-2 pt-4"
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,1)"]}
        locations={[0, 0.8]}
      >
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className="text-2xl font-bold text-white"
        >
          {event.title}
        </Text>

        <View className="flex-row">
          <Text className="text-base text-yellow-400">
            {event.timeStart
              ? event.timeStart.toFormat("LLL d, T")
              : "<Start Time>"}
          </Text>
          {event.timeEnd && (
            <>
              <Text className="text-base text-white"> - </Text>
              <Text className="text-base text-yellow-400">
                {event.timeEnd.toFormat("LLL d, T")}
              </Text>
            </>
          )}
        </View>

        <Text className="text-base text-white">
          {event.addressDescription ?? "<Address>"}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};
