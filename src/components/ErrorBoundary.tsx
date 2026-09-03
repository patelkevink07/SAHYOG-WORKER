import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Sahyog Worker App:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-6 max-w-md w-full text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#FEF2F2] border border-[#FCA5A5] flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-[#991B1B]" />
            </div>
            <h2 className="text-[18px] font-[650] text-[#14181F] mb-1">
              Application Refresh Needed
            </h2>
            <p className="text-[13px] text-[#6B7280] mb-4">
              A temporary interface session glitch was caught. Tap below to reset cached state and restore duty view.
            </p>
            <button
              onClick={this.handleReset}
              className="min-h-[48px] px-5 bg-[#1F4D3D] hover:bg-[#173C2F] text-white font-[600] text-[14px] rounded-[8px] inline-flex items-center gap-2 transition-colors w-full justify-center"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset & Reload App</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
