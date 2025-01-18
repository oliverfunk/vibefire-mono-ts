import { Text, type TextProps } from "react-native";

type TextBProps = { disabled?: boolean } & TextProps;

export const TextSS = (props: TextBProps) => {
  return (
    <Text
      className={`text-xs ${props.disabled ? "text-[#909090FF]" : "text-white"}`}
      {...props}
    >
      {props.children}
    </Text>
  );
};

export const TextS = (props: TextBProps) => {
  return (
    <Text
      className={`text-sm ${props.disabled ? "text-[#909090FF]" : "text-white"}`}
      {...props}
    >
      {props.children}
    </Text>
  );
};

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
      className={`text-2xl font-bold ${props.disabled ? "text-[#909090FF]" : "text-white"}`}
      {...props}
    >
      {props.children}
    </Text>
  );
};
