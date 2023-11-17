import { type PartialDeep } from "type-fest";

import { type VibefireEventT } from "@vibefire/models";

export type FormSectionProps = {
  currentEventData: PartialDeep<VibefireEventT>;
  editedEventData: PartialDeep<VibefireEventT>;
  setEditedEventData: (e: PartialDeep<VibefireEventT>) => void;
  setMayProceed: (mayProceed: boolean) => void;
  setFormValidations: (v: string[]) => void;
};
