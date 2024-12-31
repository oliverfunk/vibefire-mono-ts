import { Text, TextProps } from "react-native";

import { type TModelVibefireAccess } from "@vibefire/models";

// todo: make work for all access types
export const AccessShareabilityText = (
  props: {
    accessRef: TModelVibefireAccess;
  } & TextProps,
) => {
  const { accessRef } = props;

  const isPublic = accessRef.type == "public";
  const isOpen = accessRef.type == "open";

  if (isPublic) {
    return (
      <Text className="text-base text-white" {...props}>
        This event is <Text className="text-green-400">public</Text>.{"\n"}
      </Text>
    );
  }

  if (isOpen) {
    return (
      <Text className="text-base text-white" {...props}>
        This event is <Text className="text-green-400">private</Text> and{" "}
        <Text className="text-green-400">open</Text>.{"\n"}
        Anyone that has joined can share.
      </Text>
    );
  }

  return (
    <Text className="text-base text-white" {...props}>
      This event is <Text className="text-green-400">private</Text> and{" "}
      <Text className="text-green-400">invite only</Text>.{"\n"}
      Only managers can share.
    </Text>
  );
};
