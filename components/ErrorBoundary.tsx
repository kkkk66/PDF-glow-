import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-pink-glow-card max-w-md w-full text-center border border-red-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-500 w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-8">
              Don't worry, your files are safe on your device. We just encountered a display error.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all"
            >
              <RefreshCw size={18} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
