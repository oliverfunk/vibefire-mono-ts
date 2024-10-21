import { Suspense, useState, type ComponentType, type ReactNode } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import {
  ErrorBoundary,
  type ErrorBoundaryPropsWithComponent,
  type FallbackProps,
} from "react-error-boundary";

import { ErrorSheet, LoadingSheet } from "./sheet-utils";

export const ErrorDisplay = (props: FallbackProps & { textWhite: boolean }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { error, textWhite } = props;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const msg = error?.message ?? "Something went wrong";
  return (
    <View className="items-center justify-center">
      <Text
        className={`text-center text-lg ${textWhite ? "text-white" : "text-black"}`}
      >
        {msg}
      </Text>
    </View>
  );
};

export const LoadingDisplay = (props: { loadingWhite: boolean }) => {
  const { loadingWhite } = props;
  return (
    <View className="items-center justify-center">
      <ActivityIndicator
        size="large"
        color={loadingWhite ? "white" : "black"}
      />
    </View>
  );
};

const logError: ErrorBoundaryPropsWithComponent["onError"] = ({
  name,
  message,
}) => {
  // Do something with the error, e.g. log to an external API
  console.error(`Error boundary - ${name}: ${message}`);
};

export const SuspenseWithError = (props: {
  LoadingFallback: ReactNode;
  ErrorFallback: ErrorBoundaryPropsWithComponent["FallbackComponent"];
  children: ReactNode;
}) => {
  const { LoadingFallback, ErrorFallback, children } = props;
  const [retryCount, setRetryCount] = useState(0);
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={logError}
      onReset={() => setRetryCount(retryCount + 1)}
      resetKeys={[retryCount]}
    >
      <Suspense fallback={LoadingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export const withSuspenseErrorBoundary = <Props extends object>(
  Component: ComponentType<Props>,
  f: {
    LoadingFallback: ReactNode;
    ErrorFallback: ErrorBoundaryPropsWithComponent["FallbackComponent"];
  },
) => {
  const { LoadingFallback, ErrorFallback } = f;
  return function EnhancedComponent(props: Props) {
    return (
      <SuspenseWithError
        LoadingFallback={LoadingFallback}
        ErrorFallback={ErrorFallback}
      >
        <Component {...props} />
      </SuspenseWithError>
    );
  };
};

export const withSuspenseErrorBoundarySheet = <Props extends object>(
  Component: ComponentType<Props>,
  f: {
    LoadingFallback: ReactNode;
    ErrorFallback: ErrorBoundaryPropsWithComponent["FallbackComponent"];
  } = {
    LoadingFallback: <LoadingSheet />,
    ErrorFallback: ({ error, resetErrorBoundary }) => (
      <ErrorSheet retryCallback={resetErrorBoundary} />
    ),
  },
) => {
  const { LoadingFallback, ErrorFallback } = f;
  return function EnhancedComponent(props: Props) {
    return (
      <SuspenseWithError
        LoadingFallback={LoadingFallback}
        ErrorFallback={ErrorFallback}
      >
        <Component {...props} />
      </SuspenseWithError>
    );
  };
};
