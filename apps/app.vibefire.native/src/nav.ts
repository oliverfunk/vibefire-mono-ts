import { router } from "expo-router";

import { type EditEventFormSectionT } from "./types";

const routerNav = (path: string, params: Record<string, string> = {}) => {
  params.ts = new Date().getTime().toString();
  router.navigate(path);
  router.setParams(params);
};

const routerReplace = (path: string, params: Record<string, string> = {}) => {
  params.ts = new Date().getTime().toString();
  router.replace(path);
  router.setParams(params);
};

export const navHomeWithProfileSelected = ({
  profileSelected,
}: {
  profileSelected?: boolean;
}) => {
  routerNav("/", profileSelected ? { profileSelected: "true" } : {});
};
export const navHomeWithMinimise = () => {
  routerNav("/", { minimise: "true" + Math.random() });
};
export const navReplaceHomeWithMinimise = () => {
  routerReplace("/");
  router.setParams({ minimise: "true" + Math.random() });
};

export const navPop = () => {
  if (router.canGoBack()) {
    router.back();
  }
};

export const navOwnEventsByOrganiser = () => {
  routerNav("/events-by-organiser");
};

export const navCreateEvent = () => {
  routerNav("/event/create");
};
export const navCreateEventFromPrevious = () => {
  routerNav("/event/create", { fromPrevious: "true" });
};
export const navViewEvent = (eventId: string) => {
  routerNav("/event/" + eventId);
};
export const navViewEventPreview = (eventId: string) => {
  routerNav("/event/" + eventId, { preview: "true" });
};
export const navManageEvent = (eventId: string) => {
  routerNav("/event/" + eventId + "/manage");
};
export const navEditEvent = (eventId: string) => {
  routerNav("/event/" + eventId + "/edit");
};
export const navEditEventSetSection = (section: EditEventFormSectionT) => {
  router.setParams({ section });
};

export const navGroupUserManaged = () => {
  routerNav("/group/manage");
};
export const navCreateGroup = () => {
  routerNav("/group/create");
};
export const navViewGroup = (groupId: string) => {
  routerNav("/group/" + groupId);
};
export const navManageGroup = (groupId: string) => {
  routerNav("/group/" + groupId + "/manage");
};
export const navEditGroup = (groupId: string) => {
  routerNav("/group/" + groupId + "/edit");
};
