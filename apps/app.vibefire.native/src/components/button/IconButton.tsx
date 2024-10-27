import { type ReactNode } from "react";
import {
  Pressable,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export const IconButton = (props: {
  children: ReactNode;
  onPress: () => void;
  size?: number;
  circular?: boolean;
  border?: boolean;
  useOpacity?: boolean;
  cn?: string;
  style?: StyleProp<ViewStyle>;
}) => {
  const {
    children,
    onPress,
    size = 10,
    circular = true,
    border = false,
    useOpacity = false,
    cn,
    style,
  } = props;

  const classNames = ["flex items-center justify-center"];

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
      <TouchableOpacity
        style={[
          {
            width: size * 4,
            height: size * 4,
          },
          style,
        ]}
        className={classNames.join(" ")}
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <Pressable
      style={[
        {
          width: size * 4,
          height: size * 4,
        },
        style,
      ]}
      className={classNames.join(" ")}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};
