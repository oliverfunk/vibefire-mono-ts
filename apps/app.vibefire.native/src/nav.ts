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

export const navViewEvent = (linkId: string, p?: { preview?: boolean }) => {
  routerNav("/event/" + linkId, p?.preview ? { preview: "true" } : {});
};

export const navCreateEvent = (p?: { fromPrevious?: boolean }) => {
  routerNav("/event/create", p?.fromPrevious ? { fromPrevious: "true" } : {});
};

export const navManageEvent = (linkId: string) => {
  routerNav("/event/" + linkId + "/manage");
};
export const navEditEvent = (linkId: string) => {
  routerNav("/event/" + linkId + "/edit");
};
export const navEditEventSetSection = (section: EditEventFormSectionT) => {
  router.setParams({ section });
};

export const navViewGroup = (linkId: string) => {
  routerNav("/groups/" + linkId);
};

export const navCreateGroup = () => {
  routerNav("/groups/create");
};

export const navManageGroup = (linkId: string) => {
  routerNav("/groups/" + linkId + "/manage");
};
export const navEditGroup = (groupsId: string) => {
  routerNav("/groups/" + groupsId + "/edit");
};
