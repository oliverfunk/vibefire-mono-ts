import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  type GestureResponderEvent,
} from "react-native";
import { Image } from "expo-image";
import { DateTime } from "luxon";

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
      <View className="border-t bg-white">
        <View className="ml-2 mt-2 flex flex-row items-center">
          <Image
            className="h-10 w-10 rounded-full"
            source={event.orgProfileImgURL}
            placeholder={blurhash}
            contentFit="cover"
            transition={1000}
          />
          <Text className="ml-2 text-lg text-black dark:text-white">
            {event.orgName}
          </Text>
        </View>
        <View className="relative my-1 items-center bg-black">
          <Image
            className="aspect-[3/2] w-full"
            source={event.bannerImgURL}
            placeholder={blurhash}
            contentFit="cover"
            transition={1000}
          />
        </View>
        <View className="mx-2 mb-2 flex flex-row">
          <View className="flex-[4] justify-evenly">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">
              {event.title}
            </Text>
            <Text className="text-gray-700 dark:text-gray-400">
              {event.addressDescription}
            </Text>
          </View>
          <View className="flex-[1] items-center justify-evenly">
            <Text className="">
              {event.timeStart.toLocaleString(DateTime.TIME_SIMPLE)}
            </Text>
            <Text className="">
              {event.timeEnd.toLocaleString(DateTime.TIME_SIMPLE)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
