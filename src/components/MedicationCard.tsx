
import React from "react";
import { Pill, Clock, AlertTriangle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MedicationProps {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  refillDate: string;
  instructions?: string;
  isLowSupply?: boolean;
}

const MedicationCard = ({
  name,
  dosage,
  frequency,
  timeOfDay,
  refillDate,
  instructions,
  isLowSupply
}: MedicationProps) => {
  return (
    <div className="glass-card rounded-xl p-5 transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-primary/50">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">{dosage}</p>
        </div>
        <div className={cn(
          "p-2 rounded-full",
          "bg-health-purple/10"
        )}>
          <Pill className="h-5 w-5 text-health-purple" />
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{frequency}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-1">
          {timeOfDay.map((time, index) => (
            <span 
              key={index} 
              className="text-xs bg-secondary py-1 px-2 rounded-full"
            >
              {time}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Refill by {refillDate}</span>
        </div>
        
        {instructions && (
          <p className="text-sm mt-2 py-2 px-3 bg-secondary rounded-lg">
            {instructions}
          </p>
        )}
      </div>
      
      {isLowSupply && (
        <div className="mt-4 flex items-center gap-2 p-2 bg-health-red/10 text-health-red rounded-lg" role="alert">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">Low supply - refill soon</span>
        </div>
      )}
      
      <div className="mt-4">
        <button 
          className="w-full text-sm px-4 py-2 rounded-lg bg-health-purple text-white hover:bg-health-purple/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-health-purple"
          aria-label={`Request refill for ${name}`}
        >
          Request Refill
        </button>
      </div>
    </div>
  );
};

export default MedicationCard;
