import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import {
  type TModelVibefireEvent,
  type TModelVibefireMembership,
} from "@vibefire/models";

import { trpc } from "!/api/trpc-client";
import { useShareEventLink } from "!/hooks/useShareEventLink";

import { AccessShareabilityText } from "!/components/AccessShareablityText";
import { EventActionsBar } from "!/components/event/EventActionBar";
import { EventImageCarousel } from "!/components/event/EventImageCarousel";
import {
  EventInfoAddressBar,
  EventInfoTimesBar,
} from "!/components/event/EventInfoBars";
import { VibefireImage } from "!/components/image/VibefireImage";
import { LocationDisplayMap } from "!/components/map/LocationDisplayMap";
import {
  ErrorSheet,
  LinearRedOrangeView,
  ScrollViewSheet,
} from "!/components/misc/sheet-utils";
import { withSuspenseErrorBoundarySheet } from "!/components/misc/SuspenseWithError";
import { OrganiserBarView } from "!/components/OrganiserBarView";
import { userAtom } from "!/atoms";
import { navEditEvent, navHomeWithCollapse, navHomeWithExpand } from "!/nav";

import { EventDetailWidgetView } from "./EventDetailWidgetView";

const ViewEventSheet = (props: {
  event: TModelVibefireEvent;
  membership?: TModelVibefireMembership;
  shareCode?: string;
}) => {
  const { event, membership, shareCode } = props;

  const router = useRouter();

  // muts
  const blockAndReportOrganiserMut =
    trpc.user.blockAndReportOrganiser.useMutation();
  const hideEventMut = trpc.user.hideEvent.useMutation({});
  const joinAccessMut = trpc.access.joinAccess.useMutation();
  const leaveAccessMut = trpc.access.leaveAccess.useMutation();
  const userMembershipQ = trpc.access.userMembership.useQuery({
    accessId: event.accessRef.id,
  });
  // muts

  const onShareEvent = useShareEventLink(event.id, membership?.shareCode);

  const { width, height } = useWindowDimensions();

  const userMembership =
    (userMembershipQ.data?.ok && userMembershipQ.data.value) || membership;

  const bannerImgKeys = event.images.bannerImgKeys;
  const details = event.details;
  const managedByUser = userMembership?.roleType === "manager";

  return (
    <ScrollViewSheet>
      {/* image, title header */}
      <View className="relative">
        {/* Background image */}
        {bannerImgKeys.length === 1 ? (
          <VibefireImage imgIdKey={bannerImgKeys[0]} alt="Event Banner" />
        ) : (
          <EventImageCarousel imgIdKeys={bannerImgKeys} width={width} />
        )}

        <LinearGradient
          className="absolute bottom-0 w-full px-4 pt-2"
          colors={["rgba(0,0,0,0)", "rgba(0, 0, 0, 0.8)"]}
          locations={[0, 1]}
        >
          <Text className="py-2 text-center text-2xl text-white">
            {event.name}
          </Text>
        </LinearGradient>
      </View>

      {/* black bars */}
      <OrganiserBarView
        ownerRef={event.ownerRef}
        membership={userMembership}
        onBlockAndReportOrganiserPress={() => {
          blockAndReportOrganiserMut.mutate({
            ownershipRefId: event.ownerRef.id,
          });
          navHomeWithCollapse(router);
        }}
        onHidePress={() => {
          hideEventMut.mutate({
            eventId: event.id,
          });
          navHomeWithCollapse(router);
        }}
        onOrganiserPress={() => {
          if (event.ownerRef.ownerType === "group") {
            console.log("todo: nav to group");
          }
        }}
        onEditPress={() => {
          navEditEvent(router, event.id);
        }}
        leaveJoinDisabled={managedByUser}
        leaveJoinLoading={joinAccessMut.isPending || leaveAccessMut.isPending}
        onJoinPress={async () => {
          await joinAccessMut.mutateAsync({
            accessId: event.accessRef.id,
            shareCode,
          });
          await userMembershipQ.refetch();
        }}
        onLeavePress={async () => {
          await leaveAccessMut.mutateAsync({
            accessId: event.accessRef.id,
          });
          await userMembershipQ.refetch();
          navHomeWithCollapse(router);
        }}
      />
      <EventActionsBar
        location={event.location}
        hideShareButton={
          event.accessRef.type === "invite" &&
          membership?.roleType !== "manager"
        }
        onShareEvent={onShareEvent}
      />
      <View className="bg-black p-4">
        <AccessShareabilityText accessRef={event.accessRef} />
      </View>

      {/* {!selectedDateDT.hasSame(
          ntzToDateTime(event.times.ntzStart),
          "day",
        ) && (
          <View className="items-center pt-2">
            <TouchableOpacity
              className="flex-col items-center justify-between rounded-lg bg-white px-4 py-2"
              onPress={onGoToEvent}
            >
              <FontAwesome5 name="clock" size={20} color="black" />
              <Text className="text-sm text-black">
                Go to event time and place
              </Text>
            </TouchableOpacity>
          </View>
        )} */}

      {/* infos */}
      <LinearRedOrangeView className="flex-col p-0.5">
        <View className="flex-col space-y-4 rounded-md bg-neutral-900 p-3.5">
          <View>
            <EventInfoTimesBar noStartTimeText="(start time)" event={event} />
          </View>
          <TouchableOpacity
            onPress={async () => {
              await Clipboard.setStringAsync(event.location.addressDescription);
              Toast.show({
                type: "success",
                text1: "Address copied",
                position: "top",
                topOffset: height / 10,
                visibilityTime: 1000,
              });
            }}
          >
            <EventInfoAddressBar event={event} noAddressText="(location)" />
          </TouchableOpacity>
        </View>
      </LinearRedOrangeView>

      {/* map */}
      <View className="aspect-[4/4] pt-1">
        <LocationDisplayMap markerPosition={event.location.position} />
      </View>

      {/* details */}
      {details.length != 0 && (
        <View className="flex-col space-y-4 p-4">
          {details.map((detail, index) => (
            <View key={index}>
              <EventDetailWidgetView detail={detail} />
            </View>
          ))}
        </View>
      )}
    </ScrollViewSheet>
  );
};

type ViewEventProps = { eventId: string; shareCode?: string };

// should merge em I think

export const ViewEventPreviewSheet = withSuspenseErrorBoundarySheet(
  (props: ViewEventProps) => {
    const { eventId } = props;

    const [viewManage] = trpc.events.viewManage.useSuspenseQuery(
      {
        eventId,
      },
      {
        gcTime: 1000,
      },
    );

    if (!viewManage.ok) {
      throw viewManage.error;
    }

    const { event, membership } = viewManage.value;

    return (
      <ViewEventSheet
        event={event}
        membership={membership ?? undefined}
        shareCode={props.shareCode}
      />
    );
  },
);

export const ViewEventPublishedSheet = withSuspenseErrorBoundarySheet(
  (props: ViewEventProps) => {
    const { eventId, shareCode } = props;

    const [viewPublished] = trpc.events.viewPublished.useSuspenseQuery(
      {
        eventId,
        shareCode,
      },
      {
        gcTime: 1000,
      },
    );

    if (!viewPublished.ok) {
      if (viewPublished.error.code === "not_published") {
        return <ErrorSheet message={viewPublished.error.message} />;
      }
      throw viewPublished.error;
    }

    const { event, membership } = viewPublished.value;

    return (
      <ViewEventSheet
        event={event}
        membership={membership ?? undefined}
        shareCode={props.shareCode}
      />
    );
  },
);
