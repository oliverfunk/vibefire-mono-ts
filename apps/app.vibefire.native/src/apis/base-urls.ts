import Constants from "expo-constants";

import { BASEPATH_REST } from "@vibefire/api/src/basepaths";

export const apiBaseUrl = () => {
  const debuggerHost =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const localhost = debuggerHost?.split(":")[0];
  if (!localhost) {
    return "https://api.vibefire.app";
  }
  return `http://${localhost}:8787`;
};

export const vfImgUrl = (
  eventId: string,
  imageKey: string,
  belonging: "banner" | "additional" | "icon",
  bucket: "images-eu" | "images-us",
) => {
  return `https://${bucket}.vibefire.app/${eventId}/${belonging}/${imageKey}`;
};

export const vfImgUrlDebug = (imageKey?: string) => {
  if (!imageKey) return undefined;
  const debuggerHost =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const localhost = debuggerHost?.split(":")[0];
  return `http://${localhost}:8787${BASEPATH_REST}/img/${imageKey}`;
};
