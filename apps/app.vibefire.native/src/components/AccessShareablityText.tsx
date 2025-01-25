import { Text, type TextProps } from "react-native";

import { type TModelVibefireAccess } from "@vibefire/models";

import { TextB } from "./atomic/text";

export const AccessShareabilityText = (
  props: {
    accessRef: TModelVibefireAccess;
  } & TextProps,
) => {
  const { accessRef } = props;

  const isPublic = accessRef.accessType == "public";
  const isOpen = accessRef.accessType == "open";

  if (isPublic) {
    return (
      <TextB {...props}>
        This event is <Text className="text-green-400">public</Text>.
      </TextB>
    );
  }

  if (isOpen) {
    return (
      <TextB {...props}>
        This event is <Text className="text-green-400">private</Text> and{" "}
        <Text className="text-green-400">open</Text>.{"\n"}
        Anyone that has joined can share.
      </TextB>
    );
  }

  return (
    <TextB {...props}>
      This event is <Text className="text-green-400">private</Text> and{" "}
      <Text className="text-green-400">invite only</Text>.{"\n"}
      Only managers can share.
    </TextB>
  );
};
