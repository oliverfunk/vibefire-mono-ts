import { type PropsWithChildren } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type SummaryHeaderProps = {
  headerTitle: string;
  headerButtonText?: string;
  onHeaderButtonPress: () => void;
};

const HeaderRow = (props: SummaryHeaderProps) => {
  const { headerTitle, headerButtonText = "Add", onHeaderButtonPress } = props;
  return (
    <View className="flex-row items-center">
      <Text className="flex-1 text-xl font-bold text-white">{headerTitle}</Text>
      <TouchableOpacity onPress={onHeaderButtonPress}>
        <Text className="text-center text-sm font-bold text-white">
          <FontAwesome name="plus" size={15} color="white" />
          {"\n"}
          {headerButtonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const SummaryComponent = ({
  headerTitle,
  headerButtonText,
  onHeaderButtonPress,
  children,
}: PropsWithChildren<SummaryHeaderProps>) => {
  return (
    <View className="flex-col space-y-2">
      <HeaderRow
        headerTitle={headerTitle}
        headerButtonText={headerButtonText}
        onHeaderButtonPress={onHeaderButtonPress}
      />
      <View>{children}</View>
    </View>
  );
};
