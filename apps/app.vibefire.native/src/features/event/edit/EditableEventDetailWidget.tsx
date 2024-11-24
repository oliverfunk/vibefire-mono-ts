import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { type FormikProps } from "formik";

import { type EventDetail, type TModelVibefireEvent } from "@vibefire/models";

import { IconButton } from "!/components/button/IconButton";

import { EditableIconWrapper } from "./EditableIconWrapper";

export const EditableEventDetailWidget = (props: {
  index: number;
  detail: EventDetail;
  formik: FormikProps<TModelVibefireEvent>;
  detailPath: string;
}) => {
  const { index, detail, formik, detailPath } = props;

  switch (detail.type) {
    case "description":
      return (
        <View className="flex-col rounded-lg border border-white bg-neutral-900 p-2">
          {/* without self-start, touch area is whole row */}
          <TouchableOpacity className="self-start py-1">
            <AntDesign name="closecircle" size={15} color="white" />
          </TouchableOpacity>
          <EditableIconWrapper>
            <TextInput
              className="text-xl font-bold text-white"
              multiline={true}
              onChangeText={formik.handleChange(`${detailPath}.blockTitle`)}
              onBlur={formik.handleBlur(`${detailPath}.blockTitle`)}
              value={detail.blockTitle}
            />
          </EditableIconWrapper>
          <View className="py-2" />
          <EditableIconWrapper>
            <TextInput
              className="text-white"
              multiline={true}
              onChangeText={formik.handleChange(`${detailPath}.value`)}
              onBlur={formik.handleBlur(`${detailPath}.value`)}
              value={detail.value}
            />
          </EditableIconWrapper>
        </View>
      );
  }
};
