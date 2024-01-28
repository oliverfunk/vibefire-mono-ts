const expoConfig = ({ config }) => ({
  ...config,
  name: "Vibefire",
  owner: "vibefire",
  slug: "vibefire-native",
  scheme: "vifr",
  version: "0.2.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/icons/appicon-ios.png",
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
  notification: {},
  ios: {
    supportsTablet: true,
    bundleIdentifier: "app.vibefire.ios",
    associatedDomains: ["applinks:vifr.io"],
    icon: "./assets/icons/appicon-ios.png",
    config: { googleMapsApiKey: "***REMOVED***" },
    entitlements: {
      "com.apple.developer.applesignin": ["Default"],
    },
    infoPlist: {
      LSApplicationQueriesSchemes: ["uber"],
    },
  },
  android: {
    package: "app.vibefire.and",
    googleServicesFile: "./google-services.json",
    config: {
      googleMaps: {
        apiKey: "***REMOVED***",
      },
    },
    adaptiveIcon: {
      foregroundImage: "./assets/icons/appicon-and.png",
      backgroundColor: "#010101",
    },
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: "https",
            host: "vifr.io",
            pathPrefix: "/",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  hooks: {
    postPublish: [],
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
    [
      "react-native-vision-camera",
      {
        cameraPermissionText: "$(PRODUCT_NAME) needs access to your Camera.",
        enableCodeScanner: true,
      },
    ],
    [
      "@sentry/react-native/expo",
      {
        url: "https://sentry.io/",
        organization: "vibefire",
        project: "vibefire-native",
      },
    ],
  ],
});
export default expoConfig;
