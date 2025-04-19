import React, { createContext, useContext, useState } from "react";
import { StatusIndicator } from "@/components/StatusIndicator";

type StatusType = "success" | "loading" | "error" | "warning" | "info";

interface StatusContextType {
  showStatus: (message: string, type: StatusType, duration?: number) => void;
  clearStatus: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const StatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<{
    message: string;
    type: StatusType;
    visible: boolean;
    duration: number;
  }>({
    message: "",
    type: "info",
    visible: false,
    duration: 3000,
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const showStatus = (message: string, type: StatusType, duration = 3000) => {
    setStatus({
      message,
      type,
      visible: true,
      duration,
    });
  };

  const clearStatus = () => {
    setStatus((prev) => ({ ...prev, visible: false }));
  };

  return (
    <StatusContext.Provider value={{ showStatus, clearStatus, isLoading, setIsLoading }}>
      {children}
      <StatusIndicator
        variant={status.type}
        message={status.message}
        isVisible={status.visible}
        autoHideDuration={status.duration}
        onClose={clearStatus}
      />
    </StatusContext.Provider>
  );
};

export const useStatus = (): StatusContextType => {
  const context = useContext(StatusContext);
  if (!context) {
    throw new Error("useStatus must be used within a StatusProvider");
  }
  return context;
};
