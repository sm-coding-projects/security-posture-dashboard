'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });

    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught an Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    this.props.onError?.(error, errorInfo);
  }

  handleTryAgain = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>

          <h2 className="text-xl font-semibold text-red-900 mb-2">
            Something went wrong
          </h2>

          <p className="text-red-700 mb-6 max-w-md">
            We encountered an unexpected error. This has been logged and our team has been notified.
          </p>

          <button
            onClick={this.handleTryAgain}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 w-full max-w-2xl">
              <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
                Show Error Details (Development Only)
              </summary>
              <div className="mt-4 p-4 bg-red-100 rounded-md text-left">
                <h3 className="text-sm font-medium text-red-900 mb-2">Error Message:</h3>
                <p className="text-sm text-red-800 mb-4 font-mono">
                  {this.state.error.message}
                </p>

                <h3 className="text-sm font-medium text-red-900 mb-2">Stack Trace:</h3>
                <pre className="text-xs text-red-800 overflow-auto max-h-40 font-mono whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>

                {this.state.errorInfo?.componentStack && (
                  <>
                    <h3 className="text-sm font-medium text-red-900 mb-2 mt-4">Component Stack:</h3>
                    <pre className="text-xs text-red-800 overflow-auto max-h-40 font-mono whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </>
                )}
              </div>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

export type { ErrorBoundaryProps };