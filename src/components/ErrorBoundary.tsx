import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    // Here you would typically log the error to a service
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI that follows Nielsen's error handling heuristics
      return this.props.fallback || (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg flex flex-col items-center justify-center text-center my-8 animate-fade-in">
          <AlertTriangle className="h-12 w-12 text-health-red mb-4" />
          <h2 className="text-xl font-medium mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4 max-w-md">
            We're sorry, but there was an error loading this page. This has been logged and our team is looking into it.
          </p>
          <div className="space-x-4">
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-health-blue text-white rounded-lg hover:bg-health-blue/90 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
            <a
              href="/"
              className="px-4 py-2 border rounded-lg hover:bg-secondary transition-colors inline-block"
            >
              Go to Home Page
            </a>
          </div>
          
          {/* Show technical details in collapsed section - for developers */}
          <details className="mt-6 text-left w-full">
            <summary className="text-sm font-medium cursor-pointer">Technical Details</summary>
            <pre className="mt-2 p-4 bg-gray-800 text-white rounded-lg text-xs overflow-auto max-h-40">
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
