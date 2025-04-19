import React, { useState, useEffect } from "react";
import { X, RotateCcw } from "lucide-react";

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  duration?: number;
}

const UndoToast: React.FC<UndoToastProps> = ({
  message,
  onUndo,
  onDismiss,
  duration = 8000,
}) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set up progress bar countdown
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 100));
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 100);

    setIntervalId(interval);

    // Set up auto-dismiss
    const timeout = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [duration]);

  const handleDismiss = () => {
    setVisible(false);
    if (intervalId) clearInterval(intervalId);
    
    // Allow animation to complete before calling onDismiss
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  const handleUndo = () => {
    onUndo();
    handleDismiss();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 w-full max-w-md animate-slide-up rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="mr-4 flex-1">
          <p className="text-sm text-gray-800">{message}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleUndo}
            className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-health-blue hover:bg-health-blue-light"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Undo
          </button>
          <button
            onClick={handleDismiss}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-lg">
        <div 
          className="h-full bg-health-blue transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default UndoToast;
