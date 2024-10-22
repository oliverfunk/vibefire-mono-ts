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

  const classNames = ["flex items-center justify-center"];

  if (size) {
    classNames.push(`w-${size} h-${size}`);
  }
  if (circular) {
    classNames.push("rounded-full");
  }
  if (border) {
    classNames.push("border");
  }
  if (cn) {
    classNames.push(cn);
  }

  if (useOpacity) {
    return (
      <TouchableOpacity className={classNames.join(" ")} onPress={onPress}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <Pressable className={classNames.join(" ")} onPress={onPress}>
      {children}
    </Pressable>
  );
};
