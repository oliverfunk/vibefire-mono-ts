import { useLayoutEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { useBottomSheet } from "@gorhom/bottom-sheet";

import { useNotificationsResponder } from "!/hooks/useNotificationsResponder";

import { EventsQueryListSheet } from "!/features/events-list";

const Screen = () => {
  // This isn't the best place for this
  // should use a nested group and put it in the layout there
  // but is okay for now as the index route should also be
  // loaded on app start
  // you need a route to have loaded before this can be called
  useNotificationsResponder();

  const { expand, collapse } = useBottomSheet();

  const { collapse: withCollapse, expand: withExpand } = useLocalSearchParams<{
    collapse?: string;
    expand?: string;
  }>();

  // this might be a bad idea,
  // bettter to useBottomSheet() at the nav call site
  useLayoutEffect(() => {
    if (withCollapse === "true") {
      collapse();
    }
    if (withExpand === "true") {
      expand();
    }
  }, [withCollapse, withExpand, collapse, expand]);

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

  return <EventsQueryListSheet />;
};
export default Screen;
