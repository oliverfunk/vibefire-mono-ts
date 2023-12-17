import Constants from "expo-constants";

export const apiBaseUrl = () => {
  const env = process.env.EXPO_PUBLIC_ENVIRONMENT;
  console.log("env", env);
  return "https://api.vibefire.app";
  if (env !== "local") {
    return "https://api.vibefire.app";
  }
  const debuggerHost =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const localhost = debuggerHost?.split(":")[0];
  const localApiPort = 8787;
  return `http://${localhost}:${localApiPort}`;
};

export const imgUrl = (imagePath?: string) => {
  if (!imagePath) return undefined;
  const accHash = process.env.EXPO_PUBLIC_CF_IMAGES_ACC_HASH;
  return `https://vibefire.app/cdn-cgi/imagedelivery/${accHash}/${imagePath}`;
};
