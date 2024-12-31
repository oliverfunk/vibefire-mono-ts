import { Text, type TextProps } from "react-native";

type TextBProps = { disabled?: boolean } & TextProps;

export const TextB = (props: TextBProps) => {
  return (
    <Text
      className={`text-base ${props.disabled ? "text-[#909090FF]" : "text-white"}`}
      {...props}
    >
      {props.children}
    </Text>
  );
};

export const TextL = (props: TextProps) => {
  return (
    <Text
      className={`text-lg ${props.disabled ? "text-[#909090FF]" : "text-white"}`}
      {...props}
    >
      {props.children}
    </Text>
  );
};

export const TextLL = (props: TextProps) => {
  return (
    <Text
      className={`text-2xl ${props.disabled ? "text-[#909090FF]" : "text-white"}`}
      {...props}
    >
      {props.children}
    </Text>
  );
};
