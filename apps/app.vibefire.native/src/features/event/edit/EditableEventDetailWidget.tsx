import { Text, TextInput, TextInputProps, View } from "react-native";
import { type FormikProps } from "formik";

import { type EventDetail, type TModelVibefireEvent } from "@vibefire/models";

export const EditableEventDetailWidget = (props: {
  index: number;
  detail: EventDetail;
  formik: FormikProps<TModelVibefireEvent>;
  detailPath: string;
}) => {
  const { detail, formik, detailPath } = props;

  switch (detail.type) {
    case "description":
      return (
        <>
          <TextInput
            className="p-1 text-2xl font-bold text-white"
            multiline={true}
            onChangeText={formik.handleChange(`${detailPath}.blockTitle`)}
            onBlur={formik.handleBlur(`${detailPath}.blockTitle`)}
            value={detail.blockTitle}
          />
          <TextInput
            className="p-1 text-white"
            multiline={true}
            onChangeText={formik.handleChange(`${detailPath}.value`)}
            onBlur={formik.handleBlur(`${detailPath}.value`)}
            value={detail.value}
          />
        </>
      );
  }
};
