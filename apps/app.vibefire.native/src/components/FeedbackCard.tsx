import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { FormTextInput } from "./utils/sheet-utils";

const _FeedbackCard = () => {
  const [_enableFeedback, setEnableFeedback] = useState(false);

  const [feedback, setFeedback] = useState("");

  return (
    <View className="flex-col items-center space-y-5 overflow-hidden rounded-lg bg-black px-2 py-10">
      <Text className="text-center text-lg text-white">
        Vibefire is in open beta and we&apos;d love to hear your feedback.
      </Text>
      <View className="w-full flex-col space-y-2">
        <FormTextInput
          placeholder="Your feedback"
          value={feedback}
          onChangeText={setFeedback}
        />
        <TouchableOpacity
          className="overflow-hidden rounded-lg border bg-green-400 px-4 py-2"
          onPress={() => {
            setEnableFeedback((prev) => !prev);
          }}
        >
          <Text className="text-center text-xl text-white">Send</Text>
        </TouchableOpacity>
        {/* If you have any features or ideas, please let us know */}
      </View>
      <TouchableOpacity
        className="rounded-lg border border-white  px-4 py-2"
        onPress={() => {
          setEnableFeedback((prev) => !prev);
        }}
      >
        <Text className="text-xl text-white">Give feedback</Text>
      </TouchableOpacity>
    </View>
  );
};
