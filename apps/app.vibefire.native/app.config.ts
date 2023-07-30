import { ConfigContext, ExpoConfig } from "expo/config";

// const CLERK_PUBLISHABLE_KEY =
//   "***REMOVED***";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Vibefire",
  slug: "vibefire-app",
  scheme: "vbfr",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#010101",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  web: {
    bundler: "metro",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "app.vibefire.native",
    config: {
      googleMapsApiKey: "***REMOVED***",
    },
  },
  android: {
    package: "app.vibefire.native",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#010101",
    },
    config: {
      googleMaps: {
        apiKey: "***REMOVED***",
      },
    },
  },
  extra: {
    eas: {
      // projectId: "your-project-id",
    },
    // CLERK_PUBLISHABLE_KEY,
  },
  plugins: [
    "expo-router",
    "./expo-plugins/with-modify-gradle.js",
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Allow $(PRODUCT_NAME) to use your location.",
      },
    ],
  ],
});

// export default mergeConfig(getDefaultConfig(__dirname), defineConfig());
