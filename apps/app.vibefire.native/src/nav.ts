import { router } from "expo-router";

import { type EditEventFormSectionT } from "./types";

export const navClear = () => {
  router.setParams({
    eventId: undefined,
    editEvent: undefined,
    manageEvent: undefined,
    orgId: undefined,
    eventsBy: undefined,
  });
};

export const navOwnEventsByOrganiser = (organiserId?: string) => {
  router.setParams({ eventsBy: organiserId ?? "personal" });
};
export const navOwnEventsByOrganiserClose = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  router.setParams({ eventsBy: undefined });
};

export const navViewEvent = (eventId: string) => {
  router.setParams({ eventId: eventId });
};
export const navViewEventAsPreview = (eventId: string) => {
  router.setParams({ eventId: `${eventId},preview` });
};
export const navViewEventClose = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  router.setParams({ eventId: undefined });
};

export const navViewOrg = (orgId: string) => {
  router.setParams({ orgId: orgId });
};
export const navViewOrgClose = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  router.setParams({ orgId: undefined });
};

export const navCreateEvent = () => {
  router.setParams({ editEvent: "create" });
};
export const navEditEvent = (eventId: string) => {
  router.setParams({ editEvent: eventId });
};
export const navEditEventClose = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  router.setParams({ editEvent: undefined });
};
export const navEditEventEditSection = (
  eventId: string,
  section: EditEventFormSectionT,
) => {
  router.setParams({ editEvent: `${eventId},${section}` });
};

export const navManageEvent = (eventId: string) => {
  router.setParams({ manageEvent: eventId });
};
export const navManageEventClose = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  router.setParams({ manageEvent: undefined });
};
