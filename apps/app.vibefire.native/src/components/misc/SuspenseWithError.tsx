import { Suspense, useState, type ComponentType, type ReactNode } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import {
  ErrorBoundary,
  type ErrorBoundaryPropsWithComponent,
  type FallbackProps,
} from "react-error-boundary";

export const ErrorDisplay = (props: FallbackProps & { textWhite: boolean }) => {
  const { error, textWhite } = props;
  return (
    <View className="items-center justify-center">
      <Text
        className={`text-center text-lg ${textWhite ? "text-white" : "text-black"}`}
      >
        {error.message ?? "There was an error"}
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
