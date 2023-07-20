// `@expo/metro-runtime` MUST be the first import to ensure Fast Refresh works
// on web.
import "@expo/metro-runtime";

import React from "react";
import { ExpoRoot } from "expo-router";
import Head from "expo-router/head";
import { renderRootComponent } from "expo-router/src/renderRootComponent";

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context("./src/app", true);
  return (
    <Head.Provider>
      <ExpoRoot context={ctx} />
    </Head.Provider>
  );
}

renderRootComponent(App);
