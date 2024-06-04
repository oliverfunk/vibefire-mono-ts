import React from "react";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { trpc } from "!/api/trpc-client";

import { VibefireImage } from "!/components/image/VibefireImage";
import { ScrollViewSheet } from "!/components/misc/sheet-utils";
import {
  ErrorDisplay,
  LoadingDisplay,
  withSuspenseErrorBoundary,
} from "!/c/misc/SuspenseWithError";

export const GroupSheet = (props: { groupLinkID: string }) => {
  const { groupLinkID } = props;
  const GroupViewSuspense = withSuspenseErrorBoundary(
    () => {
      const [group] = trpc.groups.byLinkID.useSuspenseQuery({
        linkId: groupLinkID,
      });
      return (
        <ScrollViewSheet>
          {/* Header */}
          <View className="relative">
            {/* Background image */}
            <VibefireImage imgIdKey={group.bannerImgKey} alt="Group Banner" />

            <LinearGradient
              className="absolute bottom-0 w-full items-center justify-center pt-2"
              colors={["rgba(0,0,0,0)", "rgba(0, 0, 0, 0.9)"]}
              locations={[0, 1]}
            >
              <Text className="text-center text-2xl text-white">
                {group.name}
              </Text>
            </LinearGradient>
          </View>
        </ScrollViewSheet>
      );
    },
    {
      ErrorFallback: ({ error, resetErrorBoundary }) => (
        <View className="p-5">
          <ErrorDisplay
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            error={error}
            resetErrorBoundary={resetErrorBoundary}
            textWhite={true}
          />
        </View>
      ),
      LoadingFallback: (
        <View className="p-5">
          <LoadingDisplay loadingWhite={true} />
        </View>
      ),
    },
  );

  return <GroupViewSuspense />;
};
