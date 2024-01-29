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
// export const navSetFromPrevious = () => {
//   navCreateEvent();
//   router.setParams({ fromPrevious: "true" });
// };

export const navManageEvent = (linkId: string) => {
  routerNav("/event/" + linkId + "/manage");
};
// export const navManageEventReplace = (eventId: string) => {
//   router.replace("/event/" + eventId + "/manage");
// };
export const navEditEvent = (eventId: string) => {
  routerNav("/event/" + eventId + "/edit");
};
export const navEditEventSetSection = (section: EditEventFormSectionT) => {
  router.setParams({ section });
};
