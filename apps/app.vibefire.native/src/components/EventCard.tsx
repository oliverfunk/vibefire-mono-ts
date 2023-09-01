import {
  Pressable,
  Text,
  View,
  type GestureResponderEvent,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { type DateTime } from "luxon";

type EventCardProps = {
  event: {
    bannerImgURL: string;
    title: string;
    orgName: string;
    orgProfileImgURL: string;
    addressDescription: string;
    timeStart: DateTime;
    timeEnd: DateTime;
  };
  onPress: (event: GestureResponderEvent) => void;
};

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export const EventCard = ({ event, onPress }: EventCardProps) => {
  return (
    <Pressable onPress={onPress}>
      <View className="rounded-xl border-b-[20px]">
        <View className="relative items-center">
          <Image
            className="aspect-[4/3] w-full rounded-xl"
            source={event.bannerImgURL}
            alt="Event Banner"
            cachePolicy={"memory"}
            placeholder={blurhash}
            contentFit="cover"
            transition={1000}
          />

          <LinearGradient
            className="absolute left-0 top-0 flex w-full flex-row items-center rounded-t-xl p-2"
            colors={["rgba(50, 40, 40, 1)", "rgba(0,0,0,0)"]}
            locations={[0, 1]}
          >
            <Image
              className="h-10 w-10 rounded-full border-2 border-black"
              source={event.orgProfileImgURL}
              alt="Event Organizer Profile Picture"
              cachePolicy={"memory"}
              placeholder={blurhash}
              contentFit="cover"
              transition={1000}
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
              Really really
            </Text>

            <View className="flex flex-row">
              <Text className="text-base text-yellow-400">
                {event.timeStart.toFormat("LLL d, T")}
              </Text>
              <Text className="text-base text-white"> - </Text>
              <Text className="text-base text-yellow-400">
                {event.timeEnd.toFormat("LLL d, T")}
              </Text>
            </View>

            <Text className="text-base text-white">
              {event.addressDescription}
            </Text>
          </LinearGradient>
        </View>
      </View>
    </Pressable>
  );
};
