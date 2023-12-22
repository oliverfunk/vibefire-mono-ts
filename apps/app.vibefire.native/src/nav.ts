import { router } from "expo-router";

import { type EditEventFormSectionT } from "./types";

const routerPush = (path: string) => {
  router.push(path);
  router.setParams({ ts: new Date().getTime().toString() });
};

const routerReplace = (path: string) => {
  router.replace(path);
  router.setParams({ ts: new Date().getTime().toString() });
};

export const navHomeWithProfileSelected = (selected?: boolean) => {
  routerPush("/");
  if (selected === true) {
    router.setParams({ profileSelected: "true" });
  } else if (selected === false) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    router.setParams({ profileSelected: undefined });
  }
};
export const navHomeWithMinimise = () => {
  routerPush("/");
  router.setParams({ minimise: "true" + Math.random() });
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
  routerPush("/events-by-organiser");
};

export const navViewEvent = (linkId: string) => {
  routerPush("/event/" + linkId);
};
export const navViewEventAsPreview = (linkId: string) => {
  navViewEvent(linkId);
  router.setParams({ isPreview: "true" });
};

export const navCreateEvent = () => {
  routerPush("/event/create");
};
export const navSetFromPrevious = () => {
  navCreateEvent();
  router.setParams({ fromPrevious: "true" });
};

export const navManageEvent = (linkId: string) => {
  routerPush("/event/" + linkId + "/manage");
};
// export const navManageEventReplace = (eventId: string) => {
//   router.replace("/event/" + eventId + "/manage");
// };
export const navEditEvent = (eventId: string) => {
  routerPush("/event/" + eventId + "/edit");
};
export const navEditEventSetSection = (section: EditEventFormSectionT) => {
  router.setParams({ section });
};
