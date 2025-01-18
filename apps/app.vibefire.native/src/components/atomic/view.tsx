import { View, type ViewProps } from "react-native";

export const DivLineH = (props: ViewProps) => {
  return <View className="h-[1] w-full bg-white" {...props} />;
};

export const ContN = (props: ViewProps) => {
  return (
    <View className="flex p-4" {...props}>
      {props.children}
    </View>
  );
};

export const ContR = (props: ViewProps) => {
  return (
    <View className="flex-row space-x-4" {...props}>
      {props.children}
    </View>
  );
};

export const ContC = (props: ViewProps) => {
  return (
    <View className="flex-col space-y-4" {...props}>
      {props.children}
    </View>
  );
};

export const BContN = (props: ViewProps) => {
  return <View className="rounded-2xl bg-black p-4" {...props} />;
};

export const BContR = (props: ViewProps) => {
  return <ContR className="items-center rounded-2xl bg-black p-4" {...props} />;
};

export const BContC = (props: ViewProps) => {
  return <ContC className="items-center rounded-2xl bg-black p-4" {...props} />;
};
