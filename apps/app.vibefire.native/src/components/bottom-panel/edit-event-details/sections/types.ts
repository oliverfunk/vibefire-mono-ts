import { type VibefireEventT } from "@vibefire/models";
import { type PartialDeep } from "@vibefire/utils";

export type FormSectionProps = {
  currentEventData: PartialDeep<VibefireEventT>;
  editedEventData: PartialDeep<VibefireEventT>;
  setEditedEventData: (e: PartialDeep<VibefireEventT>) => void;
  setMayProceed: (mayProceed: boolean) => void;
  setFormValidations: (v: string[]) => void;
};
