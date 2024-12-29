import { TouchableOpacity, TouchableOpacityProps } from "react-native";

export const PillTouchableOpacity = (props: TouchableOpacityProps) => {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-center rounded-full border-2 border-white p-2 px-6"
      {...props}
    >
      {props.children}
    </TouchableOpacity>
  );
};
