import { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAtom, useSetAtom } from "jotai";

import { type VibefireUserT } from "@vibefire/models";
import {
  mapPositionDateEventsQueryResultAtom,
  upcomingEventsQueryResultAtom,
} from "@vibefire/shared-state";

import { ContinueWithApple } from "~/components/auth/ContinueWithApple";
import { ContinueWithFacebook } from "~/components/auth/ContinueWithFacebook";
import { ContinueWithGoogle } from "~/components/auth/ContinueWithGoogle";
import { SignOut } from "~/components/auth/SignOut";
import { EventsListWithSections } from "~/components/event/EventList";
import { VibefireIconImage } from "~/components/VibefireIconImage";
import { userAtom, userSessionRetryAtom } from "~/atoms";
import { navCreateEvent, navOwnEventsByOrganiser, navViewEvent } from "~/nav";
import { QrScanner } from "../qr-scanner";
import {
  FormTextInput,
  LinearRedOrangeView,
  LoadingSheet,
  ScrollViewSheet,
} from "./_shared";

const _FeedbackCard = () => {
  const [_enableFeedback, setEnableFeedback] = useState(false);

  const [feedback, setFeedback] = useState("");

  return (
    <View className="flex-col items-center space-y-5 overflow-hidden rounded-lg bg-black px-2 py-10">
      <Text className="text-center text-lg text-white">
        Vibefire is in open beta and we&apos;d love to hear your feedback.
      </Text>
      <View className="w-full flex-col space-y-2">
        <FormTextInput
          placeholder="Your feedback"
          value={feedback}
          onChangeText={setFeedback}
        />
        <TouchableOpacity
          className="overflow-hidden rounded-lg border bg-green-400 px-4 py-2"
          onPress={() => {
            setEnableFeedback((prev) => !prev);
          }}
        >
          <Text className="text-center text-xl text-white">Send</Text>
        </TouchableOpacity>
        {/* If you have any features or ideas, please let us know */}
      </View>
      <TouchableOpacity
        className="rounded-lg border border-white  px-4 py-2"
        onPress={() => {
          setEnableFeedback((prev) => !prev);
        }}
      >
        <Text className="text-xl text-white">Give feedback</Text>
      </TouchableOpacity>
    </View>
  );
};

const _Profile = () => {
  const [user] = useAtom(userAtom);
  const setUserSessionRetry = useSetAtom(userSessionRetryAtom);

  switch (user.state) {
    case "loading":
      return <LoadingSheet />;
    case "error":
      return (
        <ScrollViewSheet>
          <View className="mt-5 flex h-full flex-col items-center space-y-5">
            <FontAwesome5 name="user-alt" size={150} color="black" />
            <View className="flex-col items-center space-y-2">
              <Text>There was an issue loading your account</Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity
                className="rounded-lg border px-4 py-2"
                onPress={() => {
                  setUserSessionRetry((prev) => !prev);
                }}
              >
                <Text className="text-xl text-blue-500">Retry</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollViewSheet>
      );
    case "unauthenticated":
      return (
        <ScrollViewSheet>
          <View className="flex h-full flex-col items-center space-y-10 py-10">
            <FontAwesome5 name="user-alt" size={150} />
            <View className="mx-10 flex-row">
              <Text className="text-center">
                Sign in to create private events, get invites and share events
                with friends, filter and follow events and organisations.
              </Text>
            </View>
            <View className="flex-col space-y-4">
              <View>
                <ContinueWithGoogle />
              </View>
              <View>
                <ContinueWithFacebook />
              </View>
              {Platform.OS === "ios" && (
                <View>
                  <ContinueWithApple />
                </View>
              )}
            </View>
          </View>
        </ScrollViewSheet>
      );
    case "authenticated":
      const userInfo = user.userInfo as VibefireUserT;

      return (
        <ScrollViewSheet>
          <View className="flex-col items-center space-y-10 py-5">
            {/* Name */}
            <View className="flex-col items-center justify-center space-y-2 pt-5">
              <View className="rounded-lg bg-black p-4">
                <Text className="text-2xl text-white">{userInfo.name}</Text>
              </View>
            </View>

            <View className="w-full flex-col items-center space-y-2 px-4">
              <View className="w-full flex-col">
                <Text className="ml-4">Email</Text>
                <View className="rounded-lg bg-slate-200 py-2">
                  {userInfo.contactEmail ? (
                    <Text className="ml-4">{userInfo.contactEmail}</Text>
                  ) : (
                    <TouchableOpacity onPress={async () => {}}>
                      <Text className="ml-4">Tap to add email</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* <View className="w-full flex-col">
                <Text className="ml-4">Phone number</Text>
                <View className="rounded-lg bg-slate-200 py-2">
                  {userInfo.phoneNumber ? (
                    <Text className="ml-4">{userInfo.phoneNumber}</Text>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        console.log("prepareSecondFactor");
                        // Prepare the second factor verification by
                        // specifying the phone code strategy. An SMS
                        // message with a one-time code will be sent
                        // to the user's verified phone number.
                      }}
                    >
                      <Text className="ml-4">Tap to add phone number</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View> */}
            </View>

            <View className="w-full px-2">
              <LinearRedOrangeView className="flex-col space-y-10 overflow-hidden rounded-lg px-2 py-10">
                <Text className="text-center text-xl text-white">
                  View your previous events or create new ones from here
                </Text>
                <View className="flex-row items-center justify-around">
                  <TouchableOpacity
                    className="rounded-lg bg-black px-4 py-4"
                    onPress={() => {
                      navCreateEvent();
                    }}
                  >
                    <Text className="text-lg font-bold text-white">
                      Create event
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="rounded-lg bg-black px-4 py-4"
                    onPress={() => {
                      navOwnEventsByOrganiser();
                    }}
                  >
                    <Text className="text-lg font-bold text-white">
                      Your events
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearRedOrangeView>
            </View>

            {/* <View className="w-full px-2">
              <FeedbackCard />
            </View> */}

            <View>
              <VibefireIconImage />
            </View>

            <View className="flex-row">
              <SignOut />
            </View>
          </View>
        </ScrollViewSheet>
      );
  }
};

const _EventsList = () => {
  const [upcomingEvents] = useAtom(upcomingEventsQueryResultAtom);
  const [mapPosDateEvents] = useAtom(mapPositionDateEventsQueryResultAtom);

  return (
    <View className="flex-1">
      <EventsListWithSections
        events={mapPosDateEvents}
        upcomingEvents={upcomingEvents}
        onEventPress={(_eventId, event) => {
          navViewEvent(event.linkId!);
        }}
      />
    </View>
  );
};

export const EventsListAndProfile = (props: { profileSelected?: boolean }) => {
  const { profileSelected } = props;

  if (profileSelected) {
    return <_Profile />;
  }

  return <_EventsList />;
};
