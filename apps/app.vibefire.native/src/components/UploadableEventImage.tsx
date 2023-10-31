import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { type ImageProps } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { set } from "lodash";
import { DateTime } from "luxon";
import { type PartialDeep } from "type-fest";

import { type VibefireEventT } from "@vibefire/models";

import { EventImage } from "~/components/EventImage";
import { EventImageCarousel } from "~/components/EventImageCarousel";
import { trpc } from "~/apis/trpc-client";

const selectImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 4],
    quality: 0.9,
  });

  if (result.canceled || !result.assets) {
    return undefined;
  }

  return result.assets[0];
};

const uploadImage = async (
  pickedImage: ImagePicker.ImagePickerAsset,
  uploadURL: string,
  uploadedFileName: string,
) => {
  const pickRes = await fetch(pickedImage.uri);
  const ct = pickRes.headers.get("content-type");

  const formdata = new FormData();
  formdata.append("file", {
    uri: pickedImage.uri,
    name: uploadedFileName,
    type: ct,
  });

  return await fetch(uploadURL, {
    method: "POST",
    body: formdata,
  });
};

type UploadableEventImageProps = {
  eventId: string;
  alt: ImageProps["alt"];
  selectNewOnSelected?: boolean;
  unsetImageText?: string;
  imgIdKey?: string;
  rounded?: boolean;
  onImageUploaded: (imgKeyId: string) => void;
  onClosePress?: () => void;
};

export const UploadableEventImage = (props: UploadableEventImageProps) => {
  const {
    eventId,
    alt,
    selectNewOnSelected,
    unsetImageText,
    imgIdKey,
    rounded,
    onImageUploaded,
    onClosePress,
  } = props;

  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const getImageUploadLink = trpc.events.getImageUploadLink.useMutation();

  useEffect(() => {
    if (getImageUploadLink.status === "loading") {
      setLoading(true);
      setHasError(false);
    }
    if (getImageUploadLink.status === "error") {
      setHasError(true);
      setLoading(false);
    }
    if (getImageUploadLink.status === "success") {
      const { id, uploadURL } = getImageUploadLink.data;

      const selectImageAndUpload = async (
        uploadURL: string,
        uploadedFileName: string,
      ) => {
        const pickedImage = await selectImage();
        if (!pickedImage) {
          return;
        }

        const res = await uploadImage(pickedImage, uploadURL, uploadedFileName);

        if (!res.ok) {
          console.error(JSON.stringify(res, null, 2));
          setHasError(true);
          setLoading(false);
          return;
        }

        onImageUploaded(id);
        setLoading(false);
      };

      selectImageAndUpload(uploadURL, id).catch(console.error);
    }
  }, [getImageUploadLink.status]);

  if (loading) {
    return (
      <View className="aspect-[4/4] w-full flex-col items-center justify-center bg-black">
        <ActivityIndicator size="small" color="#ffffff" />
      </View>
    );
  }

  if (hasError) {
    return (
      <Pressable
        className="aspect-[4/4] w-full flex-col items-center justify-center bg-black"
        onPress={() => {
          getImageUploadLink.mutate({
            eventId,
          });
        }}
      >
        <FontAwesome name="image" size={20} color="red" />
        <Text className="text-center text-lg text-white">
          Upload Failed, try again...
        </Text>
      </Pressable>
    );
  }

  if (!imgIdKey) {
    return (
      <Pressable
        className="aspect-[4/4] w-full flex-col items-center justify-center bg-slate-200"
        onPress={() => {
          getImageUploadLink.mutate({
            eventId,
          });
        }}
      >
        <FontAwesome name="image" size={20} color="black" />
        <Text className="text-center text-lg text-black">
          {unsetImageText ?? "Add Image"}
        </Text>
      </Pressable>
    );
  }
  return (
    <View className="relative items-center">
      <Pressable
        onPress={
          selectNewOnSelected
            ? () => {
                getImageUploadLink.mutate({
                  eventId,
                });
              }
            : undefined
        }
      >
        <EventImage
          eventId={eventId}
          imgIdKey={imgIdKey}
          alt={alt}
          rounded={rounded}
        />
      </Pressable>
      {onClosePress && (
        <TouchableOpacity
          className="absolute right-2 top-2 h-7 w-7 items-center justify-center rounded-full bg-black/50"
          onPress={onClosePress}
        >
          <FontAwesome name="close" size={20} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};
