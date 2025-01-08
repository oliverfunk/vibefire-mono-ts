import { useCallback, useMemo } from "react";
import { View } from "react-native";

import { useItemSeparator } from "!/c/misc/ItemSeparator";

export type SimpleListProps<T extends object> = {
  items: T[];
  itemRenderer: (item: T) => React.ReactNode;
  noItemsComponent?: React.ReactNode;
  ItemSeparatorComponent?: React.ComponentType;
};

const useListItemRenderer = <T extends object>(
  itemRenderer: SimpleListProps<T>["itemRenderer"],
  ItemSeparatorComponent?: React.ComponentType,
) => {
  return useCallback(
    ({ item, index, length }: { item: T; index: number; length: number }) => (
      <View key={index}>
        {index !== 0 && index < length && ItemSeparatorComponent && (
          <ItemSeparatorComponent />
        )}
        {itemRenderer(item)}
      </View>
    ),
    [ItemSeparatorComponent, itemRenderer],
  );
};

export const SimpleList = <T extends object>(props: SimpleListProps<T>) => {
  const { items, itemRenderer, noItemsComponent, ItemSeparatorComponent } =
    props;

  const listItemRenderer = useListItemRenderer(
    itemRenderer,
    ItemSeparatorComponent,
  );

  const renderedItems = useMemo(() => {
    return items.map((item, index) =>
      listItemRenderer({ item, index, length: items.length }),
    );
  }, [items, listItemRenderer]);

  return renderedItems.length > 0 ? renderedItems : noItemsComponent;
};
