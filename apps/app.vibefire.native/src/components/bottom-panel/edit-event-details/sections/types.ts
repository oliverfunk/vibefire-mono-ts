import { type TModelVibefireEvent } from "@vibefire/models";
import { type PartialDeep } from "@vibefire/utils";

export type FormSectionProps = {
  currentEventData: PartialDeep<TModelVibefireEvent>;
  editedEventData: PartialDeep<TModelVibefireEvent>;
  setEditedEventData: (e: PartialDeep<TModelVibefireEvent>) => void;
  setMayProceed: (mayProceed: boolean) => void;
  setFormValidations: (v: string[]) => void;
};
