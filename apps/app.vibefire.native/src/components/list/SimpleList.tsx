import { useCallback, useMemo } from "react";
import { View } from "react-native";

import { useItemSeparator } from "!/components/misc/ItemSeparator";

export type SimpleListProps<T extends object> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  noItemsComponent?: React.ReactNode;
  options: {
    separatorHeight: number | undefined;
  };
};

const useListItemRenderer = <T extends object>(
  renderItem: SimpleListProps<T>["renderItem"],
  separatorHeight: SimpleListProps<T>["options"]["separatorHeight"],
) => {
  const ItemSeparator = useItemSeparator(separatorHeight);
  return useCallback(
    ({ item, index, length }: { item: T; index: number; length: number }) => (
      <View key={index}>
        {index !== 0 && index < length && separatorHeight && <ItemSeparator />}
        {renderItem(item)}
      </View>
    ),
    [ItemSeparator, renderItem, separatorHeight],
  );
};

export const SimpleList = <T extends object>(props: SimpleListProps<T>) => {
  const { items, renderItem, noItemsComponent, options } = props;

  const listItemRenderer = useListItemRenderer(
    renderItem,
    options.separatorHeight,
  );

  const renderedItems = useMemo(() => {
    return items.map((item, index) =>
      listItemRenderer({ item, index, length: items.length }),
    );
  }, [items, listItemRenderer]);

  return renderedItems.length > 0 ? renderedItems : noItemsComponent;
};
