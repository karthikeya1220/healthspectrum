
import React from "react";
import { Clock, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AppointmentProps {
  id: string;
  title: string;
  doctorName: string;
  location: string;
  dateTime: string;
  status: "upcoming" | "completed" | "cancelled";
  timeUntil?: string;
}

const AppointmentCard = ({ 
  title, 
  doctorName, 
  location, 
  dateTime, 
  status,
  timeUntil
}: AppointmentProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "upcoming":
        return "bg-health-blue-light text-health-blue";
      case "completed":
        return "bg-health-green-light text-health-green";
      case "cancelled":
        return "bg-health-red-light text-health-red";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "upcoming":
        return "Upcoming";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <div className="glass-card rounded-xl p-5 transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-primary/50">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-lg">{title}</h3>
          <div className="flex items-center gap-1 mt-1">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{doctorName}</span>
          </div>
        </div>
        <div className={cn("text-xs font-medium py-1 px-3 rounded-full", getStatusColor())}>
          {getStatusText()}
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{dateTime}</span>
          {timeUntil && status === "upcoming" && (
            <span className="text-xs bg-health-purple-light text-health-purple py-0.5 px-2 rounded-full">
              {timeUntil}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{location}</span>
        </div>
      </div>
      
      {status === "upcoming" && (
        <div className="mt-4 flex gap-2">
          <button 
            className="text-sm px-4 py-2 rounded-lg border border-health-blue text-health-blue hover:bg-health-blue hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-health-blue"
            aria-label={`Reschedule appointment: ${title}`}
          >
            Reschedule
          </button>
          <button 
            className="text-sm px-4 py-2 rounded-lg border border-health-red text-health-red hover:bg-health-red hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-health-red"
            aria-label={`Cancel appointment: ${title}`}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
