import React, { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionSuccessProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  autoHideDuration?: number;
  variant?: "default" | "minimal";
}

const ActionSuccess: React.FC<ActionSuccessProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  autoHideDuration = 5000,
  variant = "default",
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoHideDuration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [autoHideDuration]);

  if (!visible) return null;

  if (variant === "minimal") {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-md animate-slide-up flex items-start gap-3 rounded-lg border border-green-100 bg-green-50 p-4 shadow-md">
        <CheckCircle className="h-5 w-5 flex-shrink-0 text-health-green" />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          {actionLabel && onAction && (
            <button 
              onClick={onAction}
              className="mt-2 text-sm font-medium text-health-green hover:underline"
            >
              {actionLabel}
            </button>
          )}
        </div>
        <button 
          onClick={() => setVisible(false)}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-8 w-8 text-health-green" />
          </div>
        </div>
        
        <h3 className="mb-2 text-center text-xl font-medium">{title}</h3>
        <p className="mb-6 text-center text-muted-foreground">{description}</p>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="rounded-lg bg-health-green px-4 py-2 text-white hover:bg-health-green/90"
            >
              {actionLabel}
            </button>
          )}
          <button
            onClick={() => setVisible(false)}
            className="rounded-lg border bg-white px-4 py-2 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionSuccess;
