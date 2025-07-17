const expoConfig = ({ config }) => ({
  ...config,
  name: "Vibefire",
  owner: "vibefire",
  slug: "vibefire-native",
  scheme: "vifr",
  version: "0.4.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  runtimeVersion: {
    policy: "appVersion",
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/8ea03d1b-020b-4c3c-afd3-30f36bb961fe",
  },
  assetBundlePatterns: ["**/*"],
  web: {
    bundler: "metro",
  },
  notification: {},
  ios: {
    bundleIdentifier: "app.vibefire.ios",
    newArchEnabled: true,
    supportsTablet: true,
    associatedDomains: ["applinks:vifr.io"],
    icon: "./assets/app-icon/app-icon-ios.png",
    config: { googleMapsApiKey: "<token>" },
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
    splash: {
      image: "./assets/splash/splash-ios.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
    },
  },
  android: {
    package: "app.vibefire.and",
    newArchEnabled: false,
    googleServicesFile: "./google-services.json",
    config: {
      googleMaps: {
        apiKey: "<token>",
      },
    },
    adaptiveIcon: {
      foregroundImage: "./assets/app-icon/app-icon-and.png",
      backgroundColor: "#000000",
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
    splash: {
      image: "./assets/splash/splash-and.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
    },
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
    [
      "expo-build-properties",
      {
        android: {
          minSdkVersion: 34,
        },
      },
    ],
  ],
});
export default expoConfig;
