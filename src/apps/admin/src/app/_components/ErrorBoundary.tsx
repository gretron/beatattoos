import { Component, ErrorInfo, ReactNode } from "react";

/**
 * Props for {@link ErrorBoundary}
 */
interface ErrorBoundaryProps {
  children?: ReactNode;
  /* Element shown when an error occurs in the children */
  fallback?: ReactNode;
}

/**
 * State for {@link ErrorBoundary}
 */
interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Error boundary for failure feedback without application disruption
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   * Default state values
   */
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  /**
   * Called when component catches error from children
   * @param error The captured error
   * @param errorInfo Information regarding captured error
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
