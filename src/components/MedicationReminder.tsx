import React from "react";
import { Clock, ChevronRight, Check, X, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  healthStatusColors, 
  actionButtonColors,
  cardColors,
  healthTextColors
} from "@/styles/color-utils";

interface MedicationReminderProps {
  medicationName: string;
  dosage: string;
  timeLabel: string;
  instructions?: string;
  overdue?: boolean;
  timeSensitive?: boolean;
  taken?: boolean;
  skipped?: boolean;
  onTake: () => void;
  onSkip: () => void;
  onDetails: () => void;
  className?: string;
}

/**
 * Enhanced MedicationReminder component using color psychology principles:
 * - Blue for trust and reliability (primary actions)
 * - Green for success and positive reinforcement
 * - Red for urgency and alert states
 * - Teal for balanced, calming UI elements
 * - Orange for attention without alarm
 */
export const MedicationReminder: React.FC<MedicationReminderProps> = ({
  medicationName,
  dosage,
  timeLabel,
  instructions,
  overdue = false,
  timeSensitive = false,
  taken = false,
  skipped = false,
  onTake,
  onSkip,
  onDetails,
  className
}) => {
  // Determine the card mood based on medication status
  const cardMood = taken 
    ? "reassuring" 
    : skipped 
      ? "calm" 
      : overdue 
        ? "alert" 
        : timeSensitive 
          ? "energetic" 
          : "calm";
  
  // Determine elevation based on importance
  const elevation = overdue || timeSensitive ? "raised" : "flat";
  
  // Dynamic status based on medication state
  const statusVariant = taken 
    ? "positive" 
    : skipped 
      ? "neutral" 
      : overdue 
        ? "critical"
        : timeSensitive 
          ? "warning" 
          : "info";
  
  const statusText = taken 
    ? "Taken" 
    : skipped 
      ? "Skipped" 
      : overdue 
        ? "Overdue" 
        : timeSensitive 
          ? "Due Soon" 
          : "Upcoming";
  
  return (
    <div 
      className={cn(
        "rounded-lg border p-4",
        cardColors({ mood: cardMood, elevation }),
        taken && "opacity-75",
        className
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className={cn(
            "font-medium",
            taken && healthTextColors({ intent: "success" }),
            overdue && healthTextColors({ intent: "danger" }),
            timeSensitive && healthTextColors({ intent: "caution" })
          )}>
            {medicationName}
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <span>{dosage}</span>
            <span className="h-1 w-1 rounded-full bg-muted"></span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              {timeLabel}
            </span>
          </div>
        </div>
        
        <div className={cn(
          healthStatusColors({ intent: statusVariant, emphasis: "high", size: "sm" })
        )}>
          {statusText}
        </div>
      </div>
      
      {instructions && (
        <div className="mb-3 flex items-start gap-2 text-sm bg-secondary/30 p-2 rounded-md">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
          <p className="text-muted-foreground">{instructions}</p>
        </div>
      )}
      
      {overdue && (
        <div className="mb-3 flex items-start gap-2 text-sm bg-health-red-light/20 p-2 rounded-md">
          <AlertCircle className="h-4 w-4 text-health-red mt-0.5" />
          <p className="text-health-red">This medication is overdue. Please take it as soon as possible or contact your doctor.</p>
        </div>
      )}
      
      {!taken && !skipped && (
        <div className="flex items-center gap-2 mt-3">
          <button 
            onClick={onTake}
            className={cn(
              "flex-1 rounded-md py-1.5 flex items-center justify-center gap-1 text-sm",
              actionButtonColors({ 
                intent: overdue ? "danger" : "primary", 
                weight: "bold"
              })
            )}
            aria-label={`Take ${medicationName}`}
          >
            <Check className="h-4 w-4" />
            Take Now
          </button>
          
          <button 
            onClick={onSkip}
            className={cn(
              "flex-1 rounded-md py-1.5 flex items-center justify-center gap-1 text-sm",
              actionButtonColors({ 
                intent: "tertiary",
                weight: "regular" 
              })
            )}
            aria-label={`Skip ${medicationName}`}
          >
            <X className="h-4 w-4" />
            Skip
          </button>
          
          <button 
            onClick={onDetails}
            className={cn(
              "aspect-square rounded-md p-1.5",
              actionButtonColors({ intent: "secondary" })
            )}
            aria-label={`View details for ${medicationName}`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {(taken || skipped) && (
        <button
          onClick={onDetails}
          className={cn(
            "w-full rounded-md py-1.5 mt-3 flex items-center justify-center gap-1 text-sm",
            actionButtonColors({ intent: "secondary" })
          )}
          aria-label={`View details for ${medicationName}`}
        >
          View Details
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};