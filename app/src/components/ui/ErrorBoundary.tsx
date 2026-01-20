/**
 * ErrorBoundary Component
 *
 * Description:
 * A React error boundary that catches JavaScript errors anywhere in the child
 * component tree and displays a fallback UI instead of crashing the entire
 * application. Essential for production reliability in the Mine Demo Dashboard,
 * ensuring quarry operators can continue working even when isolated components fail.
 *
 * Sample Input:
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <ChildComponent />
 * </ErrorBoundary>
 *
 * <ErrorBoundary onError={(error) => logToService(error)}>
 *   <Dashboard />
 * </ErrorBoundary>
 *
 * Expected Output:
 * Renders children normally when no errors occur. When an error is caught,
 * displays a fallback UI with error message and refresh button. Optionally
 * calls onError callback for error logging/reporting.
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  /** Child components to wrap with error boundary protection */
  children: ReactNode;
  /** Custom fallback UI to display when an error occurs */
  fallback?: ReactNode;
  /** Callback function invoked when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  /** Whether an error has been caught */
  hasError: boolean;
  /** The caught error object */
  error: Error | null;
}

/**
 * DefaultErrorFallback - The default UI displayed when an error is caught
 *
 * @param props - Contains the error object and reset function
 * @returns A styled error message with refresh button
 */
const DefaultErrorFallback = ({
  error,
  onReset,
}: {
  error: Error | null;
  onReset: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8 bg-slate-800 rounded-lg border border-slate-700">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <div className="p-3 bg-red-500/10 rounded-full">
          <AlertTriangle
            size={32}
            className="text-red-500"
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-100">
            Something went wrong
          </h2>
          <p className="text-sm text-slate-400">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          {error && import.meta.env.DEV && (
            <p className="mt-2 text-xs text-slate-500 font-mono bg-slate-900 p-2 rounded">
              {error.message}
            </p>
          )}
        </div>

        <button
          onClick={onReset}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 mt-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors duration-150"
        >
          <RefreshCw size={16} aria-hidden="true" />
          Refresh Page
        </button>
      </div>
    </div>
  );
};

/**
 * ErrorBoundary - A React error boundary component for graceful error handling
 *
 * @remarks
 * Error boundaries must be class components as there is no hook equivalent
 * for componentDidCatch lifecycle method in React.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * Static method to update state when an error is thrown
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Lifecycle method called after an error has been thrown
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError } = this.props;

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }

    // Call optional error callback for external logging
    if (onError) {
      onError(error, errorInfo);
    }
  }

  /**
   * Reset the error boundary state and refresh the page
   */
  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Return custom fallback if provided, otherwise use default
      if (fallback) {
        return fallback;
      }

      return (
        <DefaultErrorFallback
          error={error}
          onReset={this.handleReset}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;
export { ErrorBoundary, DefaultErrorFallback };
export type { ErrorBoundaryProps, ErrorBoundaryState };
