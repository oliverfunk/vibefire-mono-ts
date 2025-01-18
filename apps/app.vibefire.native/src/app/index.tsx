import { useLayoutEffect } from "react";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useBottomSheet } from "@gorhom/bottom-sheet";

import { useNotificationsResponder } from "!/hooks/useNotificationsResponder";

import { GeoQueryListSheet } from "!/features/geo-query/GeoQueryList";
import { navViewEvent } from "!/nav";

const Screen = () => {
  // This isn't the best place for this
  // should use a nested group and put it in the layout there
  // but is okay for now as the index route should also be
  // loaded on app start
  // you need a route to have loaded before this can be called
  useNotificationsResponder();

  const {
    collapse: withCollapse,
    expand: withExpand,
    // deeep link params
    s,
    e,
    g,
    p,
    t,
  } = useLocalSearchParams<{
    collapse?: string;
    expand?: string;
    s?: string;
    e?: string;
    g?: string;
    p?: string;
    t: string;
  }>();

  const router = useRouter();

  const { expand, collapse } = useBottomSheet();

  useLayoutEffect(() => {
    if (withCollapse === "true") {
      collapse();
    } else if (withExpand === "true") {
      expand();
    }
  }, [withCollapse, withExpand, collapse, expand]);

  if (e) {
    return (
      <Redirect
        href={navViewEvent(router, e, s, { manner: "href" })}
        withAnchor={false}
      />
    );
  }

  // const impersonating = true;

  // const { signIn } = useSignIn();
  // if (impersonating) {
  //   signIn
  //     ?.create({
  //       strategy: "ticket",
  //       ticket:
  //         "",
  //     })
  //     .then((p) => {
  //       console.log("signed in", JSON.stringify(p, null, 2));
  //     })
  //     .catch((err) => {
  //       console.error("sign in error", JSON.stringify(err, null, 2));
  //     });
  // }

  return <GeoQueryListSheet />;
};
export default Screen;
