import React, { memo, useCallback, useState } from "react";
import {
  Pressable,
  View,
  type NativeSyntheticEvent,
  type TextInputChangeEventData,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
  BottomSheetTextInput,
  useBottomSheet,
  type BottomSheetHandleProps,
} from "@gorhom/bottom-sheet";
import { useAtom } from "jotai";
import { styled } from "nativewind";

import { profileSelectedAtom } from "~/atoms";

export const SEARCH_HANDLE_HEIGHT = 75;

const StyledBottomSheetTextInput = styled(BottomSheetTextInput);

interface SearchHandleProps extends BottomSheetHandleProps {
  initialValue?: string;
  onChange?: (text: string) => void;
}

const SearchHandleComponent = ({
  initialValue = "",
  onChange,
}: SearchHandleProps) => {
  // state
  const [profileSelected, setProfileSelected] = useAtom(profileSelectedAtom);
  const [value, setValue] = useState(initialValue);
  const { expand } = useBottomSheet();

  // callbacks
  const handleInputChange = useCallback(
    ({
      nativeEvent: { text },
    }: NativeSyntheticEvent<TextInputChangeEventData>) => {
      setValue(text);

      if (onChange) {
        onChange(text);
      }
    },
    [onChange],
  );

  // render
  return (
    <View className="py-3">
      <View className="h-1 w-1/12 self-center rounded-full bg-gray-400" />
      <View className="mx-4 mt-2 flex flex-row justify-center space-x-2">
        {/* Search bar */}
        <StyledBottomSheetTextInput
          className="h-10 grow rounded-full bg-gray-200 p-2 pl-4"
          style={{
            fontSize: 16,
          }}
          value={value}
          textContentType="location"
          placeholderTextColor="rgba(0, 10, 10, 1)"
          placeholder="Search for a place"
          onChange={handleInputChange}
        />
        {/* Profile button */}
        <Pressable
          className={`h-10 w-10 items-center justify-center rounded-full border ${
            profileSelected ? "bg-black" : "bg-white"
          }`}
          onPress={() => {
            const showProfile = !profileSelected;
            setProfileSelected(showProfile);
            if (showProfile) {
              expand();
            }
          }}
        >
          {profileSelected ? (
            <FontAwesome name="close" size={20} color="white" />
          ) : (
            <FontAwesome5 name="user-alt" size={20} color="black" />
          )}
        </Pressable>
      </View>
    </View>
  );
};

export const SearchHandle = memo(SearchHandleComponent);
