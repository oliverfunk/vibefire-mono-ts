import { useCallback } from "react";
import { View } from "react-native";

export const useItemSeparator = (twHeight: number | undefined = undefined) => {
  return useCallback(() => {
    return <ItemSeparator twHeight={twHeight} />;
  }, [twHeight]);
};

export const ItemSeparator = (props: { twHeight?: number }) => {
  const { twHeight = 2 } = props;
  return <View style={{ height: twHeight * 4 }} />;
};
