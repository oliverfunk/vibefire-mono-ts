import { router } from "expo-router";

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

export const navManageEvent = (eventId: string) => {
  router.setParams({ manageEvent: `${eventId}` });
};
export const navManageEventCreate = () => {
  router.setParams({ manageEvent: "create" });
};
export const navManageEventEditDescription = (eventId: string) => {
  router.setParams({ manageEvent: `${eventId},edit,description` });
};
export const navManageEventEditLocation = (eventId: string) => {
  router.setParams({ manageEvent: `${eventId},edit,location` });
};
export const navManageEventEditTimes = (eventId: string) => {
  router.setParams({ manageEvent: `${eventId},edit,times` });
};
export const navManageEventEditImages = (eventId: string) => {
  router.setParams({ manageEvent: `${eventId},edit,images` });
};
export const navManageEventEditReview = (eventId: string) => {
  router.setParams({ manageEvent: `${eventId},edit,review` });
};
export const navManageEventEditTimeline = (eventId: string) => {
  router.setParams({ manageEvent: `${eventId},edit,timeline` });
};
export const navManageEventClose = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  router.setParams({ manageEvent: undefined });
};
