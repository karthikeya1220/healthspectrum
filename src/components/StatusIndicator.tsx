import React from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusVariants = cva(
  "fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm shadow-md animate-in fade-in-50 duration-300",
  {
    variants: {
      variant: {
        success: "bg-health-green-light border-health-green text-health-green",
        loading: "bg-health-blue-light border-health-blue text-health-blue",
        error: "bg-health-red-light border-health-red text-health-red",
        warning: "bg-health-orange-light border-health-orange text-health-orange",
        info: "bg-secondary border-gray-300 text-foreground",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusVariants> {
  message: string;
  isVisible: boolean;
  icon?: React.ReactNode;
  autoHideDuration?: number;
  onClose?: () => void;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  variant,
  message,
  isVisible,
  icon,
  className,
  autoHideDuration = 3000,
  onClose,
  ...props
}) => {
  const [visible, setVisible] = React.useState(isVisible);

  React.useEffect(() => {
    setVisible(isVisible);
    
    if (isVisible && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHideDuration, onClose]);

  if (!visible) return null;

  return (
    <div className={cn(statusVariants({ variant }), className)} {...props}>
      {icon || getDefaultIcon(variant)}
      <span>{message}</span>
    </div>
  );
};

function getDefaultIcon(variant?: string) {
  switch (variant) {
    case "success":
      return <Check className="h-4 w-4" />;
    case "loading":
      return <Loader2 className="h-4 w-4 animate-spin" />;
    case "error":
      return <AlertCircle className="h-4 w-4" />;
    case "warning":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return null;
  }
}
