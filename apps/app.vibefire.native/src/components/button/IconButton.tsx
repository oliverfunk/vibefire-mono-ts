import { type ReactNode } from "react";
import { Pressable, TouchableOpacity } from "react-native";

export const IconButton = (props: {
  children: ReactNode;
  onPress: () => void;
  size?: number;
  circular?: boolean;
  border?: boolean;
  useOpacity?: boolean;
  cn?: string;
}) => {
  const {
    children,
    onPress,
    size = 10,
    circular = true,
    border = true,
    useOpacity = false,
    cn,
  } = props;

  const classNameStr = `flex h-${size} w-${size} items-center justify-center ${circular && "rounded-full"} ${border && "border"} ${cn}`;

  if (useOpacity) {
    return (
      <TouchableOpacity className={classNameStr} onPress={onPress}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <Pressable
      className={classNameStr}
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.0 : 1,
        backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
      })}
    >
      {children}
    </Pressable>
  );
};
