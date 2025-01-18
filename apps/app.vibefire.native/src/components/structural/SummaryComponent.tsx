import { type PropsWithChildren } from "react";
import { TouchableOpacity, View, type ViewProps } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { TextL, TextS } from "!/c/atomic/text";
import { ContC } from "!/c/atomic/view";

type SummaryHeaderProps = {
  headerMainComponent?: React.ReactNode;
  headerTitle?: string;
  headerButtonText?: string;
  onHeaderButtonPress: () => void;
};

const HeaderRow = (props: SummaryHeaderProps & ViewProps) => {
  const {
    headerMainComponent,
    headerTitle,
    headerButtonText = "Add",
    onHeaderButtonPress,
  } = props;
  return (
    <View className="flex-row items-center" {...props}>
      {headerMainComponent ? (
        headerMainComponent
      ) : (
        <TextL className="flex-1 font-bold">{headerTitle}</TextL>
      )}
      <TouchableOpacity onPress={onHeaderButtonPress}>
        <TextS className="text-center font-bold">
          <FontAwesome name="plus" size={15} color="white" />
          {"\n"}
          {headerButtonText}
        </TextS>
      </TouchableOpacity>
    </View>
  );
};

export const SummaryComponent = (
  props: PropsWithChildren<SummaryHeaderProps>,
) => {
  const { children } = props;
  return (
    <ContC>
      <HeaderRow {...props} />
      <View>{children}</View>
    </ContC>
  );
};
