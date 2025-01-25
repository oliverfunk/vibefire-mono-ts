import {
  Pressable,
  TouchableOpacity,
  type PressableProps,
  type TouchableOpacityProps,
} from "react-native";

export const PillTouchableOpacity = (props: TouchableOpacityProps) => {
  return (
    <TouchableOpacity
      {...props}
      className="flex-row items-center justify-center rounded-full border-2 border-white p-2 px-6"
    >
      {props.children}
    </TouchableOpacity>
  );
};

export const PillPressable = (props: PressableProps) => {
  return (
    <Pressable
      {...props}
      className="flex-row items-center justify-center rounded-full border-2 border-white p-2 px-6"
    >
      {props.children}
    </Pressable>
  );
};
