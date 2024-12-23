import { useLayoutEffect } from "react";
import { useBottomSheet } from "@gorhom/bottom-sheet";

export const useExpandBottomSheet = (delay?: number) => {
  const { expand } = useBottomSheet();

  useLayoutEffect(() => {
    if (delay && delay > 0) {
      console.log("delaying");
      setTimeout(() => {
        console.log("expanding");
        expand();
      }, delay);
    } else {
      expand();
    }
  }, [delay, expand]);

  return expand;
};
