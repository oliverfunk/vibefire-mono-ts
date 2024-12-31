import { View, type ViewProps } from "react-native";

export const ContN = (props: ViewProps) => {
  return (
    <View className="p-4" {...props}>
      {props.children}
    </View>
  );
};

export const ContR = (props: ViewProps) => {
  return (
    <View className="flex-row items-center space-x-2" {...props}>
      {props.children}
    </View>
  );
};

export const ContC = (props: ViewProps) => {
  return (
    <View className="flex-col items-center space-y-2" {...props}>
      {props.children}
    </View>
  );
};

export const BContN = (props: ViewProps) => {
  return <ContN className="rounded-2xl bg-black p-4" {...props} />;
};

export const BContR = (props: ViewProps) => {
  return <ContR className="rounded-2xl bg-black p-4" {...props} />;
};

export const BContC = (props: ViewProps) => {
  return <ContC className="rounded-2xl bg-black p-4" {...props} />;
};
