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
    border = false,
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
    <Pressable className={classNameStr} onPress={onPress}>
      {children}
    </Pressable>
  );
};
