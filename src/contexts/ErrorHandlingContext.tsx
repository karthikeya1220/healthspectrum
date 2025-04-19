import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, AlertTriangle, AlertCircle, Info } from 'lucide-react';

type ErrorSeverity = 'error' | 'warning' | 'info';

interface ErrorState {
  message: string;
  details?: string;
  code?: string;
  timestamp: Date;
  severity: ErrorSeverity;
  id: string;
  recoveryAction?: {
    label: string;
    action: () => void;
  };
  autoHide?: boolean;
  autoHideDelay?: number;
}

interface ErrorContextValue {
  errors: ErrorState[];
  addError: (error: Omit<ErrorState, 'id' | 'timestamp'>) => string;
  removeError: (id: string) => void;
  clearAllErrors: () => void;
  hasErrors: boolean;
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

export const useErrorHandler = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorHandler must be used within an ErrorHandlingProvider');
  }
  return context;
};

export const ErrorHandlingProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [errors, setErrors] = useState<ErrorState[]>([]);
  
  const addError = useCallback((error: Omit<ErrorState, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const timestamp = new Date();
    
    const newError = {
      ...error,
      id,
      timestamp,
      severity: error.severity || 'error',
      autoHide: error.autoHide ?? (error.severity !== 'error'),
      autoHideDelay: error.autoHideDelay || (
        error.severity === 'error' ? 0 : 
        error.severity === 'warning' ? 8000 : 5000
      ),
    };
    
    setErrors(prev => [...prev, newError]);
    
    if (newError.autoHide) {
      setTimeout(() => {
        removeError(id);
      }, newError.autoHideDelay);
    }
    
    return id;
  }, []);
  
  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);
  
  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);
  
  const value = {
    errors,
    addError,
    removeError,
    clearAllErrors,
    hasErrors: errors.length > 0,
  };
  
  return (
    <ErrorContext.Provider value={value}>
      {children}
      <ErrorDisplay />
    </ErrorContext.Provider>
  );
};

const ErrorDisplay: React.FC = () => {
  const { errors, removeError } = useErrorHandler();
  
  if (errors.length === 0) return null;
  
  const severityIcon = (severity: ErrorSeverity) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-5 w-5 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 flex-shrink-0" />;
      case 'info':
        return <Info className="h-5 w-5 flex-shrink-0" />;
    }
  };
  
  const severityColors = {
    error: "bg-health-red-light border-health-red text-health-red",
    warning: "bg-health-orange-light border-health-orange text-health-orange",
    info: "bg-health-blue-light border-health-blue text-health-blue",
  };
  
  return (
    <div 
      aria-live="polite" 
      className="fixed bottom-4 right-4 z-50 flex max-h-screen w-full max-w-sm flex-col gap-2 overflow-hidden"
    >
      {errors.map(error => (
        <div 
          key={error.id} 
          className={`animate-in slide-in-from-right rounded-lg border p-4 shadow-md ${severityColors[error.severity]}`}
          role={error.severity === 'error' ? 'alert' : 'status'}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {severityIcon(error.severity)}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{error.message}</p>
                <button 
                  onClick={() => removeError(error.id)}
                  className="rounded-full p-1 hover:bg-black/10"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {error.details && (
                <p className="text-sm">{error.details}</p>
              )}
              {error.code && (
                <p className="text-xs">Code: {error.code}</p>
              )}
              {error.recoveryAction && (
                <button
                  onClick={() => {
                    error.recoveryAction?.action();
                    removeError(error.id);
                  }}
                  className="mt-2 rounded-md bg-white/20 px-3 py-1 text-sm font-medium hover:bg-white/30"
                >
                  {error.recoveryAction.label}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
