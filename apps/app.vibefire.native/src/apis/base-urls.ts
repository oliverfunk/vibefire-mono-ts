import Constants from "expo-constants";

import { BASEPATH_REST } from "@vibefire/api/src/basepaths";

const _localApiPort = 8787;

export const apiBaseUrl = () => {
  // return "https://api.vibefire.app";
  const debuggerHost =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const localhost = debuggerHost?.split(":")[0];
  if (!localhost) {
    return "https://api.vibefire.app";
  }
  return `http://${localhost}:${_localApiPort}`;
};

export const imgUrl = (imagePath?: string) => {
  if (!imagePath) return undefined;
  const accHash = process.env.EXPO_PUBLIC_CF_IMAGES_ACC_HASH;
  return `https://vibefire.app/cdn-cgi/imagedelivery/${accHash}/${imagePath}`;
};
