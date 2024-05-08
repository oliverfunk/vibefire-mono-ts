import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { type ImageProps } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";

import { trpc } from "!/api/trpc-client";

import { VibefireImage } from "!/c/image/VibefireImage";

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
  pickedImageUri: string,
  uploadURL: string,
  uploadedFileName: string,
) => {
  const pickRes = await fetch(pickedImageUri);
  const ct = pickRes.headers.get("content-type");

  const formdata = new FormData();
  formdata.append("file", {
    uri: pickedImageUri,
    name: uploadedFileName,
    type: ct,
  });

  return await fetch(uploadURL, {
    method: "POST",
    body: formdata,
  });
};

type UploadableVibefireImageProps = {
  eventId: string;
  alt: ImageProps["alt"];
  selectNewOnPressed?: boolean;
  unsetImageText?: string;
  imgIdKey?: string;
  rounded?: boolean;
  onImageUploaded: (imgKeyId: string) => void;
  onClosePress?: () => void;
};

export const UploadableVibefireImage = (
  props: UploadableVibefireImageProps,
) => {
  const {
    eventId,
    alt,
    selectNewOnPressed,
    unsetImageText,
    imgIdKey,
    rounded,
    onImageUploaded,
    onClosePress,
  } = props;

  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [pickedImageUri, setPickedImageUri] = useState("");

  const getImageUploadLink = trpc.events.createImageUploadLink.useMutation();

  useEffect(() => {
    if (getImageUploadLink.isIdle) {
      setLoading(false);
      setHasError(false);
    }
    if (getImageUploadLink.isPending) {
      setLoading(true);
      setHasError(false);
    }
    if (getImageUploadLink.isError) {
      setHasError(true);
      setLoading(false);
    }
    if (getImageUploadLink.isSuccess) {
      const { id, uploadURL } = getImageUploadLink.data;

      const selectImageAndUpload = async (
        uploadURL: string,
        uploadedFileName: string,
      ) => {
        const res = await uploadImage(
          pickedImageUri,
          uploadURL,
          uploadedFileName,
        );

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
  }, [getImageUploadLink.status, pickedImageUri]);

  if (loading) {
    return (
      <View className="aspect-[4/4] w-full flex-col items-center justify-center space-y-2 bg-black">
        <ActivityIndicator size="small" color="#ffffff" />
        <Text className="text-center text-lg text-white">Uploading...</Text>
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
        onPress={async () => {
          const pickedImage = await selectImage();
          if (!pickedImage) {
            return;
          }
          setPickedImageUri(pickedImage.uri);
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
          selectNewOnPressed
            ? async () => {
                const pickedImage = await selectImage();
                if (!pickedImage) {
                  return;
                }
                setPickedImageUri(pickedImage.uri);
                getImageUploadLink.mutate({
                  eventId,
                });
              }
            : undefined
        }
      >
        <VibefireImage imgIdKey={imgIdKey} alt={alt} rounded={rounded} />
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
