import { View, type ViewProps } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAtom } from "jotai";

import { mapDisplayableEventsAtom } from "@vibefire/shared-state";

import { TextB } from "!/components/atomic/text";
import { ContR } from "!/components/atomic/view";
import { PillTouchableOpacity } from "!/components/button/PillTouchableOpacity";
import {
  EventCardFlashListViewSheet,
  EventsSimpleListCardView,
} from "!/components/event/EventsList";
import {
  SheetScrollViewGradient,
  SheetScrollViewGradientVF,
} from "!/components/layouts/SheetScrollViewGradientVF";
import { useItemSeparator } from "!/components/misc/ItemSeparator";
import { VibefireLogoName } from "!/components/VibefireBottomLogo";
import { navProfile, navViewEvent } from "!/nav";

const TopProfileButton = (props: ViewProps) => {
  const router = useRouter();
  return (
    <View {...props}>
      <PillTouchableOpacity
        className="flex-row items-center space-x-1 self-end bg-black"
        onPress={() => {
          navProfile(router);
        }}
      >
        <FontAwesome6 name="user-circle" size={17} color="white" />
        <TextB>Profile</TextB>
        <FontAwesome6 name="chevron-right" size={15} color="white" />
      </PillTouchableOpacity>
    </View>
  );
};

export const GeoQueryListSheet = () => {
  const [mapDisplayableEvents] = useAtom(mapDisplayableEventsAtom);
  const router = useRouter();

  const itemSep = useItemSeparator(2);

  if (mapDisplayableEvents.length <= 3) {
    return (
      <SheetScrollViewGradientVF>
        <TopProfileButton />
        <View>
          <EventsSimpleListCardView
            showStatus={false}
            events={mapDisplayableEvents}
            limit={4}
            onItemPress={(event) => {
              navViewEvent(router, event.id!);
            }}
            ItemSeparatorComponent={itemSep}
          />
        </View>
      </SheetScrollViewGradientVF>
    );
  }

  return (
    <SheetScrollViewGradient>
      <TopProfileButton />
      <View>
        <EventCardFlashListViewSheet
          events={mapDisplayableEvents}
          ItemSeparatorComponent={itemSep}
          ListFooterComponent={
            <View className="pt-4">
              <VibefireLogoName />
            </View>
          }
          onEventPress={(event) => {
            navViewEvent(router, event.id!);
          }}
        />
      </View>
    </SheetScrollViewGradient>
  );
};
