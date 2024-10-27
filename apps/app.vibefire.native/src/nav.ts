import { router } from "expo-router";

import { type EditEventFormSectionT } from "./types";

const routerNav = (path: string, params: Record<string, string> = {}) => {
  router.navigate(path);
  router.setParams(params);
};

export const navProfile = () => {
  routerNav("/profile");
};

export const navHome = () => {
  routerNav("/", { expand: "false", collapse: "false" });
};
export const navHomeWithCollapse = () => {
  routerNav("/", { expand: "false", collapse: "true" });
};
export const navHomeWithExpand = () => {
  routerNav("/", { expand: "true", collapse: "false" });
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
