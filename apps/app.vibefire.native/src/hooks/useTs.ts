import { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";

export const useTsQueryParam = () => {
  const { ts } = useLocalSearchParams<{
    ts?: string;
  }>();
  const tsValue = useMemo(() => {
    return ts ? parseInt(ts) : Date.now();
  }, [ts]);
  return tsValue;
};
