import React from "react";
import { MedicationProps } from "@/components/MedicationCard";
import { cn } from "@/lib/utils";

interface MedicationGroupProps {
  title: string;
  description?: string;
  medications: MedicationProps[];
  className?: string;
  renderItem: (medication: MedicationProps) => React.ReactNode;
}

// This component applies Gestalt principles of proximity and similarity
// by grouping related medications visually together
const MedicationGroup: React.FC<MedicationGroupProps> = ({
  title,
  description,
  medications,
  className,
  renderItem
}) => {
  if (medications.length === 0) {
    return null;
  }

  return (
    <div className={cn("mb-8", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medications.map(renderItem)}
      </div>
    </div>
  );
};

export default MedicationGroup;
