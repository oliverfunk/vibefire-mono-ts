import { Suspense, useState, type ComponentType, type ReactNode } from "react";
import {
  ErrorBoundary,
  type ErrorBoundaryPropsWithComponent,
} from "react-error-boundary";

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
