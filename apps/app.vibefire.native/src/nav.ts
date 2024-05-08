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
export const navViewEvent = (eventLinkId: string) => {
  routerNav("/event/" + eventLinkId);
};
export const navViewEventPreview = (eventLinkId: string) => {
  routerNav("/event/" + eventLinkId, { preview: "true" });
};
export const navManageEvent = (eventLinkId: string) => {
  routerNav("/event/" + eventLinkId + "/manage");
};
export const navEditEvent = (eventLinkId: string) => {
  routerNav("/event/" + eventLinkId + "/edit");
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
export const navViewGroup = (groupLinkId: string) => {
  routerNav("/group/" + groupLinkId);
};
export const navManageGroup = (groupLinkId: string) => {
  routerNav("/group/" + groupLinkId + "/manage");
};
export const navEditGroup = (groupLinkId: string) => {
  routerNav("/group/" + groupLinkId + "/edit");
};
