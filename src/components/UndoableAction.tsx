import React, { useEffect, useState } from "react";
import { useActionHistory } from "@/contexts/ActionHistoryContext";
import { RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UndoableActionProps {
  id: string;
  message: string;
  onUndo?: () => void;
  duration?: number;
}

export const UndoableAction: React.FC<UndoableActionProps> = ({
  id,
  message,
  onUndo,
  duration = 5000,
}) => {
  const { undoAction, canUndo } = useActionHistory();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const isUndoable = canUndo(id);

  useEffect(() => {
    if (!isUndoable) {
      setVisible(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 100));
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 100);

    const timeout = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [duration, isUndoable, id]);

  if (!visible || !isUndoable) return null;

  const handleUndo = async () => {
    await undoAction(id);
    if (onUndo) onUndo();
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 w-full max-w-sm rounded-lg border bg-background p-4 shadow-lg animate-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between">
        <span className="text-sm">{message}</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleUndo}
            className="text-primary flex items-center gap-1 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded px-2 py-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Undo</span>
          </button>
          <button
            onClick={() => setVisible(false)}
            className="text-muted-foreground hover:text-foreground rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-1 bg-primary rounded-b-lg" style={{ width: `${progress}%` }}></div>
    </div>
  );
};
