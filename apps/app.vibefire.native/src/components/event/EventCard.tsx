import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6 } from "@expo/vector-icons";

import {
  type TModelVibefireEvent,
  type TModelVibefireOwnership,
} from "@vibefire/models";
import { type PartialDeep } from "@vibefire/utils";

import { VibefireImage } from "!/c/image/VibefireImage";
import { OrganiserBarView } from "!/c/OrganiserBarView";

import { EventInfoAddressDescBar, EventInfoTimesBar } from "./EventInfoBars";

export const EventCard = (props: {
  event: PartialDeep<TModelVibefireEvent>;
  onPress: () => void;
  showStatus?: boolean;
}) => {
  const { event, onPress, showStatus = false } = props;
  return (
    <Pressable
      className="relative items-center overflow-hidden rounded-2xl bg-black"
      onPress={onPress}
    >
      <VibefireImage
        imgIdKey={event?.images?.bannerImgKeys?.[0]}
        alt="Event Banner"
      />

      {/* top */}
      <LinearGradient
        className="absolute left-0 top-0 w-full flex-row p-4"
        colors={["rgba(0, 0, 0, 1)", "rgba(0,0,0,0)"]}
        locations={[0, 1]}
      >
        <View className="flex-1">
          <OrganiserBarView
            ownerRef={event.accessRef?.ownerRef}
            showLeaveJoin={false}
            showThreeDots={false}
          />
        </View>
        {showStatus &&
          (event.state === 1 ? (
            <FontAwesome6 name="eye" size={15} color="white" />
          ) : (
            <FontAwesome6 name="eye-slash" size={15} color="red" />
          ))}
      </LinearGradient>

      {/* bottom */}
      <LinearGradient
        className="absolute bottom-0 left-0 w-full flex-col space-y-0 p-4"
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,1)"]}
        locations={[0, 0.8]}
      >
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className="text-2xl font-bold text-white"
        >
          {event.name}
        </Text>
        <EventInfoTimesBar
          event={event}
          iconSize={15}
          noStartTimeText="(start time)"
        />
        <EventInfoAddressDescBar
          event={event}
          iconSize={15}
          noAddressDescText="(location)"
        />
      </LinearGradient>
    </Pressable>
  );
};
