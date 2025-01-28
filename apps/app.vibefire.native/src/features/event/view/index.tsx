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
import {
  EventActionsBar,
  OpenInMapsModalMenu,
} from "!/components/event/EventActionBar";
import { EventImageCarousel } from "!/components/event/EventImageCarousel";
import {
  EventInfoAddressDescBar,
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
import { navEditEvent, navHomeWithCollapse } from "!/nav";

import { EventDetailWidgetView } from "./EventDetailWidgetView";

const ViewEventSheet = (props: {
  event: TModelVibefireEvent;
  membership?: TModelVibefireMembership;
  shareCode?: string;
  refreshEvent: () => void;
}) => {
  const { event, membership, shareCode, refreshEvent } = props;

  const router = useRouter();

  // muts
  const blockAndReportOrganiserMut =
    trpc.user.blockAndReportOrganiser.useMutation();
  const hideEventMut = trpc.user.hideEvent.useMutation({});
  const joinAccessMut = trpc.access.joinAccess.useMutation();
  const leaveAccessMut = trpc.access.leaveAccess.useMutation();

  // muts

  const onShareEvent = useShareEventLink(event.id, membership?.shareCode);

  const { width, height } = useWindowDimensions();

  const bannerImgKeys = event.images.bannerImgKeys;
  const details = event.details;
  const managedByUser =
    membership?.roleType === "manager" || membership?.roleType === "owner";

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
      <View className="flex-col space-y-4 bg-black p-4">
        <OrganiserBarView
          ownerRef={event.accessRef.ownerRef}
          membership={membership}
          onBlockAndReportOrganiserPress={() => {
            blockAndReportOrganiserMut.mutate({
              ownershipRefId: event.accessRef.ownerRef.id,
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
            if (event.accessRef.ownerRef.ownerType === "group") {
              console.log("todo: nav to group");
            }
          }}
          onEditPress={() => {
            navEditEvent(router, event.id);
          }}
          leaveJoinDisabled={managedByUser}
          leaveJoinLoading={joinAccessMut.isPending || leaveAccessMut.isPending}
          onJoinPress={async () => {
            const joinRes = await joinAccessMut.mutateAsync({
              accessId: event.accessRef.id,
              shareCode,
            });
            refreshEvent();
          }}
          onLeavePress={async () => {
            const leavRes = await leaveAccessMut.mutateAsync({
              accessId: event.accessRef.id,
            });
            refreshEvent();
          }}
        />
        <EventActionsBar
          location={event.location}
          times={event.times}
          hideShareButton={
            event.accessRef.accessType === "invite" &&
            membership?.roleType !== "manager"
          }
          onShareEvent={onShareEvent}
        />
        <AccessShareabilityText accessRef={event.accessRef} />
      </View>

      {/* infos */}
      <LinearRedOrangeView className="flex-col p-0.5">
        <View className="flex-col space-y-4 rounded-md bg-black p-3.5">
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
            <EventInfoAddressDescBar
              event={event}
              noAddressDescText="(location)"
            />
          </TouchableOpacity>
        </View>
      </LinearRedOrangeView>

      {/* map */}
      <OpenInMapsModalMenu location={event.location} times={event.times}>
        <View className="aspect-[4/4] py-1">
          <LocationDisplayMap
            eventId={event.id}
            markerPosition={event.location.position}
          />
        </View>
      </OpenInMapsModalMenu>

      {/* details */}
      {details.length != 0 && (
        <View className="flex-col space-y-4 p-4">
          {details.map((detail, index) => (
            <View key={index} className="">
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

    const [viewManage, viewManageCtl] = trpc.events.viewManage.useSuspenseQuery(
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
        refreshEvent={async () => {
          await viewManageCtl.refetch();
        }}
        membership={membership ?? undefined}
        shareCode={props.shareCode}
      />
    );
  },
);

export const ViewEventPublishedSheet = withSuspenseErrorBoundarySheet(
  (props: ViewEventProps) => {
    const { eventId, shareCode } = props;

    const [viewPublished, viewPublishedCtl] =
      trpc.events.viewPublished.useSuspenseQuery(
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
        refreshEvent={async () => {
          await viewPublishedCtl.refetch();
        }}
      />
    );
  },
);
