import { type Router } from "expo-router";

type RouteingOpts = {
  manner: "push" | "nav" | "replace" | "replace-all" | "dismiss-to";
};

const route = (
  router: Router,
  path: string,
  opts?: RouteingOpts,
  queryParams?: Record<string, string>,
) => {
  console.log(
    "route",
    JSON.stringify(
      {
        path,
        queryParams,
        opts,
      },
      null,
      2,
    ),
  );

  const href = {
    pathname: path,
    params: queryParams,
  };

  if (opts?.manner === "nav") {
    router.navigate(href);
  } else if (opts?.manner === "push") {
    router.push(href);
  } else if (opts?.manner === "replace") {
    router.replace(href);
  } else if (opts?.manner === "replace-all") {
    router.dismissAll();
    router.replace(href);
  } else if (opts?.manner === "dismiss-to") {
    router.dismissTo(href);
  } else {
    router.navigate(href);
  }
};

export const navProfile = (router: Router, opts?: RouteingOpts) => {
  route(router, "/profile", opts);
};

export const navHome = (router: Router) => {
  route(router, "/", { manner: "replace-all" });
};
export const navHomeWithCollapse = (router: Router) => {
  route(
    router,
    "/",
    { manner: "replace-all" },
    { expand: "false", collapse: "true" },
  );
};
export const navHomeWithExpand = (router: Router) => {
  route(
    router,
    "/",
    { manner: "replace-all" },
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
  route(router, "/event/" + eventId + "/", opts);
};
export const navViewEventPreview = (
  router: Router,
  eventId: string,
  opts?: RouteingOpts,
) => {
  route(router, "/event/" + eventId + "/", opts, { preview: "true" });
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
// /event/413667586913337550/manage
// /event/413667586913337550/edit
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
