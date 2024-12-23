const expoConfig = ({ config }) => ({
  ...config,
  name: "Vibefire",
  owner: "vibefire",
  slug: "vibefire-native",
  scheme: "vifr",
  version: "0.2.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
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
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryUserDefaults",
          NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
        },
      ],
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
  extra: {
    eas: {
      projectId: "8ea03d1b-020b-4c3c-afd3-30f36bb961fe",
    },
  },
  plugins: [
    "expo-router",
    "expo-font",
    "expo-secure-store",
    // "./expo-plugins/with-modify-gradle.js",
    [
      "expo-camera",
      {
        cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone",
        recordAudioAndroid: true,
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "Allow $(PRODUCT_NAME) to accesses your photos. This allows you to upload photos from your library.",
      },
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Allow $(PRODUCT_NAME) to use your location. This allows the app to show your location on the map and to show you nearby events.",
        locationAlwaysPermission:
          "Allow $(PRODUCT_NAME) to use your location. This allows the app to show your location on the map and to show you nearby events.",
        locationWhenInUsePermission:
          "Allow $(PRODUCT_NAME) to use your location. This allows the app to show your location on the map and to show you nearby events.",
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
