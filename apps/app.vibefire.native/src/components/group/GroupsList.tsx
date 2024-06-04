import { useCallback, useMemo } from "react";
import { Text, View, type ListRenderItemInfo } from "react-native";

import { type VibefireGroupT } from "@vibefire/models";

import { useSortedGroupsByUpdated } from "!/hooks/useSortedByTime";

import { GroupCard } from "!/c/group/GroupCard";
import { GroupChip } from "!/c/group/GroupChip";
import { SimpleList } from "!/c/list/SimpleList";
import { FlatListViewSheet } from "!/c/misc/sheet-utils";

const useGroupCardRenderer = (
  onPress: (groupId: string, group: VibefireGroupT) => void,
) => {
  return useCallback(
    ({ item: group }: ListRenderItemInfo<VibefireGroupT>) => (
      <GroupCard
        group={group}
        onPress={() => {
          onPress(group.id, group);
        }}
      />
    ),
    [onPress],
  );
};

const useItemSeparator = () => {
  return useCallback(() => {
    return <View className="h-2" />;
  }, []);
};

const useNoGroupsText = (noGroupsMessage?: string) => {
  return useMemo(() => {
    return (
      <View className="h-[30vh] items-center justify-center">
        <Text className="text-lg font-bold text-black">
          {noGroupsMessage ? noGroupsMessage : "No groups yet."}
        </Text>
      </View>
    );
  }, [noGroupsMessage]);
};

type GroupsListProps = {
  groups: VibefireGroupT[];
  onGroupPress: (groupId: string, group: VibefireGroupT) => void;
  noGroupsMessage?: string;
  sortAsc?: boolean;
  listTitle?: string;
};

export const GroupsList = ({
  groups,
  onGroupPress,
  listTitle,
  noGroupsMessage,
  sortAsc = false,
}: GroupsListProps) => {
  const sortedGroups = useSortedGroupsByUpdated(groups, { sortAsc });

  const noGroupsText = useNoGroupsText(noGroupsMessage);
  const renderGroupCard = useGroupCardRenderer(onGroupPress);

  const header = useMemo(() => {
    return <Text className="text-2xl font-bold text-black">{listTitle}</Text>;
  }, [listTitle]);

  const itemSep = useItemSeparator();

  return (
    <FlatListViewSheet
      data={sortedGroups}
      ListEmptyComponent={noGroupsText}
      ListHeaderComponent={listTitle ? header : undefined}
      ItemSeparatorComponent={itemSep}
      contentContainerStyle={{ padding: 5 }}
      renderItem={renderGroupCard}
      keyExtractor={(item) => item.id}
    />
  );
};

type GroupsListSimpleChipProps = {
  groups: VibefireGroupT[];
  onPress: (groupLinkId: string) => void;
  noGroupsMessage?: string;
  latestFirst?: boolean;
  limit?: number;
};

export const GroupsListSimpleChipView = ({
  groups,
  onPress,
  noGroupsMessage,
  latestFirst = false,
  limit = 4,
}: GroupsListSimpleChipProps) => {
  const sortedGroups = useSortedGroupsByUpdated(groups, {
    sortAsc: !latestFirst,
    sliceCount: limit,
  });

  const noGroupsText = useNoGroupsText(noGroupsMessage);
  const groupChipRenderer = useCallback(
    (group: VibefireGroupT) => (
      <GroupChip
        groupLinkId={group.linkId}
        groupInfo={{
          name: group.name,
          bannerImgKey: group.bannerImgKey,
          dateUpdatedUTC: group.dateUpdatedUTC,
          notifications: 5,
        }}
        onPress={onPress}
      />
    ),
    [onPress],
  );

  return (
    <SimpleList
      items={sortedGroups}
      itemRenderer={groupChipRenderer}
      noItemsComponent={noGroupsText}
      styleOpts={{ separatorHeight: 4 }}
    />
  );
};
