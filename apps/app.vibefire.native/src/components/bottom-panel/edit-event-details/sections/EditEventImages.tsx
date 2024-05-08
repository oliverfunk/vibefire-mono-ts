import { useLayoutEffect, useMemo } from "react";
import { Dimensions, View } from "react-native";
import _ from "lodash";

import { ImageCarousel } from "!/components/image/ImageCarousel";
import { UploadableVibefireImage } from "!/components/image/UploadableVibefireImage";
import { FormTitleInput } from "!/components/misc/sheet-utils";

import { type FormSectionProps } from "./types";

export const EditEventImages = (props: FormSectionProps) => {
  const {
    editedEventData: eventData,
    setEditedEventData: setEventData,
    setMayProceed,
  } = props;

  useLayoutEffect(() => {
    setMayProceed(!!eventData.images?.banner);
  }, [eventData, setMayProceed]);

  const selectedAdditionalImages = useMemo(() => {
    const addImages = eventData.images?.additional;
    if (!addImages) {
      return [""];
    }
    if (addImages.length < 5) {
      return [...addImages, ""];
    }
    return addImages;
  }, [eventData]);

  const width = Dimensions.get("window").width;

  return (
    <View className="w-full flex-col space-y-4 py-4">
      <View>
        <FormTitleInput
          title="Banner image"
          underneathText="(Tap to change)"
          inputRequired={!eventData.images?.banner}
        >
          <UploadableVibefireImage
            eventId={eventData.id!}
            imgIdKey={eventData.images?.banner}
            alt={`Banner image`}
            unsetImageText="Add Banner Image"
            selectNewOnPressed={true}
            onImageUploaded={(imgKeyId: string) => {
              setEventData(
                _.merge({}, eventData, { images: { banner: imgKeyId } }),
              );
            }}
          />
        </FormTitleInput>
      </View>

      <View>
        <FormTitleInput
          title="Additional images"
          underneathText={
            selectedAdditionalImages.length > 1
              ? "(Scroll to add more)"
              : undefined
          }
        >
          <ImageCarousel
            width={width}
            imgIdKeys={selectedAdditionalImages}
            renderItem={({ index, item }) => {
              return (
                <UploadableVibefireImage
                  eventId={eventData.id!}
                  imgIdKey={item}
                  alt={`Additional image ${index}`}
                  unsetImageText="Add Additional Image"
                  onClosePress={() => {
                    const newAdditional = [...eventData.images!.additional!];
                    newAdditional.splice(index, 1);
                    setEventData({
                      ...eventData,
                      images: {
                        ...eventData.images,
                        additional: newAdditional,
                      },
                    });
                  }}
                  onImageUploaded={(imgKeyId: string) => {
                    const newAdditional = [
                      ...(eventData.images?.additional ?? []),
                    ];
                    newAdditional[index] = imgKeyId;
                    setEventData({
                      ...eventData,
                      images: {
                        ...eventData.images,
                        additional: newAdditional,
                      },
                    });
                  }}
                />
              );
            }}
          />
        </FormTitleInput>
      </View>
    </View>
  );
};
