import { type Router } from "expo-router";

type RouteingOpts = {
  manner: "push" | "nav" | "replace" | "dismiss-to" | "href";
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

  const manner = opts?.manner || "nav";

  const href = {
    pathname: path,
    params: queryParams,
  };

  switch (manner) {
    case "nav":
      router.navigate(href);
      break;
    case "push":
      router.push(href);
      break;
    case "replace":
      router.replace(href);
      break;
    case "dismiss-to":
      router.dismissTo(href);
      break;
    case "href":
      // nop
      break;
    default:
      throw new Error(`Unknown route manner: ${manner}`);
  }

  return href;
};

export const navProfile = (router: Router, opts?: RouteingOpts) => {
  route(router, "/profile", opts);
};

export const navHome = (router: Router) => {
  route(router, "/", { manner: "dismiss-to" });
};
export const navHomeWithCollapse = (router: Router) => {
  route(
    router,
    "/",
    { manner: "dismiss-to" },
    { expand: "false", collapse: "true" },
  );
};
export const navHomeWithExpand = (router: Router) => {
  route(
    router,
    "/",
    { manner: "dismiss-to" },
    { expand: "true", collapse: "false" },
  );
};

export const navBack = (router: Router) => {
  if (router.canGoBack()) {
    router.back();
  }
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
  shareCode?: string,
  opts?: RouteingOpts,
) => {
  return route(
    router,
    "/event/" + eventId + "/",
    opts,

    shareCode ? { shareCode } : undefined,
  );
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

export const navViewUserManagedEvents = (
  router: Router,
  opts?: RouteingOpts,
) => {
  route(router, "/event/managed", opts);
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
