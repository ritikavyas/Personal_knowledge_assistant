import React from 'react';

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Update state so the next render will show the fallback UI.
    this.setState({ hasError: true, error, errorInfo });

    // Log to console and expose to window for remote inspection
    // eslint-disable-next-line no-console
    console.error('Unhandled error caught by ErrorBoundary:', error, errorInfo);
    // @ts-ignore - attach for debugging in deployed app
    window.__LAST_ERROR__ = { error: error?.toString(), stack: errorInfo?.componentStack };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-dark-950 text-dark-50 p-6">
          <div className="max-w-2xl w-full glass border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-dark-300 mb-4">The application encountered an error while rendering. We logged details to the console.</p>
            <details className="text-xs text-dark-300 mb-4 whitespace-pre-wrap" open>
              <summary className="cursor-pointer underline">Error details (click to expand)</summary>
              <pre className="mt-2 text-xs">
                {this.state.error?.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
            <div className="flex gap-3">
              <button
                className="px-3 py-2 bg-primary-500 text-white rounded"
                onClick={() => window.location.reload()}
              >
                Reload
              </button>
              <button
                className="px-3 py-2 bg-transparent border border-white/10 text-dark-50 rounded"
                onClick={() => {
                  // @ts-ignore
                  // open console instructions
                  alert('Open browser devtools console to inspect window.__LAST_ERROR__');
                }}
              >
                Show devtools hint
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
