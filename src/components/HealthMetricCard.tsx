
import React from "react";
import { cn } from "@/lib/utils";

interface HealthMetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  color: "teal" | "purple" | "orange" | "red" | "green" | "blue";
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  style?: React.CSSProperties;
}

const HealthMetricCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  color, 
  trend, 
  className,
  style
}: HealthMetricCardProps) => {
  return (
    <div 
      className={cn(
        "glass-card p-6 rounded-xl animate-fade-in",
        `card-gradient-${color}`,
        className
      )}
      style={style}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <div className="flex items-end gap-1">
            <p className="text-2xl font-semibold">{value}</p>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-health-green" : "text-health-red"
              )}>
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs. last month</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          "p-3 rounded-lg",
          `bg-health-${color}/10`
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default HealthMetricCard;
