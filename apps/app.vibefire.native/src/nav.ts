import { type Router } from "expo-router";

type RouteingOpts = {
  manner: "push" | "nav" | "replace" | "replace-all" | "dismiss-all";
};

const route = (
  router: Router,
  path: string,
  opts?: RouteingOpts,
  params?: Record<string, string>,
) => {
  if (opts?.manner === "nav") {
    router.navigate(path);
  } else if (opts?.manner === "push") {
    router.push(path);
  } else if (opts?.manner === "replace") {
    router.replace(path);
  } else if (opts?.manner === "replace-all") {
    router.dismissAll();
    router.navigate(path);
  } else if (opts?.manner === "dismiss-all") {
    router.dismissAll();
  } else {
    router.navigate(path);
  }
  if (params) {
    router.setParams(params);
  }
};

export const navProfile = (router: Router, opts?: RouteingOpts) => {
  route(router, "/profile", opts);
};

export const navHome = (router: Router) => {
  route(router, "/", { manner: "dismiss-all" });
};
export const navHomeWithCollapse = (router: Router) => {
  route(
    router,
    "/",
    { manner: "dismiss-all" },
    { expand: "false", collapse: "true" },
  );
};
export const navHomeWithExpand = (router: Router) => {
  route(
    router,
    "/",
    { manner: "dismiss-all" },
    { expand: "true", collapse: "false" },
  );
};

export const navBack = (router: Router) => {
  if (router.canGoBack()) {
    router.back();
  }
};

export const navEventsByOrganiser = (router: Router, opts?: RouteingOpts) => {
  route(router, "/events-by-organiser", opts);
};

export const navCreateEvent = (router: Router, opts?: RouteingOpts) => {
  route(router, "/event/create", opts);
};
export const navCreateEventFromPrevious = (
  router: Router,
  opts?: RouteingOpts,
) => {
  route(router, "/event/create", opts, { fromPrevious: "true" });
};

export const navViewEvent = (
  router: Router,
  eventId: string,
  opts?: RouteingOpts,
) => {
  route(router, "/event/", opts);
};
export const navViewEventPreview = (
  router: Router,
  eventId: string,
  opts?: RouteingOpts,
) => {
  route(router, "/event/" + eventId, opts, { preview: "true" });
};

export const navManageEvent = (
  router: Router,
  eventId: string,
  opts?: RouteingOpts,
) => {
  route(router, "/event/" + eventId + "/manage", opts);
};
export const navEditEvent = (
  router: Router,
  eventId: string,
  opts?: RouteingOpts,
) => {
  route(router, "/event/" + eventId + "/edit", opts);
};

// export const navGroupUserManaged = (router: Router, opts?: RouteingOpts) => {
//   routerNav("/group/manage");
// };
// export const navCreateGroup = (router: Router, opts?: RouteingOpts) => {
//   routerNav("/group/create");
// };
// export const navViewGroup = (
//   router: Router,
//   groupId: string,
//   opts?: RouteingOpts,
// ) => {
//   routerNav("/group/" + groupId);
// };
// export const navManageGroup = (
//   router: Router,
//   groupId: string,
//   opts?: RouteingOpts,
// ) => {
//   routerNav("/group/" + groupId + "/manage");
// };
// export const navEditGroup = (
//   router: Router,
//   groupId: string,
//   opts?: RouteingOpts,
// ) => {
//   routerNav("/group/" + groupId + "/edit");
// };
