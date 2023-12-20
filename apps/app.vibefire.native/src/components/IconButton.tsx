import { Pressable } from "react-native";

export const IconButton = (props: {
  icon: React.ReactNode;
  onPress: () => void;
  cn?: string;
}) => {
  return (
    <Pressable
      className={`h-10 w-10 items-center justify-center rounded-full border ${props.cn}`}
      onPress={props.onPress}
    >
      {props.icon}
    </Pressable>
  );
};
