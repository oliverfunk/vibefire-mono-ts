import {
  Pressable,
  Text,
  View,
  type GestureResponderEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { type DateTime } from "luxon";

import { EventImage, StandardImage } from "./EventImage";

type EventCardProps = {
  eventInfo: {
    title: string;
    orgName: string;
    orgProfileImgURL: string;
    addressDescription: string;
    timeStart: DateTime;
    timeEnd?: DateTime;
    bannerImgKey: string;
  };
  onPress: (event: GestureResponderEvent) => void;
};

export const EventCard = ({ eventInfo: event, onPress }: EventCardProps) => {
  return (
    <Pressable className="relative mb-[20px] items-center" onPress={onPress}>
      <EventImage
        rounded={true}
        vfImgKey={event.bannerImgKey}
        alt="Event Banner"
      />

      <LinearGradient
        className="absolute left-0 top-0 w-full flex-row items-center rounded-t-xl p-2"
        colors={["rgba(50, 40, 40, 1)", "rgba(0,0,0,0)"]}
        locations={[0, 1]}
      >
        <StandardImage
          cn="h-10 w-10 rounded-full border-2 border-black"
          source={event.orgProfileImgURL}
          alt="Event Organizer Profile Picture"
        />
        <Text className="ml-2 text-lg text-white">{event.orgName}</Text>
      </LinearGradient>

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
            {event.timeStart.toFormat("LLL d, T")}
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

        <Text className="text-base text-white">{event.addressDescription}</Text>
      </LinearGradient>
    </Pressable>
  );
};
