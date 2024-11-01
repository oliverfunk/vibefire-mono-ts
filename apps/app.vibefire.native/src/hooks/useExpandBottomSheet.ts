import { useLayoutEffect } from "react";
import { useBottomSheet } from "@gorhom/bottom-sheet";

export const useExpandBottomSheet = () => {
  const { expand } = useBottomSheet();

  useLayoutEffect(() => {
    expand();
  }, [expand]);

  return expand;
};
