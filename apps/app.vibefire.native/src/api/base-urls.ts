import Constants from "expo-constants";

export const trpcApiUrl = () => {
  const env = process.env.EXPO_PUBLIC_ENVIRONMENT as string;
  console.log("env", env);
  if (__DEV__) {
    console.log("Running in dev mode");
  }
  return "https://api.vibefire.app";
  if (env !== "local") {
    return "https://api.vibefire.app";
  }
  const debuggerHost =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const localhost = debuggerHost?.split(":")[0];
  const localApiPort = 8787;
  const url = `http://${localhost}:${localApiPort}`;
  return url;
};

export const imgUrl = (imagePath?: string) => {
  if (!imagePath) return undefined;
  const accHash = process.env.EXPO_PUBLIC_CF_IMAGES_ACC_HASH as string;
  return `https://vibefire.app/cdn-cgi/imagedelivery/${accHash}/${imagePath}`;
};
