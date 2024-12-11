import { TextInput, TouchableOpacity, View } from "react-native";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { type FormikProps } from "formik";

import { type EventDetail, type TModelVibefireEvent } from "@vibefire/models";

import { EditableIconWrapper } from "./EditableIconWrapper";

export const EditableEventDetailWidget = (props: {
  formik: FormikProps<TModelVibefireEvent>;
  n: number;
  nDetails: number;
  detail: EventDetail;
  detailsPath: string;
}) => {
  const { formik, n, nDetails, detail, detailsPath } = props;
  const { handleChange, handleBlur, setFieldValue } = formik;

  const detailPath = `${detailsPath}[${n}]`;

  switch (detail.type) {
    case "description":
      return (
        <View className="flex-row items-center space-x-4">
          <View className="flex-1 flex-col">
            <EditableIconWrapper>
              <TextInput
                className="text-xl font-bold text-white"
                multiline={true}
                onChangeText={handleChange(`${detailPath}.blockTitle`)}
                onBlur={handleBlur(`${detailPath}.blockTitle`)}
                value={detail.blockTitle}
              />
            </EditableIconWrapper>
            <EditableIconWrapper>
              <TextInput
                className="text-base text-white"
                multiline={true}
                placeholder="(Add a description)"
                placeholderTextColor={"#666"}
                onChangeText={handleChange(`${detailPath}.value`)}
                onBlur={handleBlur(`${detailPath}.value`)}
                value={detail.value}
              />
            </EditableIconWrapper>
          </View>
          <View className="flex-col items-center space-y-2">
            <TouchableOpacity
              onPress={async () => {
                // swap with previous
                if (n > 0) {
                  const newDetails = [...formik.values.details];
                  newDetails[n] = newDetails[n - 1];
                  newDetails[n - 1] = detail;
                  await setFieldValue(detailsPath, newDetails);
                }
              }}
            >
              <FontAwesome6 name="chevron-up" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                const newDetails = [...formik.values.details];
                newDetails.splice(n, 1);
                await setFieldValue(detailsPath, newDetails);
              }}
            >
              <AntDesign name="closecircle" size={15} color="red" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                // swap with next
                if (n != nDetails - 1) {
                  const newDetails = [...formik.values.details];
                  newDetails[n] = newDetails[n + 1];
                  newDetails[n + 1] = detail;
                  await setFieldValue(detailsPath, newDetails);
                }
              }}
            >
              <FontAwesome6 name="chevron-down" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      );
  }
};

// import { Text, View } from "react-native";

// import { type EventDetail, type TModelVibefireEvent } from "@vibefire/models";

// export const EventDetailWidgetView = (props: { detail: EventDetail }) => {
//   const { detail } = props;

//   switch (detail.type) {
//     case "description":
//       return (
//         <View className="flex-col">
//           <Text className="text-xl font-bold text-white">
//             {detail.blockTitle}
//           </Text>
//           <View className="py-2" />
//           <Text className="text-white">{detail.value}</Text>
//         </View>
//       );
//   }
// };
