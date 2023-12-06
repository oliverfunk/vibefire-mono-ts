export type EditEventFormSectionT =
  | "description"
  | "location"
  | "times"
  | "images"
  | "timeline";

export type NavMainQueryParamsT = {
  eventID?: string;
  orgID?: string;
  manageEvent?: string;
  eventsBy?: string;
  editEvent?: string;
  create?: string;
};
