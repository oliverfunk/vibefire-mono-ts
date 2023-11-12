import { type ConfigContext, type ExpoConfig } from "expo/config";

const expoConfig = ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Vibefire",
  slug: "vibefire-native",
  scheme: "vifr",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
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
    associatedDomains: ["applinks:vifr.io"],
    config: {},
  },
  android: {
    package: "app.vibefire.native",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#010101",
    },
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: "https",
            host: "*.vifr.io",
            pathPrefix: "/",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  hooks: {
    postPublish: [
      {
        file: "sentry-expo/upload-sourcemaps",
        config: {
          organization: "vibefire",
          project: "vibefire-native",
        },
      },
    ],
  },
  extra: {
    eas: {
      projectId: "8ea03d1b-020b-4c3c-afd3-30f36bb961fe",
    },
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
    [
      "expo-image-picker",
      {
        photosPermission: "Allow $(PRODUCT_NAME) to accesses your photos.",
      },
    ],
    "sentry-expo",
  ],
});
export default expoConfig;
